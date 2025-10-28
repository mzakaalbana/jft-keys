/* Global App (SPA) */
window.App = (function(){
  const DataURL = 'data/jft-keys.json';

  const state = {
    route: 'belajar', // 'belajar' | 'latihan' | 'ujian'
    sesi: 1,
    data: null,

    // latihan
    bank: [],
    answers: [],
    idx: 0,

    // ujian
    bankExam: [],
    answersExam: [],
    idxExam: 0
  };

  // --- Routing (hash based) ---
  function parseHash(){
    // e.g. #/latihan?sesi=3
    const hash = location.hash || '#/belajar?sesi=1';
    const [path, q] = hash.split('?');
    const route = (path.replace('#/','') || 'belajar').toLowerCase();
    const params = new URLSearchParams(q || '');
    const sesi = Number(params.get('sesi') || '1');
    state.route = ['belajar','latihan','ujian'].includes(route) ? route : 'belajar';
    state.sesi = [1,2,3,4].includes(sesi) ? sesi : 1;
  }

  function goto(route, sesi){
    location.hash = `#/${route}?sesi=${sesi}`;
  }

  function syncTopbarUI(){
    // Tabs
    document.querySelectorAll('.tab').forEach(btn=>{
      const r = btn.getAttribute('data-route');
      const active = r === state.route;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    // Session segmentation
    document.querySelectorAll('.session-seg .seg').forEach(seg=>{
      const s = Number(seg.getAttribute('data-sesi'));
      seg.classList.toggle('active', s === state.sesi);
    });
  }

  // --- Data ---
  async function loadData(){
    if(state.data) return state.data;
    const res = await fetch(DataURL,{cache:'no-store'});
    if(!res.ok) throw new Error('Gagal memuat data');
    state.data = await res.json();
    return state.data;
  }

  function pickSession(db, sesi){
    const sess = db.sessions[String(sesi)];
    if(!sess || !Array.isArray(sess.items)) return {title:`Sesi ${sesi}`, items:[]};
    return sess;
  }

  // --- Question builders ---
  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  function pickDistractors(items, current, n){
    const pool = shuffle(items.filter(x=>x!==current));
    return pool.slice(0, n);
  }

  function toMCQ(items){
    // If item has explicit prompt/choices/answerKey -> use as is
    // else auto create 1 correct (jp/kanji/word) + 2 distractors
    return items.map((it, i)=>{
      if(it.choices && it.answerKey){
        return {
          id: it.id || i+1,
          prompt: it.prompt || (it.jp || it.text || 'Pilih jawaban yang tepat'),
          choices: it.choices.map((c,idx)=>({ key:String.fromCharCode(65+idx), text:c })),
          correctKey: it.answerKey
        };
      }
      const correct = it.jp || it.kanji || it.word || it.text || '—';
      const distractors = pickDistractors(items, it, 2)
        .map(d => d.jp || d.kanji || d.word || d.text || '×');
      const options = shuffle([correct, ...distractors]).map((t,idx)=>({
        key:String.fromCharCode(65+idx), text:t
      }));
      const correctKey = options.find(c=>c.text===correct)?.key || 'A';
      const prompt = it.meaning || it.idn || it.prompt || 'Pilih jawaban yang benar';
      return {
        id: it.id || i+1,
        prompt, choices: options, correctKey
      };
    });
  }

  function buildPractice(items){
    const mcq = toMCQ(items);
    return mcq.slice(0, Math.min(20, mcq.length));
  }

  function buildExam(items){
    const mcq = shuffle(toMCQ(items));
    return mcq; // full set
  }

  // --- Scoring ---
  function score(bank, answers){
    let correct = 0;
    const review = bank.map((q,i)=>{
      const picked = answers[i] ?? null;
      const ok = picked === q.correctKey;
      if(ok) correct++;
      return {
        index:i+1, prompt:q.prompt, choices:q.choices, picked, correct:q.correctKey
      };
    });
    return { total: bank.length, correct, review };
  }

  // --- Boot & Handlers ---
  async function render(){
    syncTopbarUI();
    const db = await loadData();
    const sess = pickSession(db, state.sesi);

    // BELAJAR
    Render.setText('titleBelajarSesi', `Sesi ${state.sesi}`);
    Render.setText('subtitleBelajar', `${sess.title || 'Sesi '+state.sesi} • ${sess.items.length} item`);
    Render.renderLearnList('learnList', sess.items);

    // LATIHAN
    Render.setText('titleLatihanSesi', `Sesi ${state.sesi}`);
    if(state.route==='latihan'){
      state.bank = buildPractice(sess.items);
      state.answers = [];
      state.idx = 0;
      if(state.bank.length===0){
        Render.emptyQuiz('quizStage', 'Belum ada data latihan pada sesi ini.');
      }else{
        Render.renderQuestion('quizStage', state.bank[state.idx], state.idx, state.bank.length, null);
        Render.updateProgress('quizProgress', state.idx+1, state.bank.length);
        Render.toggleNavButtons('btnPrev','btnNext','btnSubmit', state.idx, state.bank.length);
      }
      Render.hide('resultCard');
      Render.show('.quiz', true, document.getElementById('view-latihan'));
    }

    // UJIAN
    Render.setText('titleUjianSesi', `Sesi ${state.sesi}`);
    if(state.route==='ujian'){
      state.bankExam = buildExam(sess.items);
      state.answersExam = [];
      state.idxExam = 0;
      if(state.bankExam.length===0){
        Render.emptyQuiz('examStage', 'Belum ada data ujian pada sesi ini.');
      }else{
        Render.renderQuestion('examStage', state.bankExam[state.idxExam], state.idxExam, state.bankExam.length, null);
        Render.updateProgress('examProgress', state.idxExam+1, state.bankExam.length);
        Render.toggleNavButtons('btnPrevExam','btnNextExam','btnSubmitExam', state.idxExam, state.bankExam.length);
      }
      Render.hide('examResultCard');
      Render.show('.quiz', true, document.getElementById('view-ujian'));
    }

    // Toggle view
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    document.getElementById(`view-${state.route}`).classList.add('active');
  }

  function attachEvents(){
    // Tab clicks
    document.querySelectorAll('.tab').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const r = btn.getAttribute('data-route');
        goto(r, state.sesi);
      });
    });
    // Session seg
    document.querySelectorAll('.session-seg .seg').forEach(seg=>{
      seg.addEventListener('click', ()=>{
        const s = Number(seg.getAttribute('data-sesi'));
        goto(state.route, s);
      });
    });

    // Routing
    window.addEventListener('hashchange', ()=>{
      parseHash();
      render();
    });

    // LATIHAN nav
    Render.onClick('btnPrev', ()=>{
      if(state.idx>0){
        state.idx--;
        Render.renderQuestion('quizStage', state.bank[state.idx], state.idx, state.bank.length, state.answers[state.idx]);
        Render.updateProgress('quizProgress', state.idx+1, state.bank.length);
        Render.toggleNavButtons('btnPrev','btnNext','btnSubmit', state.idx, state.bank.length);
      }
    });
    Render.onClick('btnNext', ()=>{
      const sel = Render.readAnswer();
      if(sel==null) return alert('Pilih jawaban terlebih dahulu.');
      state.answers[state.idx]=sel;
      if(state.idx<state.bank.length-1){
        state.idx++;
        Render.renderQuestion('quizStage', state.bank[state.idx], state.idx, state.bank.length, state.answers[state.idx]);
        Render.updateProgress('quizProgress', state.idx+1, state.bank.length);
        Render.toggleNavButtons('btnPrev','btnNext','btnSubmit', state.idx, state.bank.length);
      }
    });
    Render.onClick('btnSubmit', ()=>{
      const sel = Render.readAnswer();
      if(sel==null) return alert('Pilih jawaban terlebih dahulu.');
      state.answers[state.idx]=sel;
      const result = score(state.bank, state.answers);
      Render.showResult('resultCard','scoreLine','answerReview', result, state.sesi, {mode:'practice'});
    });
    Render.onClick('btnRetryLatihan', ()=>{
      goto('latihan', state.sesi);
    });
    Render.onClick('btnResetLatihan', ()=>{
      goto('latihan', state.sesi);
    });

    // UJIAN nav
    Render.onClick('btnPrevExam', ()=>{
      if(state.idxExam>0){
        state.idxExam--;
        Render.renderQuestion('examStage', state.bankExam[state.idxExam], state.idxExam, state.bankExam.length, state.answersExam[state.idxExam]);
        Render.updateProgress('examProgress', state.idxExam+1, state.bankExam.length);
        Render.toggleNavButtons('btnPrevExam','btnNextExam','btnSubmitExam', state.idxExam, state.bankExam.length);
      }
    });
    Render.onClick('btnNextExam', ()=>{
      const sel = Render.readAnswer();
      if(sel==null) return alert('Pilih jawaban terlebih dahulu.');
      state.answersExam[state.idxExam]=sel;
      if(state.idxExam<state.bankExam.length-1){
        state.idxExam++;
        Render.renderQuestion('examStage', state.bankExam[state.idxExam], state.idxExam, state.bankExam.length, state.answersExam[state.idxExam]);
        Render.updateProgress('examProgress', state.idxExam+1, state.bankExam.length);
        Render.toggleNavButtons('btnPrevExam','btnNextExam','btnSubmitExam', state.idxExam, state.bankExam.length);
      }
    });
    Render.onClick('btnSubmitExam', ()=>{
      const sel = Render.readAnswer();
      if(sel==null) return alert('Pilih jawaban terlebih dahulu.');
      state.answersExam[state.idxExam]=sel;
      const result = score(state.bankExam, state.answersExam);
      Render.showResult('examResultCard','examScoreLine','examAnswerReview', result, state.sesi, {mode:'exam'});
    });
    Render.onClick('btnRetryUjian', ()=>{
      goto('ujian', state.sesi);
    });

    // Quick route-jump buttons
    document.querySelectorAll('[data-route-jump]').forEach(b=>{
      b.addEventListener('click', ()=>{
        const r = b.getAttribute('data-route-jump');
        goto(r, state.sesi);
      });
    });
  }

  async function boot(){
    parseHash();
    attachEvents();
    await render();
  }

  return { boot };
})();

// Boot
window.addEventListener('DOMContentLoaded', App.boot);