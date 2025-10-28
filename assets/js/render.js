window.Render = (function(){

  function updatePageTitle(mode, sesi){
    const t = document.getElementById('pageTitle');
    if(t) t.textContent = `${mode} — Sesi ${sesi}`;
  }
  function updateSessionLinks(toPracticeId, toExamId, sesi){
    const p = document.getElementById(toPracticeId);
    const e = document.getElementById(toExamId);
    if(p) p.href = `latihan.html?sesi=${sesi}`;
    if(e) e.href = `ujian.html?sesi=${sesi}`;
  }
  function updateCrossLinks(ids, sesi){
    const {learn, exam} = ids;
    const l = document.getElementById(learn);
    const e = document.getElementById(exam);
    if(l) l.href = `belajar.html?sesi=${sesi}`;
    if(e) e.href = `ujian.html?sesi=${sesi}`;
  }
  function updateExamLinks(ids, sesi){
    const {learn, practice} = ids;
    const l = document.getElementById(learn);
    const p = document.getElementById(practice);
    if(l) l.href = `belajar.html?sesi=${sesi}`;
    if(p) p.href = `latihan.html?sesi=${sesi}`;
  }

  function renderLearnList(containerId, items){
    const el = document.getElementById(containerId);
    if(!items || items.length===0){
      el.innerHTML = `<div class="empty">Belum ada item pada sesi ini.</div>`;
      return;
    }
    el.innerHTML = items.map((it, i)=>{
      const main = it.jp || it.kanji || it.word || it.text || it.prompt || `Item ${i+1}`;
      const hint = [
        it.hira ? `(${it.hira})` : '',
        it.romaji ? `• ${it.romaji}` : '',
        it.idn ? `• ${it.idn}` : ''
      ].filter(Boolean).join(' ');
      const extra = it.note ? `<div class="muted" style="margin-top:.3rem">${escapeHTML(it.note)}</div>` : '';
      return `
        <div class="option" style="align-items:flex-start">
          <div class="opt-text">
            <div><b>${escapeHTML(main)}</b> ${escapeHTML(hint)}</div>
            ${extra}
          </div>
        </div>`;
    }).join('');
  }

  function renderQuestion(containerId, q, idx, total, pickedKey=null){
    const el = document.getElementById(containerId);
    const opts = q.choices.map(c=>{
      const checked = pickedKey===c.key ? 'checked' : '';
      return `
        <label class="option">
          <input type="radio" name="opt" value="${c.key}" ${checked}/>
          <div class="opt-text"><b>${c.key}.</b> ${escapeHTML(c.text)}</div>
        </label>`;
    }).join('');
    el.innerHTML = `
      <div class="quiz-q">
        <div class="muted" style="margin-bottom:.35rem">Soal ${idx+1} dari ${total}</div>
        <div class="lead" style="margin-bottom:.5rem">${escapeHTML(q.prompt)}</div>
        ${opts}
      </div>`;
  }

  function readAnswer(){
    const sel = document.querySelector('input[name="opt"]:checked');
    return sel ? sel.value : null;
  }

  function updateProgress(id, n, total){
    const pill = document.getElementById(id);
    if(pill) pill.textContent = `Soal ${n} / ${total}`;
  }

  function toggleNavButtons(idx, total){
    const prev = document.getElementById('btnPrev');
    const next = document.getElementById('btnNext');
    const submit = document.getElementById('btnSubmit');
    if(prev) prev.disabled = (idx===0);
    if(next && submit){
      if(idx < total-1){ next.hidden=false; submit.hidden=true; }
      else { next.hidden=true; submit.hidden=false; }
    }
  }

  function showResult(result, sesi, {mode='practice'}={}){
    const stage = document.getElementById('quizStage');
    const card = document.getElementById('resultCard');
    const scoreLine = document.getElementById('scoreLine');
    const reviewBox = document.getElementById('answerReview');
    const retry = document.getElementById('retryLink');
    const learn = document.getElementById('learnLink');

    stage.closest('.card').classList.add('hidden');
    card.classList.remove('hidden');

    scoreLine.textContent = `Skor: ${result.correct}/${result.total}`;
    reviewBox.innerHTML = result.review.map(r=>{
      const choiceLines = r.choices.map(c=>{
        const mark = c.key===r.correct ? '✅' : (c.key===r.picked ? '❌' : '•');
        return `<div class="muted">${mark} ${c.key}. ${escapeHTML(c.text)}</div>`;
      }).join('');
      return `
        <div class="card" style="margin:.6rem 0;padding:.8rem">
          <div style="margin-bottom:.35rem"><b>${r.index}.</b> ${escapeHTML(r.prompt)}</div>
          ${choiceLines}
        </div>`;
    }).join('');

    retry.href = location.pathname + `?sesi=${sesi}`;
    learn.href = `belajar.html?sesi=${sesi}`;
  }

  function escapeHTML(s){
    return String(s)
      .replaceAll('&','&amp;').replaceAll('<','&lt;')
      .replaceAll('>','&gt;').replaceAll('"','&quot;')
      .replaceAll("'",'&#39;');
  }

  return {
    updatePageTitle,
    updateSessionLinks,
    updateCrossLinks,
    updateExamLinks,
    renderLearnList,
    renderQuestion,
    readAnswer,
    updateProgress,
    toggleNavButtons,
    showResult
  };
})();