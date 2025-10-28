// ====== Config & State ======
const DATA_URL = "data/kisi-jft.json";
const state = {
  data: null,            // JSON bank
  route: "belajar",      // belajar | latihan | ujian
  currentSessionId: null,
  learnFilter: "",
  // Latihan
  drillIdx: 0,
  drillOrder: [],
  drillMarks: {}, // index -> "ok" | "ng"
  // Ujian
  quizItems: [],
  quizIdx: 0,
  quizAnswers: {}, // idx -> choice string
};

// ====== Helpers ======
const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);
const show = (el) => el.classList.remove("hidden");
const hide = (el) => el.classList.add("hidden");
const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));
const shuffle = (arr) => arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);

function getSessionById(id){
  return state.data?.sessions?.find(s=>String(s.id)===String(id));
}
function currentItems(){
  const s = getSessionById(state.currentSessionId);
  return s?.items || [];
}
function persist(){
  try{
    localStorage.setItem("kisi-jft-prefs", JSON.stringify({
      currentSessionId: state.currentSessionId,
      route: state.route,
    }));
  }catch{}
}
function restore(){
  try{
    const saved = JSON.parse(localStorage.getItem("kisi-jft-prefs")||"{}");
    if(saved.currentSessionId) state.currentSessionId = saved.currentSessionId;
    if(saved.route) state.route = saved.route;
  }catch{}
}

// ====== UI: Tabs / Routing ======
function setRoute(route){
  state.route = route;
  persist();

  $$(".tab").forEach(t=>{
    const r = t.getAttribute("data-route");
    t.classList.toggle("is-active", r===route);
    t.setAttribute("aria-selected", r===route ? "true":"false");
  });

  ["belajar","latihan","ujian"].forEach(r=>{
    const el = $("#screen-"+r);
    if(!el) return;
    if(r===route) show(el); else hide(el);
  });

  if(route==="belajar") renderBelajar();
  if(route==="latihan") bootLatihan();
  if(route==="ujian") bootUjian();
}

// ====== Populate Session Select ======
function populateSessions(){
  const sel = $("#sessionSelect");
  sel.innerHTML = "";
  (state.data?.sessions || []).forEach(s=>{
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.title || ("Sesi " + s.id);
    sel.appendChild(opt);
  });
  // default
  if(!state.currentSessionId){
    state.currentSessionId = state.data?.sessions?.[0]?.id || 1;
  }
  sel.value = state.currentSessionId;
}

// ====== Belajar ======
function renderBelajar(){
  const list = $("#learnList");
  const empty = $("#emptyLearn");
  const items = currentItems();
  const q = (state.learnFilter||"").trim().toLowerCase();

  let view = items.map((t,i)=>({i:i+1, t, k: t.toLowerCase()}));
  if(q) view = view.filter(x=>x.k.includes(q));

  list.innerHTML = "";
  if(view.length===0){
    show(empty); return;
  } else hide(empty);

  const frag = document.createDocumentFragment();
  view.forEach(row=>{
    const it = document.createElement("div");
    it.className = "item";
    const num = document.createElement("div");
    num.className = "idx";
    num.textContent = row.i;
    const text = document.createElement("div");
    text.className = "text";
    text.innerHTML = highlight(row.t, q);
    it.appendChild(num);
    it.appendChild(text);
    it.addEventListener("click", ()=> it.classList.toggle("hl-wrap"));
    frag.appendChild(it);
  });
  list.appendChild(frag);
}
function highlight(text, q){
  if(!q) return escapeHtml(text);
  const escQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escapeHtml(text).replace(new RegExp(escQ,'gi'), m=>`<span class="hl">${m}</span>`);
}
function escapeHtml(s){ return s.replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c])) }

// ====== Latihan (Flashcard) ======
function bootLatihan(){
  const items = currentItems();
  const empty = $("#emptyDrill");
  if(items.length===0){ show(empty); hide($("#drillBox")); return; }
  hide(empty); show($("#drillBox"));

  state.drillOrder = items.map((_,i)=>i);
  state.drillIdx = 0;
  state.drillMarks = {};
  renderDrill();
}
function renderDrill(){
  const items = currentItems();
  const idx = clamp(state.drillIdx,0, items.length-1);
  state.drillIdx = idx;

  $("#drillText").textContent = items[idx] || "—";
  $("#drillNum").textContent = `${idx+1}/${items.length}`;
  $("#btnPrev").disabled = idx===0;

  // progress bar: jumlah ok dari total
  const okCount = Object.values(state.drillMarks).filter(v=>v==="ok").length;
  const ratio = items.length ? Math.round((okCount/items.length)*100) : 0;
  $("#drillBar").style.width = ratio+"%";
  $("#drillStat").textContent = `Ingat: ${okCount} • Ulangi: ${Object.values(state.drillMarks).filter(v=>v==="ng").length}`;
}
function markDrill(type){ // "ok" | "ng"
  state.drillMarks[state.drillIdx] = type;
  renderDrill();
}
function nextDrill(){
  state.drillIdx = clamp(state.drillIdx+1, 0, currentItems().length-1);
  renderDrill();
}
function prevDrill(){
  state.drillIdx = clamp(state.drillIdx-1, 0, currentItems().length-1);
  renderDrill();
}

// ====== Ujian Cepat (MCQ sederhana) ======
function bootUjian(){
  const items = currentItems();
  const empty = $("#emptyQuiz");
  if(items.length<4){
    $("#quizBox").classList.add("hidden");
    show(empty);
    return;
  }
  hide(empty);
  $("#quizBox").classList.remove("hidden");

  $("#quizStage").classList.add("hidden");
  $("#quizResult").classList.add("hidden");
  $("#btnStartQuiz").classList.remove("hidden");
  $("#quizProg").textContent = `Soal 0/0`;
}

