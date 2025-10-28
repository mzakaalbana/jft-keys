window.App = (function(){
  const DataURL = 'data/jft-keys.json';

  function getSessionFromURL(){
    const u = new URL(location.href);
    const s = Number(u.searchParams.get('sesi') || '1');
    return [1,2,3,4].includes(s) ? s : 1;
  }

  async function loadData(){
    const res = await fetch(DataURL, {cache:'no-store'});
    if(!res.ok) throw new Error('Gagal memuat data');
    return res.json();
  }

  function pickSession(db, sesi){
    const key = String(sesi);
    const sess = db.sessions[key];
    if(!sess) throw new Error('Sesi tidak ditemukan');
    return sess;
  }

  function replaceURLParam(key, value){
    const u = new URL(location.href);
    u.searchParams.set(key, value);
    history.replaceState(null, '', u.toString());
  }

  // Builder soal dari item belajar → opsi MCQ.
  // Rule sederhana:
  // - Jika item punya field choices -> gunakan apa adanya.
  // - Jika tidak, generate 3 opsi: 1 benar (label jp/main) + 2 distraktor dari item lain dalam sesi.
  function buildPracticeBank(items){
    return buildMCQ(items, {limit: Math.min(20, items.length)});
  }
  function buildExamBank(items){
    return buildMCQ(items, {limit: items.length, shuffle:true});
  }

  function buildMCQ(items, {limit, shuffle=false}={}){
    const pool = shuffle ? shuffleArray([...items]) : [...items];
    const picked = pool.slice(0, limit).map((it, idx)=>{
      if(it.choices && it.answer){
        return {
          id: it.id || idx+1,
          prompt: it.prompt || (it.jp || it.text || 'Pilih jawaban yang tepat'),
          choices: it.choices.map((c,i)=>({ key:String.fromCharCode(65+i), text:c })),
          correctKey: it.answerKey || it.answerKey || 'A'
        };
      }
      // auto generate
      const correct = it.jp || it.kanji || it.text || it.word || it.prompt || '—';
      const distractors = pickDistractors(items, it, 2)
        .map(d => d.jp || d.kanji || d.text || d.word || '×');
      const choices = shuffleArray([correct, ...distractors]).map((t,i)=>({
        key: String.fromCharCode(65+i),
        text: t
      }));
      const correctKey = choices.find(c=>c.text===correct)?.key || 'A';
      const prompt = it.prompt || it.meaning || it.idn || it.description || (it.type ? `[${it.type}]` : 'Pilih yang benar');
      return {
        id: it.id || idx+1,
        prompt,
        choices,
        correctKey
      };
    });
    return picked;
  }

  function pickDistractors(items, current, n){
    const base = items.filter(x=>x!==current);
    const pool = shuffleArray(base).slice(0, Math.max(n,0));
    return pool;
  }

  function scoreBank(bank, answers){
    let correct = 0;
    const review = bank.map((q,i)=>{
      const picked = answers[i] ?? null;
      const ok = picked === q.correctKey;
      if(ok) correct++;
      return { index:i+1, prompt:q.prompt, choices:q.choices, picked, correct:q.correctKey };
    });
    return { total: bank.length, correct, review };
  }

  function shuffleArray(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  return {
    getSessionFromURL,
    loadData,
    pickSession,
    replaceURLParam,
    buildPracticeBank,
    buildExamBank,
    scoreBank
  };
})();