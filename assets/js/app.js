import { el, skeletonLines, renderLearnList, renderQuestionCard, renderReview } from './render.js';

const state = {
  mode: 'learn',       // 'learn' | 'practice' | 'exam'
  session: 's1',       // 's1'..'s4'
  data: { s1: [], s2: [], s3: [], s4: [] },
  // practice
  pIndex: 0,
  pAnswers: [],
  // exam
  eIndex: 0,
  eAnswers: [],
};

const panels = {
  learn: document.getElementById('panel-learn'),
  practice: document.getElementById('panel-practice'),
  exam: document.getElementById('panel-exam'),
};

const learnList = document.getElementById('learnList');
const learnSessName = document.getElementById('learnSessionName');
const practiceSessName = document.getElementById('practiceSessionName');
const examSessName = document.getElementById('examSessionName');

// Practice controls
const pStage = document.getElementById('practiceStage');
const btnPrevP = document.getElementById('btnPrevP');
const btnNextP = document.getElementById('btnNextP');
const btnSubmitP = document.getElementById('btnSubmitP');
const pResult = document.getElementById('practiceResult');
const pScore = document.getElementById('practiceScore');
const pReview = document.getElementById('practiceReview');
const btnRetryP = document.getElementById('btnRetryP');

// Exam controls
const eStage = document.getElementById('examStage');
const btnPrevE = document.getElementById('btnPrevE');
const btnNextE = document.getElementById('btnNextE');
const btnFinishE = document.getElementById('btnFinishE');
const eResult = document.getElementById('examResult');
const eScore = document.getElementById('examScore');
const eReview = document.getElementById('examReview');
const btnRetryE = document.getElementById('btnRetryE');

boot();

async function boot(){
  attachNav();
  await loadData();
  applyHash(); // initial route
  if ('serviceWorker' in navigator) {
    try { navigator.serviceWorker.register('./sw.js'); } catch {}
  }
}

function attachNav(){
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      state.mode = btn.dataset.mode;
      updateTabs();
      render();
      updateHash();
    });
  });
  document.querySelectorAll('.chip').forEach(ch=>{
    ch.addEventListener('click', ()=>{
      state.session = ch.dataset.session;
      updateChips();
      resetModeState();
      render();
      updateHash();
    });
  });

  // Practice events
  btnPrevP.onclick = ()=> { saveCurrent('practice'); step(-1,'practice'); };
  btnNextP.onclick = ()=> { saveCurrent('practice'); step(+1,'practice'); };
  btnSubmitP.onclick = ()=> { saveCurrent('practice'); showPracticeResult(); };
  btnRetryP.onclick = ()=> { resetPractice(); renderPractice(); };

  // Exam events
  btnPrevE.onclick = ()=> { saveCurrent('exam'); step(-1,'exam'); };
  btnNextE.onclick = ()=> { saveCurrent('exam'); step(+1,'exam'); };
  btnFinishE.onclick = ()=> { saveCurrent('exam'); showExamResult(); };
  btnRetryE.onclick = ()=> { resetExam(); renderExam(); };

  window.addEventListener('hashchange', applyHash);
}

function updateTabs(){
  document.querySelectorAll('.tab').forEach(b=>b.setAttribute('aria-selected', b.dataset.mode===state.mode));
  Object.keys(panels).forEach(k => panels[k].classList.toggle('active', k===state.mode));
}
function updateChips(){
  document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-selected', c.dataset.session===state.session));
  learnSessName.textContent = sessionLabel();
  practiceSessName.textContent = sessionLabel();
  examSessName.textContent = sessionLabel();
}
function sessionLabel(){
  return 'Sesi ' + state.session.toUpperCase().replace('S','');
}

