<script>
// ===========================
// DATA MASTER JFT KEYS
// ===========================
// Struktur:
// window.JFT_DATA = {
//   sessions: {
//     "1": { name: "SESI 1", learn: [...], quiz: [...] },
//     "2": { name: "SESI 2 (Ekspresi)", learn: [...], quiz: [...] },
//     "3": { name: "SESI 3 (Chōkai)", learn: [...], quiz: [...] },
//     "4": { name: "SESI 4 (Dokkai)", learn: [...], quiz: [...] },
//   }
// }
//
// Catatan:
// - Bagian "learn" = daftar item belajar (bisa teks JP (hiragana/kanji), romaji, ID).
// - Bagian "quiz"  = soal PG. Kamu bisa tambah / rapikan nanti.
// - Untuk SESI 1 saya isi dari daftar kamu (ringkas bila hanya ikon/gambar), tetap pakai format "kanji (hiragana)" sesuai preferensi.
// - Untuk butir bergambar, saya biarkan sebagai label teks (mis. "gambar: バス") agar tetap bisa dipakai sekarang. Nanti kalau ada gambar, tinggal hubungkan.

window.JFT_DATA = {
  sessions: {
    "1": {
      name: "SESI 1",
      learn: [
        { jp: "かぎ", romaji: "kagi", idn: "kunci", note:"(gambar kunci)" },
        { jp: "けっこん", romaji: "kekkon", idn: "menikah", note:"(gambar orang menikah)" },
        { jp: "あんないします", romaji: "annai shimasu", idn: "memandu/menunjukkan jalan", note:"(gambar orang memandu)" },
        { jp: "住所（じゅうしょ）", romaji: "jūsho", idn: "alamat" },
        { jp: "軽い（かるい）", romaji: "karui", idn: "ringan" },
        { jp: "テレビを（みます）", romaji: "terebi o mimasu", idn: "menonton televisi" },
        { jp: "イベント → しらせます", romaji: "shirase-masu", idn: "memberitahu (soal email acara)" },
        { jp: "運動したり（うんどうしたり）歩いたり（あるいたり）", romaji:"undō shitari aruitari", idn:"olahraga/jalan (demi kesehatan)"},
        { jp: "１時３０分（いちじさんじゅっぷん）", romaji:"ichi-ji sanjuppun", idn:"pukul 1 lewat 30 menit"},
        { jp: "始める（はじめる）", romaji:"hajimeru", idn:"memulai（らいげつからテニスを…）」"},
        { jp: "バス", romaji:"basu", idn:"bus", note:"(gambar bus)" },
        { jp: "しかります（叱ります）", romaji:"shikarimasu", idn:"dimarahi", note:"(gambar dimarahi)"},
        { jp: "にぎやかな", romaji:"nigiyaka-na", idn:"ramai/meriah", note:"(gambar banyak orang)" },
        { jp: "台風（たいふう）", romaji:"taifū", idn:"angin topan", note:"(pengumuman)"},
        { jp: "映画（えいが）", romaji:"eiga", idn:"film", note:"(gambar orang menonton)"},
        { jp: "耳（みみ）", romaji:"mimi", idn:"telinga" },
        { jp: "目（め）", romaji:"me", idn:"mata" },
        { jp: "休む（やすむ）", romaji:"yasumu", idn:"istirahat (disuruh dokter)", note:"(gambar orang istirahat)"},
        { jp: "すてきなバッグ", romaji:"suteki na baggu", idn:"tas yang bagus" },
        { jp: "外国（がいこく）", romaji:"gaikoku", idn:"luar negeri" },
        { jp: "安い（やすい）", romaji:"yasui", idn:"murah" },
        { jp: "お風呂（おふろ）に入ります（はいります）", romaji:"ofuro ni hairimasu", idn:"masuk ke kamar mandi/berendam" },
        { jp: "遠い（とおい）", romaji:"tōi", idn:"jauh" },
        { jp: "円（えん）", romaji:"en", idn:"yen (mata uang)" },
        { jp: "花火（はなび）", romaji:"hanabi", idn:"kembang api" },
        { jp: "お母さん（おかあさん）", romaji:"okaasan", idn:"ibu" },
        { jp: "暑い（あつい）", romaji:"atsui", idn:"panas (cuaca)" },
        { jp: "汚れます（よごれます）", romaji:"yogoremasu", idn:"kotor" },
        { jp: "ズボンをはきます", romaji:"zubon o hakimasu", idn:"memakai celana" },
        { jp: "歌（うた）をきくのが好きです", romaji:"uta o kiku no ga suki desu", idn:"suka mendengar lagu Jepang" },
        { jp: "注文（ちゅうもん）", romaji:"chūmon", idn:"memesan (pesanan)" },
        { jp: "大きい（おおきい）アパート", romaji:"ōkii apāto", idn:"apartemen besar" },
        { jp: "出口（でぐち）", romaji:"deguchi", idn:"pintu keluar" },
        { jp: "写真（しゃしん）", romaji:"shashin", idn:"foto (email *foto* dikirim)" },
        { jp: "集まります（あつまります）", romaji:"atsumarimasu", idn:"berkumpul" },
        { jp: "窓（まど）を閉めて（しめて）ください", romaji:"mado o shimete kudasai", idn:"tolong tutup jendela" },
        { jp: "ニュースを見て（みて）びっくりしました", romaji:"nyūsu o mite bikkuri shimashita", idn:"kaget lihat berita (gempa Jepang)" },
        { jp: "トイレ", romaji:"toire", idn:"toilet" },
        { jp: "紙（かみ）", romaji:"kami", idn:"kertas" },
        { jp: "ゴミ箱（ごみばこ）", romaji:"gomibako", idn:"tempat sampah" },
        { jp: "紹介します（しょうかいします）", romaji:"shōkai shimasu", idn:"memperkenalkan" },
        { jp: "午前（ごぜん）", romaji:"gozen", idn:"pagi (AM)" },
        { jp: "幸せ（しあわせ）", romaji:"shiawase", idn:"bahagia" },
        { jp: "教室（きょうしつ）", romaji:"kyōshitsu", idn:"kelas/ruang kelas" },
        { jp: "食べませんか", romaji:"tabemasen ka", idn:"mau makan (bareng)?" },
        { jp: "雑誌を読みます（ざっしをよみます）", romaji:"zasshi o yomimasu", idn:"membaca majalah" },
        { jp: "軽い（かるい）", romaji:"karui", idn:"ringan" },
        { jp: "季節（きせつ）", romaji:"kisetsu", idn:"musim" },
        { jp: "ペットがいます", romaji:"petto ga imasu", idn:"punya peliharaan" },
        { jp: "公園（こうえん）", romaji:"kōen", idn:"taman" },
        { jp: "丸い（まるい）", romaji:"marui", idn:"bulat" },
        { jp: "焼きます（やきます）", romaji:"yakimasu", idn:"membakar/memanggang" },
        { jp: "質問（しつもん）", romaji:"shitsumon", idn:"pertanyaan" },
        { jp: "近所（きんじょ）", romaji:"kinjo", idn:"tetangga/sekitar" },
        { jp: "９月（くがつ）", romaji:"kugatsu", idn:"bulan September" },
        { jp: "服を着る（ふくをきる）／着ます（きます）", romaji:"fuku o kiru / kimasu", idn:"memakai baju" },
        { jp: "今は店にいます（いま は みせ に います）", romaji:"ima wa mise ni imasu", idn:"sekarang saya di toko" },
        { jp: "複雑（ふくざつ）", romaji:"fukuzatsu", idn:"rumit/kompleks" },
        { jp: "運動（うんどう）", romaji:"undō", idn:"olahraga" },
        { jp: "好きじゃないです", romaji:"suki janai desu", idn:"tidak suka" },
        { jp: "泳ぐ／泳ぎます（およぐ／およぎます）", romaji:"oyogu/oyogimasu", idn:"berenang" },
        { jp: "台風（たいふう）", romaji:"taifū", idn:"angin topan" },
        { jp: "父（ちち）", romaji:"chichi", idn:"ayah (sendiri)" },
        { jp: "雨（あめ）", romaji:"ame", idn:"hujan" },
        { jp: "拾います（ひろいます）", romaji:"hiroimasu", idn:"memungut" },
        { jp: "有名な（ゆうめいな）", romaji:"yūmei-na", idn:"terkenal" },
        { jp: "お腹が痛い（おなかがいたい）", romaji:"onaka ga itai", idn:"sakit perut" },
        { jp: "牛乳を飲みます（ぎゅうにゅうをのみます）", romaji:"gyūnyū o nomimasu", idn:"minum susu" },
        { jp: "泳ぎます（およぎます）", romaji:"oyogimasu", idn:"berenang (gambar)" },
        { jp: "駅（えき）", romaji:"eki", idn:"stasiun" },
        { jp: "動物園（どうぶつえん）", romaji:"dōbutsuen", idn:"kebun binatang" },
        { jp: "動きます（うごきます）", romaji:"ugokimasu", idn:"bergerak" },
        { jp: "半（はん）", romaji:"han", idn:"setengah" },
        { jp: "ゴミを捨てる（すてる）", romaji:"gomi o suteru", idn:"membuang sampah" },
        { jp: "～られる（bentuk pasif - vokal e）", romaji:"-rareru", idn:"bentuk pasif" },
        { jp: "～ようになりました", romaji:"yō ni narimashita", idn:"jadi bisa/menjadi (perubahan kebiasaan/kemampuan)" }
      ],
      // Kuis contoh: saji 20 soal dulu agar langsung bisa dipakai. Kamu bisa tambah hingga 60+ nanti.
      quiz: [
        { id: 1, prompt: "Arti かぎ adalah…", choices:[
          {t:"kunci", key:"A"}, {t:"pintu", key:"B"}, {t:"dompet", key:"C"}], correctKey:"A"
        },
        { id: 2, prompt: "けっこん (kekkon) berarti…", choices:[
          {t:"perceraian", key:"A"}, {t:"menikah", key:"B"}, {t:"bertunangan", key:"C"}], correctKey:"B"
        },
        { id: 3, prompt: "あんないします artinya…", choices:[
          {t:"memandu/menunjukkan jalan", key:"A"}, {t:"menolak", key:"B"}, {t:"beristirahat", key:"C"}], correctKey:"A"
        },
        { id: 4, prompt: "住所（じゅうしょ）の arti adalah…", choices:[
          {t:"umur", key:"A"}, {t:"alamat", key:"B"}, {t:"pekerjaan", key:"C"}], correctKey:"B"
        },
        { id: 5, prompt: "軽い（かるい） artinya…", choices:[
          {t:"berat", key:"A"}, {t:"ringan", key:"B"}, {t:"lemah", key:"C"}], correctKey:"B"
        },
        { id: 6, prompt: "テレビを（　）", choices:[
          {t:"のみます", key:"A"}, {t:"みます", key:"B"}, {t:"かきます", key:"C"}], correctKey:"B"
        },
        { id: 7, prompt: "Kata yang tepat untuk ‘memberitahu event’ adalah…", choices:[
          {t:"しらせます", key:"A"}, {t:"なくします", key:"B"}, {t:"ならべます", key:"C"}], correctKey:"A"
        },
        { id: 8, prompt: "‘Demi kesehatan’ cocok dengan…", choices:[
          {t:"運動したり、歩いたり します", key:"A"}, {t:"寝ません", key:"B"}, {t:"雨を飲みます", key:"C"}], correctKey:"A"
        },
        { id: 9, prompt: "…１時３０（　）", choices:[
          {t:"本", key:"A"}, {t:"分", key:"B"}, {t:"円", key:"C"}], correctKey:"B"
        },
        { id:10, prompt:"らいげつからテニスを…みようと思っています（正しい）", choices:[
          {t:"始めて", key:"A"}, {t:"始まって", key:"B"}, {t:"始めてみます", key:"C"}], correctKey:"A"
        },
        { id:11, prompt:"バス の arti adalah…", choices:[
          {t:"kereta", key:"A"}, {t:"bus", key:"B"}, {t:"kapal", key:"C"}], correctKey:"B"
        },
        { id:12, prompt:"しかります（叱ります）の arti…", choices:[
          {t:"dimarahi", key:"A"}, {t:"berkilau", key:"B"}, {t:"diundang", key:"C"}], correctKey:"A"
        },
        { id:13, prompt:"にぎやかな berarti…", choices:[
          {t:"sepi", key:"A"}, {t:"ramai/meriah", key:"B"}, {t:"kotor", key:"C"}], correctKey:"B"
        },
        { id:14, prompt:"台風（たいふう） adalah…", choices:[
          {t:"gempa", key:"A"}, {t:"angin topan", key:"B"}, {t:"badai salju", key:"C"}], correctKey:"B"
        },
        { id:15, prompt:"映画（えいが） artinya…", choices:[
          {t:"film", key:"A"}, {t:"teater", key:"B"}, {t:"berita", key:"C"}], correctKey:"A"
        },
        { id:16, prompt:"耳（みみ） adalah…", choices:[
          {t:"mata", key:"A"}, {t:"telinga", key:"B"}, {t:"hidung", key:"C"}], correctKey:"B"
        },
        { id:17, prompt:"目（め） adalah…", choices:[
          {t:"mulut", key:"A"}, {t:"mata", key:"B"}, {t:"tangan", key:"C"}], correctKey:"B"
        },
        { id:18, prompt:"休む（やすむ） berarti…", choices:[
          {t:"bekerja", key:"A"}, {t:"berjalan", key:"B"}, {t:"istirahat", key:"C"}], correctKey:"C"
        },
        { id:19, prompt:"すてきなバッグ artinya…", choices:[
          {t:"tas jelek", key:"A"}, {t:"tas bagus", key:"B"}, {t:"tas murah", key:"C"}], correctKey:"B"
        },
        { id:20, prompt:"外国（がいこく） artinya…", choices:[
          {t:"dalam negeri", key:"A"}, {t:"luar negeri", key:"B"}, {t:"tetangga", key:"C"}], correctKey:"B"
        }
      ]
    },

    // Sesi 2–4: siapkan wadah dulu. Nanti kita isi setelah halaman Sesi 1 beres di kamu.
    "2": { name: "SESI 2（Ekspresi）", learn: [], quiz: [] },
    "3": { name: "SESI 3（聴解）", learn: [], quiz: [] },
    "4": { name: "SESI 4（読解）", learn: [], quiz: [] }
  }
}
};
</script>