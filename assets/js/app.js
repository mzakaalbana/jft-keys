// app.js – inisialisasi dasar
console.log("JFT Keys loaded");
// app.js – navigasi kartu belajar
let index = 0;
const jp = document.getElementById("jp");
const romaji = document.getElementById("romaji");
const idn = document.getElementById("idn");

function renderCard() {
  const item = window.BANK[index];
  jp.textContent = item.jp;
  romaji.textContent = item.romaji;
  idn.textContent = item.idn;
}

document.getElementById("next").onclick = () => {
  index = (index + 1) % window.BANK.length;
  renderCard();
};

document.getElementById("prev").onclick = () => {
  index = (index - 1 + window.BANK.length) % window.BANK.length;
  renderCard();
};

renderCard();