function updateHash(){
  location.hash = `#${state.mode}-${state.session}`;
}
function applyHash(){
  const m = location.hash.match(/#(learn|practice|exam)-(s[1-4])/i);
  if (m){ state.mode=m[1]; state.session=m[2]; }
  updateTabs(); updateChips();
  resetModeState(); render();
}

async function loadData(){
  try{
    const res = await fetch('data/jft-keys.json', {cache:'no-store'});
    const json = await res.json();
    // expect { s1:[], s2:[], s3:[], s4:[] }
    state.data = Object.assign({s1:[],s2:[],s3:[],s4:[]}, json || {});
  }catch{
    state.data = {s1:[],s2:[],s3:[],s4:[]};
  }
}

/* RENDER ROUTER */
function render(){
  if (state.mode==='learn') renderLearn();
  else if (state.mode==='practice') renderPractice();
  else renderExam();
}

/* LEARN */
function renderLearn(){
  learnList.innerHTML = '';
  learnList.append(skeletonLines(3));
  const items = state.data[state.session] || [];
  setTimeout(()=>renderLearnList(learnList, items), 100);
}

/* PRACTICE */
function resetPractice(){
  state.pIndex = 0;
  state.pAnswers = [];
  pResult.classList.add('hidden');
}
function renderPractice(){
  const qs = toQuestions(state.data[state.session]);
  if (!qs.length){
    pStage.innerHTML = `<div class="card"><div class="muted">Belum ada soal.</div></div>`;
    btnPrevP.disabled = btnNextP.disabled = btnSubmitP.disabled = true;
    return;
  }
  btnPrevP.disabled = state.pIndex===0;
  btnNextP.disabled = state.pIndex===qs.length-1;
  btnSubmitP.disabled = false;

  const selected = state.pAnswers[state.pIndex] ?? null;
  renderQuestionCard(pStage, qs[state.pIndex], state.pIndex, qs.length, selected, false);
}
function showPracticeResult(){
  const qs = toQuestions(state.data[state.session]);
  const total = qs.length;
  const score = qs.reduce((acc,q,i)=>acc + (q.correctKey === (state.pAnswers[i]??null) ? 1:0), 0);
  pScore.textContent = `Skor: ${score} / ${total}`;
  renderReview(pReview, qs, state.pAnswers);
  pResult.classList.remove('hidden');
}

/* EXAM */
function resetExam(){
  state.eIndex = 0;
  state.eAnswers = [];
  eResult.classList.add('hidden');
}
function renderExam(){
  const qs = toQuestions(state.data[state.session]);
  if (!qs.length){
    eStage.innerHTML = `<div class="card"><div class="muted">Belum ada soal.</div></div>`;
    btnPrevE.disabled = btnNextE.disabled = btnFinishE.disabled = true;
    return;
  }
  btnPrevE.disabled = state.eIndex===0;
  btnNextE.disabled = state.eIndex===qs.length-1;
  btnFinishE.disabled = false;

  const selected = state.eAnswers[state.eIndex] ?? null;
  renderQuestionCard(eStage, qs[state.eIndex], state.eIndex, qs.length, selected, false);
}
function showExamResult(){
  const qs = toQuestions(state.data[state.session]);
  const total = qs.length;
  const score = qs.reduce((acc,q,i)=>acc + (q.correctKey === (state.eAnswers[i]??null) ? 1:0), 0);
  eScore.textContent = `Skor: ${score} / ${total}`;
  renderReview(eReview, qs, state.eAnswers);
  eResult.classList.remove('hidden');
}

/* helpers */
function saveCurrent(mode){
  const stage = mode==='practice' ? pStage : eStage;
  const idx = mode==='practice' ? state.pIndex : state.eIndex;
  const sel = stage.querySelector('input[type="radio"]:checked');
  const key = sel ? sel.value : null;
  if (mode==='practice') state.pAnswers[idx] = key;
  else state.eAnswers[idx] = key;
}
function step(n, mode){
  if (mode==='practice'){
    state.pIndex = clamp(state.pIndex + n, 0, toQuestions(state.data[state.session]).length-1);
    renderPractice();
  }else{
    state.eIndex = clamp(state.eIndex + n, 0, toQuestions(state.data[state.session]).length-1);
    renderExam();
  }
}
function clamp(x, a, b){ return Math.max(a, Math.min(b, x)); }

/* convert learn items to simple MCQ (fallback) */
function toQuestions(items){
  // Expect item: { jp, hira, id, choices?, correctKey? }
  // If not provided, generate dummy 3 pilihan dari teks yang sama.
  return (items||[]).map((it, i) => {
    if (it.choices && it.correctKey) return it;
    const text = `${it.jp ?? it.prompt ?? ''} ${it.hira ? '('+it.hira+')':''}`;
    return {
      id: i+1,
      prompt: text || `Item ${i+1}`,
      choices: [
        {t: it.id ?? it.idn ?? '—', key:'A'},
        {t: '—', key:'B'},
        {t: '—', key:'C'},
      ],
      correctKey:'A'
    };
  });
}