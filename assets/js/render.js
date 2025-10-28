/* Render helpers only */
window.Render = (function(){
  function $(sel, root=document){
    return root.querySelector(sel);
  }
  function $all(sel, root=document){
    return Array.from(root.querySelectorAll(sel));
  }

  function setText(id, text){
    const el = document.getElementById(id);
    if(el) el.textContent = text;
  }

  function htmlEscape(s){
    return String(s)
      .replaceAll('&','&amp;').replaceAll('<','&lt;')
      .replaceAll('>','&gt;').replaceAll('"','&quot;')
      .replaceAll("'",'&#39;');
  }

  function renderLearnList(containerId, items){
    const el = document.getElementById(containerId);
    if(!el) return;
    if(!items || items.length===0){
      el.innerHTML = `<div class="empty">Belum ada item pada sesi ini.</div>`;
      return;
    }
    el.innerHTML = items.map((it, i)=>{
      // Main line: Kanji/JP — with (hiragana)
      const main = it.jp || it.kanji || it.word || it.text || `Item ${i+1}`;
      const hira = it.hira ? ` (${htmlEscape(it.hira)})` : '';
      const romaji = it.romaji ? ` • ${htmlEscape(it.romaji)}` : '';
      const idn = it.idn ? ` • ${htmlEscape(it.idn)}` : '';
      const line2 = [romaji, idn].filter(Boolean).join('');

      const tag = it.type ? `<span class="tag">${htmlEscape(it.type)}</span>` : '';
      const note = it.note ? `<div class="anno">${htmlEscape(it.note)}</div>` : '';

      return `
        <div class="row">
          <div class="content">
            <div class="main">${htmlEscape(main)}${hira}</div>
            ${line2 ? `<div class="anno">${line2}</div>` : ''}
            ${tag}${note}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderQuestion(containerId, q, idx, total, pickedKey=null){
    const el = document.getElementById(containerId);
    if(!el) return;
    const opts = q.choices.map(c=>{
      const checked = pickedKey===c.key ? 'checked' : '';
      return `
        <label class="option">
          <input type="radio" name="opt" value="${c.key}" ${checked}/>
          <div class="opt-text"><b>${c.key}.</b> ${htmlEscape(c.text)}</div>
        </label>`;
    }).join('');
    el.innerHTML = `
      <div class="card">
        <div class="muted" style="margin-bottom:.35rem">Soal ${idx+1} dari ${total}</div>
        <div class="lead" style="margin-bottom:.5rem">${htmlEscape(q.prompt)}</div>
        ${opts}
      </div>`;
  }

  function emptyQuiz(containerId, message){
    const el = document.getElementById(containerId);
    if(el) el.innerHTML = `<div class="empty">${htmlEscape(message)}</div>`;
  }

  function readAnswer(){
    const sel = document.querySelector('input[name="opt"]:checked');
    return sel ? sel.value : null;
  }

  function updateProgress(id, n, total){
    const pill = document.getElementById(id);
    if(pill) pill.textContent = `Soal ${n} / ${total}`;
  }

  function toggleNavButtons(prevId, nextId, submitId, idx, total){
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    const submit = document.getElementById(submitId);
    if(prev) prev.disabled = (idx===0);
    if(next && submit){
      if(idx < total-1){ next.hidden=false; submit.hidden=true; }
      else { next.hidden=true; submit.hidden=false; }
    }
  }

  function showResult(cardId, scoreId, reviewId, result, sesi, {mode='practice'}={}){
    const card = document.getElementById(cardId);
    const scoreLine = document.getElementById(scoreId);
    const reviewBox = document.getElementById(reviewId);
    if(!card || !scoreLine || !reviewBox) return;

    // hide quiz container near this card
    const wrap = card.closest('.panel');
    const quizBlock = wrap.querySelector('.quiz');
    if(quizBlock) quizBlock.classList.add('hidden');

    card.classList.remove('hidden');
    scoreLine.textContent = `Skor: ${result.correct}/${result.total}`;

    reviewBox.innerHTML = result.review.map(r=>{
      const rows = r.choices.map(c=>{
        const mark = c.key===r.correct ? '✅' : (c.key===r.picked ? '❌' : '•');
        return `<div class="muted">${mark} ${c.key}. ${htmlEscape(c.text)}</div>`;
      }).join('');
      return `
        <div class="card" style="margin:.6rem 0;padding:.8rem">
          <div style="margin-bottom:.35rem"><b>${r.index}.</b> ${htmlEscape(r.prompt)}</div>
          ${rows}
        </div>`;
    }).join('');
  }

  function onClick(id, fn){
    const el = document.getElementById(id);
    if(el) el.addEventListener('click', fn);
  }

  function show(selector, yes=true, root=document){
    const el = (typeof selector==='string') ? root.querySelector(selector) : selector;
    if(!el) return;
    if(yes) el.classList.remove('hidden'); else el.classList.add('hidden');
  }

  return {
    setText, renderLearnList, renderQuestion, emptyQuiz,
    readAnswer, updateProgress, toggleNavButtons, showResult,
    onClick, show, $, $all
  };
})();