function startQuiz(){
  const pool = currentItems().slice();
  const take = Math.min(10, pool.length);
  const indices = shuffle([...Array(pool.length)].map((_,i)=>i)).slice(0,take);
  state.quizItems = indices.map(i=>pool[i]);
  state.quizIdx = 0;
  state.quizAnswers = {};
  $("#btnStartQuiz").classList.add("hidden");
  show($("#quizStage"));
  hide($("#quizResult"));
  renderQuiz();
}

function renderQuiz(){
  const i = clamp(state.quizIdx, 0, state.quizItems.length-1);
  state.quizIdx = i;

  $("#qNum").textContent = `${i+1}/${state.quizItems.length}`;
  $("#quizProg").textContent = `Soal ${i+1}/${state.quizItems.length}`;
  const question = state.quizItems[i];
  $("#qText").textContent = question;

  // buat 4 opsi: 1 benar (teks sama), 3 pengecoh dari item lain
  const pool = currentItems().filter(t=>t!==question);
  const decoys = shuffle(pool).slice(0,3);
  const options = shuffle([question, ...decoys]);

  const box = $("#qOptions");
  box.innerHTML = "";
  options.forEach(opt=>{
    const id = `opt-${i}-${btoa(opt).slice(0,6)}`;
    const label = document.createElement("label");
    label.className = "opt";
    label.innerHTML = `
      <input type="radio" name="q${i}" id="${id}" value="${escapeHtml(opt)}">
      <span>${escapeHtml(opt)}</span>
    `;
    const input = label.querySelector("input");
    input.checked = state.quizAnswers[i] === opt;
    input.addEventListener("change", ()=>{ state.quizAnswers[i] = opt; });
    box.appendChild(label);
  });

  $("#btnPrevQ").disabled = i===0;
  if(i===state.quizItems.length-1){
    $("#btnNextQ").classList.add("hidden");
    $("#btnSubmitQuiz").classList.remove("hidden");
  }else{
    $("#btnNextQ").classList.remove("hidden");
    $("#btnSubmitQuiz").classList.add("hidden");
  }
}

function nextQ(){ state.quizIdx = clamp(state.quizIdx+1,0,state.quizItems.length-1); renderQuiz(); }
function prevQ(){ state.quizIdx = clamp(state.quizIdx-1,0,state.quizItems.length-1); renderQuiz(); }

function submitQuiz(){
  const items = state.quizItems;
  let correct = 0;
  const review = [];

  items.forEach((q,i)=>{
    const ans = state.quizAnswers[i];
    const ok = ans === q;
    if(ok) correct++;
    review.push({q, ans, ok});
  });

  $("#quizScore").textContent = `Skor: ${correct}/${items.length}`;
  const box = $("#quizReview");
  box.innerHTML = "";
  review.forEach((r,idx)=>{
    const div = document.createElement("div");
    const badge = `<span class="badge ${r.ok?'ok':'ng'}">${r.ok?'Benar':'Salah'}</span>`;
    div.innerHTML = `${idx+1}. ${escapeHtml(r.q)} ${badge}` + (r.ok ? "" : `<br><span class="muted tiny">Jawabanmu: ${escapeHtml(r.ans||"—")}</span>`);
    box.appendChild(div);
  });

  hide($("#quizStage"));
  show($("#quizResult"));
}

function retryQuiz(){
  bootUjian();
  startQuiz();
}

// ====== Boot ======
async function boot(){
  // year
  $("#y").textContent = new Date().getFullYear();

  restore();

  // tabs
  $$(".tab").forEach(t=>{
    t.addEventListener("click", ()=>{
      setRoute(t.getAttribute("data-route"));
    });
  });

  // selects & inputs
  $("#sessionSelect").addEventListener("change", (e)=>{
    state.currentSessionId = e.target.value;
    persist();
    // rerender all screens relevant
    renderBelajar();
    if(state.route==="latihan") bootLatihan();
    if(state.route==="ujian") bootUjian();
  });
  $("#searchInput").addEventListener("input", (e)=>{
    state.learnFilter = e.target.value || "";
    renderBelajar();
  });
  $("#btnShuffle").addEventListener("click", ()=>{
    // hanya urutan tampilan belajar diacak dengan cara mengganti urutan data? Simpel: shuffle copy saat render… 
    // trik cepat: set filter ke dirinya supaya re-render; dan acak index di list => kita cukup pakai highlight render default + acak DOM:
    const list = $("#learnList");
    const nodes = Array.from(list.children);
    shuffle(nodes).forEach(n=>list.appendChild(n));
  });

  // latihan
  $("#btnPrev").addEventListener("click", prevDrill);
  $("#btnNext").addEventListener("click", nextDrill);
  $("#btnAgain").addEventListener("click", ()=>markDrill("ng"));
  $("#btnKnow").addEventListener("click", ()=>markDrill("ok"));

  // ujian
  $("#btnStartQuiz").addEventListener("click", startQuiz);
  $("#btnPrevQ").addEventListener("click", prevQ);
  $("#btnNextQ").addEventListener("click", nextQ);
  $("#btnSubmitQuiz").addEventListener("click", submitQuiz);
  $("#btnRetry").addEventListener("click", retryQuiz);

  // load data
  try{
    const res = await fetch(DATA_URL, {cache:"no-store"});
    state.data = await res.json();
  }catch(err){
    console.error("Gagal memuat data:", err);
    state.data = { brand:"KISI-KISI JFT", version:"1.0", sessions:[] };
  }

  populateSessions();
  setRoute(state.route || "belajar");
  renderBelajar();
}

document.addEventListener("DOMContentLoaded", boot);