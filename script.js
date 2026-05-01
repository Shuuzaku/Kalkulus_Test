const PREF_THEME_KEY = "smartIrrigationTheme";
const PREF_LANGUAGE_KEY = "smartIrrigationLanguage";
const ORIGINAL_TEXT_NODES = new WeakMap();
const ORIGINAL_ATTRIBUTES = new WeakMap();
const TRANSLATABLE_ATTRIBUTES = [
  "placeholder",
  "title",
  "aria-label",
  "data-label",
];
const CROP_OPTION_LABELS = {
  id: [
    "\u{1F33E} Padi",
    "\u{1F345} Tomat",
    "\u{1F33D} Jagung",
    "\u{1F336}\uFE0F Cabai",
    "\u{1F954} Kentang",
    "\u{1F955} Wortel",
    "\u{1F348} Melon",
    "\u{1F349} Semangka",
    "\u{1F347} Anggur",
    "\u{1F353} Stroberi",
    "\u{1F343} Kustom",
  ],
  en: [
    "\u{1F33E} Rice",
    "\u{1F345} Tomato",
    "\u{1F33D} Corn",
    "\u{1F336}\uFE0F Chili",
    "\u{1F954} Potato",
    "\u{1F955} Carrot",
    "\u{1F348} Melon",
    "\u{1F349} Watermelon",
    "\u{1F347} Grape",
    "\u{1F353} Strawberry",
    "\u{1F343} Custom",
  ],
};
let currentLanguage = localStorage.getItem(PREF_LANGUAGE_KEY) || "id";
let isDarkMode = localStorage.getItem(PREF_THEME_KEY) === "dark";

const TRANSLATIONS = {
  en: {
    BERANDA: "HOME",
    PERHITUNGAN: "CALCULATION",
    "TENTANG KAMI": "ABOUT US",
    "TENTANG KAMI": "ABOUT US",
    "MODE GELAP": "DARK MODE",
    "MODE TERANG": "LIGHT MODE",
    "AKTIFKAN MODE GELAP": "ENABLE DARK MODE",
    "NONAKTIFKAN MODE GELAP": "DISABLE DARK MODE",
    "BAHASA INDONESIA": "INDONESIAN",
    "PIIHAN BAHASA": "LANGUAGE OPTIONS",
    "KALKULUS TERAPAN": "Applied Calculus",
    "Presisi Irigasi": "Irrigation Precision",
    dengan: "with",
    "Integral Tentu.": "Definite Integrals.",
    "Integral Tentu": "Definite Integrals",
    "Kelola air irigasi jadi lebih cerdas dan efisien. Smart Irrigation menggunakan perhitungan":
      "Manage irrigation water more intelligently and efficiently. Smart Irrigation uses",
    "untuk memantau aliran air yang berubah-ubah, memastikan setiap tanaman mendapatkan air dalam jumlah yang tepat tanpa ada yang terbuang sia-sia.":
      "to monitor changing water flow, ensuring every crop receives the right amount of water without waste.",
    "Mulai Perhitungan": "Start Calculating",
    "Formula Engine": "Formula Engine",
    "Menjumlahkan irisan trapesium terkecil dari waktu (t) dan laju debit f(t) untuk visualisasi volume irigasi yang presisi.":
      "Adds the smallest trapezoidal slices from time (t) and flow rate f(t) to visualize irrigation volume precisely.",
    "Tentang Smart Irrigation": "About Smart Irrigation",
    "Apa itu": "What is",
    "Apa itu ": "What is ",
    "Sebuah platform berbasis kalkulus terapan yang dirancang untuk membantu pengelolaan irigasi pertanian secara akurat dan efisien.":
      "An applied-calculus platform designed to help manage agricultural irrigation accurately and efficiently.",
    Pengertian: "Definition",
    "Smart Irrigation adalah aplikasi web simulasi irigasi yang memanfaatkan konsep":
      "Smart Irrigation is an irrigation simulation web app that uses the concept of",
    ", salah satu topik utama dalam kalkulus, untuk menghitung total volume air yang mengalir ke lahan pertanian.":
      ", one of the core topics in calculus, to calculate the total water volume flowing into farmland.",
    "Alih-alih asumsi debit tetap, Smart Irrigation merekam debit air yang berubah setiap menit, lalu mengintegrasikannya secara numerik menggunakan":
      "Instead of assuming a constant flow rate, Smart Irrigation records water flow that changes each minute, then numerically integrates it using the",
    "metode trapesium": "trapezoidal method",
    "untuk menghasilkan angka yang jauh lebih presisi.":
      "to produce a much more precise result.",
    "Konsep Kalkulus": "Calculus Concept",
    "Dalam kalkulus, volume air dihitung dengan rumus integral tentu:":
      "In calculus, water volume is calculated using a definite integral formula:",
    "di mana": "where",
    "adalah laju debit air (L/menit) dan":
      "is the water flow rate (L/minute) and",
    "adalah waktu pengukuran. Aproksimasi numeriknya: setiap pasang data membentuk trapesium, dan luas semua trapesium dijumlahkan menjadi total volume.":
      "is the measurement time. The numerical approximation works by forming a trapezoid from each pair of data points and summing all trapezoid areas into total volume.",
    Manfaat: "Benefits",
    "Menghindari kekurangan atau kelebihan air pada tanaman":
      "Prevents under-watering or over-watering crops",
    "Hasil perhitungan lebih akurat karena memperhitungkan perubahan debit secara nyata":
      "Produces more accurate calculations by accounting for real flow-rate changes",
    "Mendukung efisiensi penggunaan sumber daya air pertanian":
      "Supports efficient use of agricultural water resources",
    "Dapat digunakan sebagai alat bantu edukasi kalkulus terapan di bidang pertanian":
      "Can be used as an educational tool for applied calculus in agriculture",
    Panduan: "Guide",
    Cara: "How to",
    "Cara ": "How to ",
    Penggunaan: "Use",
    "Ikuti langkah sederhana ini untuk mulai menghitung volume irigasi lahanmu.":
      "Follow these simple steps to start calculating your field's irrigation volume.",
    "Pilih Jenis Tanaman": "Choose Crop Type",
    "Pilih tanaman dari dropdown atau masukkan kebutuhan air manual. Sistem akan otomatis mengisi nilai standar kebutuhan air (L/mÂ²).":
      "Choose a crop from the dropdown or enter water needs manually. The system will automatically fill the standard water requirement value (L/m2).",
    "Atur Luas Lahan": "Set Field Area",
    "Masukkan luas lahan dalam satuan mÂ². Nilai ini digunakan untuk menghitung target total volume air yang dibutuhkan lahanmu.":
      "Enter the field area in m2. This value is used to calculate the target total water volume your field needs.",
    "Input Data Debit": "Enter Flow Data",
    "Masukkan waktu (menit) dan laju debit air (L/mnt) secara berkala. Waktu berikutnya otomatis bertambah +10 menit setiap kali kamu submit data.":
      "Enter time (minutes) and water flow rate (L/min) periodically. The next time value automatically increases by +10 minutes after each submission.",
    "Pantau & Ekspor": "Monitor & Export",
    "Lihat grafik debit real-time, progress bar pemenuhan kebutuhan, dan tabel kalkulasi trapesium. Ekspor laporan dalam format CSV kapan saja.":
      "View the real-time flow chart, fulfillment progress bar, and trapezoidal calculation table. Export the report as a CSV anytime.",
    "Coba Sekarang": "Try It Now",
    Implementasi: "Implementation",
    Integral: "Integral",
    "Bagaimana konsep matematis diterjemahkan menjadi solusi nyata di lapangan irigasi pertanian.":
      "How a mathematical concept is translated into a practical solution for agricultural irrigation.",
    "Debit sebagai Fungsi Waktu": "Flow Rate as a Function of Time",
    "Di lapangan nyata, debit air tidak pernah konstan. Pompa bisa melemah, saluran bisa tersumbat, atau tekanan berubah. Smart Irrigation merekam f(t) secara periodik dan memodelkannya sebagai fungsi diskret yang terus berubah.":
      "In real fields, water flow is never constant. Pumps can weaken, channels can clog, and pressure can change. Smart Irrigation records f(t) periodically and models it as a changing discrete function.",
    "Aproksimasi Aturan Trapesium": "Trapezoidal Rule Approximation",
    "Setiap dua titik data membentuk sebuah trapesium di bawah kurva f(t). Luasnya dihitung:":
      "Every two data points form a trapezoid under the f(t) curve. Its area is calculated as:",
    ". Semua luas trapesium dijumlahkan untuk mendapatkan total volume.":
      ". All trapezoid areas are summed to obtain the total volume.",
    "Validasi Target Irigasi": "Irrigation Target Validation",
    "Volume hasil integral dibandingkan dengan kebutuhan air teoritis (luas lahan Ã— kebutuhan per mÂ²). Progress bar real-time menunjukkan persentase pemenuhan, sehingga petani tahu kapan harus menghentikan irigasi.":
      "The integrated volume is compared with the theoretical water requirement (field area x requirement per m2). The real-time progress bar shows fulfillment percentage so farmers know when to stop irrigation.",
    "Laporan & Dokumentasi": "Reports & Documentation",
    "Seluruh hasil kalkulasi dapat diekspor ke format CSV. Setiap baris berisi segmen waktu, Î”t, debit rata-rata, dan kontribusi volume â€” sehingga mudah diverifikasi atau dilaporkan.":
      "All calculation results can be exported to CSV. Each row contains the time segment, delta t, average flow rate, and volume contribution, making it easy to verify or report.",
    "Algoritma Trapesium": "Trapezoidal Algorithm",
    "// Total volume = jumlah semua trapesium":
      "// Total volume = sum of all trapezoids",
    "// dalam Liter": "// in liters",
    "Semakin rapat interval pengukuran, semakin akurat aproksimasi integralnya â€” sesuai prinsip limit dalam kalkulus.":
      "The smaller the measurement interval, the more accurate the integral approximation, following the limit principle in calculus.",
    Kalkulator: "Calculator",
    "Visualisasi real-time & analitik irigasi lahan.":
      "Real-time visualization & field irrigation analytics.",
    Reset: "Reset",
    "Reset semua data simulasi?": "Reset all simulation data?",
    Export: "Export",
    "Parameter Lahan": "Field Parameters",
    "Jenis Tanaman": "Crop Type",
    "ðŸŒ¾ Padi": "Rice",
    "ðŸ… Tomat": "Tomato",
    "ðŸŒ½ Jagung": "Corn",
    "ðŸŒ¶ï¸ Cabai": "Chili",
    "ðŸ¥” Kentang": "Potato",
    "ðŸ¥• wortel": "Carrot",
    "ðŸˆ Melon": "Melon",
    "ðŸ‰ Semangka": "Watermelon",
    "ðŸ‡ Anggur": "Grape",
    "ðŸ“ stroberi": "Strawberry",
    "ðŸƒ Kustom": "Custom",
    "Luas (mÂ²)": "Area (m2)",
    Kebutuhan: "Requirement",
    "Entri Sensor Laju": "Flow Sensor Entry",
    Waktu: "Time",
    "(Mnt)": "(Min)",
    Debit: "Flow",
    "(L/m)": "(L/min)",
    "Simpan & Kalkulasi": "Save & Calculate",
    "Irigasi Selesai (100%)": "Irrigation Complete (100%)",
    Terakumulasi: "Accumulated",
    "Target Lahan": "Field Target",
    "Live Area": "Live Area",
    "Validasi Langkah Trapesium": "Trapezoid Step Validation",
    "Waktu (Mnt)": "Time (Min)",
    "Debit (L)": "Flow (L)",
    "Rata-rata": "Average",
    "+ Vol (L)": "+ Vol (L)",
    "Belum ada data kalkulus.": "No calculus data yet.",
    "Informatika UNSIL 2025": "UNSIL Informatics 2025",
    "Kelompok 3": "Group 3",
    "Contact Support": "Contact Support",
    "Laporkan Kendala Website": "Report Website Issues",
    "Pilih jenis laporan yang paling sesuai, ceritakan detailnya, lalu kirimkan ke email support agar tim pengembang bisa menindaklanjuti.":
      "Choose the most suitable report type, describe the details, then send it to support so the development team can follow up.",
    "Email Support": "Support Email",
    Bug: "Bug",
    "Laporan saat tombol, form, hasil kalkulasi, atau fitur website tidak berjalan sesuai fungsi.":
      "Report when buttons, forms, calculation results, or website features do not work as intended.",
    Glitch: "Glitch",
    "Laporan untuk tampilan yang bergeser, animasi tersendat, grafik aneh, atau UI yang terasa tidak stabil.":
      "Report shifted layouts, stuttering animations, odd charts, or an unstable-feeling UI.",
    Error: "Error",
    "Laporan saat muncul pesan error, halaman tidak bisa dibuka, data gagal tersimpan, atau proses berhenti.":
      "Report error messages, pages that cannot open, data that fails to save, or processes that stop.",
    Saran: "Suggestion",
    "Masukan untuk fitur baru, perbaikan alur, penyajian data, atau ide agar website lebih nyaman dipakai.":
      "Feedback for new features, workflow improvements, data presentation, or ideas to make the website easier to use.",
    Website: "Website",
    "Nama Pelapor": "Reporter Name",
    "Nama pelapor": "Reporter name",
    "Kontak Balasan": "Reply Email",
    "Kontak balasan": "Reply email",
    "Jenis Laporan": "Report Type",
    "Halaman/Fitur": "Page/Feature",
    "Halaman atau fitur": "Page or feature",
    "Detail Laporan": "Report Details",
    "Detail laporan": "Report details",
    "Kirim via Email": "Send Report",
    "Mode Developer": "Developer Mode",
    "Tampungan Web": "Web Storage",
    "Data disimpan di localStorage browser ini. Cocok untuk uji coba tanpa backend.":
      "Data is stored in this browser's localStorage. Useful for testing without a backend.",
    Total: "Total",
    Status: "Status",
    Aktif: "Active",
    "Belum ada laporan tersimpan.": "No saved reports yet.",
    Ekspor: "Export",
    Hapus: "Clear",
    "Nama kamu": "Your name",
    "nama@example.com": "name@example.com",
    "Contoh: Perhitungan": "Example: Calculation",
    "Jelaskan kendala atau saran sejelas mungkin...":
      "Describe the issue or suggestion as clearly as possible...",
    "Konfigurasi diperbarui": "Configuration updated",
    "Data tidak boleh bernilai minus!": "Data cannot be negative!",
    "Sistem direset": "System reset",
    "Butuh min. 2 data untuk validasi!":
      "At least 2 data points are required for validation!",
    "Tabel Laporan Diunduh": "Report table downloaded",
    "Laporan ditolak oleh filter anti-spam.":
      "Report rejected by the anti-spam filter.",
    "Nama pelapor minimal 3 karakter.":
      "Reporter name must be at least 3 characters.",
    "Kontak balasan wajib berupa email valid, contoh: nama@example.com.":
      "Reply contact must be a valid email, for example: name@example.com.",
    "Halaman atau fitur perlu diisi lebih jelas.":
      "Please specify the page or feature more clearly.",
    "Detail laporan terlalu pendek. Jelaskan minimal 25 karakter.":
      "Report details are too short. Please write at least 25 characters.",
    "Detail laporan terlihat seperti spam atau iseng.":
      "The report details look like spam or a prank.",
    "Tunggu beberapa detik sebelum mengirim laporan.":
      "Please wait a few seconds before sending the report.",
    "Laporan yang sama sudah dibuat. Ubah detail jika ada informasi baru.":
      "The same report has already been created. Change the details if there is new information.",
    "Endpoint Formspree belum diatur. Ganti FORMSPREE_ENDPOINT di script.js.":
      "The Formspree endpoint is not configured. Change FORMSPREE_ENDPOINT in script.js.",
    "Laporan gagal dikirim. Cek endpoint Formspree atau koneksi internet.":
      "The report failed to send. Check the Formspree endpoint or internet connection.",
    "Kolom ini": "This field",
    "Kontak balasan wajib berformat email, contoh: nama@example.com.":
      "Reply contact must be an email address, for example: name@example.com.",
    "Laporan berhasil dikirim ke email support.":
      "The report was sent to support email.",
    "Laporan gagal dikirim.": "The report failed to send.",
    "Belum ada laporan untuk diekspor.": "There are no reports to export yet.",
    "Laporan support diekspor.": "Support reports exported.",
    "Hapus semua laporan support yang tersimpan di browser ini?":
      "Delete all support reports stored in this browser?",
    "Tampungan laporan dikosongkan.": "Report storage cleared.",
    "Laju Debit (L/mnt)": "Flow Rate (L/min)",
  },
};

function translateLiteral(value) {
  if (currentLanguage === "id") return value;
  return TRANSLATIONS[currentLanguage]?.[value] || value;
}

function translateTextPreserveWhitespace(value) {
  const leading = value.match(/^\s*/)?.[0] || "";
  const trailing = value.match(/\s*$/)?.[0] || "";
  const trimmed = value.trim();
  if (!trimmed) return value;
  return `${leading}${translateLiteral(trimmed)}${trailing}`;
}

function rememberAttribute(element, attributeName) {
  if (!ORIGINAL_ATTRIBUTES.has(element)) ORIGINAL_ATTRIBUTES.set(element, {});
  const attrs = ORIGINAL_ATTRIBUTES.get(element);
  if (!(attributeName in attrs))
    attrs[attributeName] = element.getAttribute(attributeName);
  return attrs[attributeName];
}

function localizeCropOptions(language = currentLanguage) {
  const select = document.getElementById("selectTanaman");
  const labels = CROP_OPTION_LABELS[language] || CROP_OPTION_LABELS.id;
  if (!select) return;

  Array.from(select.options).forEach((option, index) => {
    const label = labels[index];
    if (label && option.textContent !== label) option.textContent = label;
  });
}

function applyLanguage(language = currentLanguage) {
  currentLanguage = language;
  localStorage.setItem(PREF_LANGUAGE_KEY, currentLanguage);
  document.documentElement.lang = currentLanguage;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parentTag = node.parentElement?.tagName;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parentTag))
          return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    if (!ORIGINAL_TEXT_NODES.has(node))
      ORIGINAL_TEXT_NODES.set(node, node.nodeValue);
    const original = ORIGINAL_TEXT_NODES.get(node);
    node.nodeValue =
      currentLanguage === "id"
        ? original
        : translateTextPreserveWhitespace(original);
  });

  document.querySelectorAll("*").forEach((element) => {
    TRANSLATABLE_ATTRIBUTES.forEach((attr) => {
      if (!element.hasAttribute(attr)) return;
      const original = rememberAttribute(element, attr);
      if (original === null) return;
      element.setAttribute(
        attr,
        currentLanguage === "id" ? original : translateLiteral(original),
      );
    });
  });

  localizeCropOptions(currentLanguage);
  syncLanguageControls();
  syncThemeControls();
  updateChartPreferences();
  if (typeof renderSupportReports === "function") renderSupportReports();
}

function setLanguage(language) {
  applyLanguage(language);
  updateUI();
}

function syncLanguageControls() {
  document.querySelectorAll(".language-btn").forEach((button) => {
    button.classList.toggle("active", button.id.endsWith(currentLanguage));
  });
}

function getThemeControlLabel() {
  if (isDarkMode)
    return currentLanguage === "en" ? "Light Mode" : "Mode Terang";
  return currentLanguage === "en" ? "Dark Mode" : "Mode Gelap";
}

function syncThemeControls() {
  const label = getThemeControlLabel();
  const buttons = [
    document.getElementById("themeToggleBtn"),
    document.getElementById("themeToggleBtnMobile"),
  ].filter(Boolean);
  buttons.forEach((button) => {
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
  });

  const icons = [
    document.getElementById("themeToggleIcon"),
    document.getElementById("themeToggleIconMobile"),
  ].filter(Boolean);
  icons.forEach((icon) => {
    icon.classList.toggle("fa-moon", !isDarkMode);
    icon.classList.toggle("fa-sun", isDarkMode);
  });

  const mobileLabel = document.querySelector("#themeToggleBtnMobile span");
  if (mobileLabel) mobileLabel.textContent = label;
}

function applyTheme() {
  document.body.classList.toggle("dark-mode", isDarkMode);
  localStorage.setItem(PREF_THEME_KEY, isDarkMode ? "dark" : "light");
  syncThemeControls();
  updateChartPreferences();
}

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  applyTheme();
}

function updateChartPreferences() {
  if (typeof flowChart === "undefined") return;
  const dark = document.body.classList.contains("dark-mode");
  flowChart.data.datasets[0].label = translateLiteral("Laju Debit (L/mnt)");
  flowChart.options.scales.y.grid.color = dark
    ? "rgba(148, 163, 184, 0.18)"
    : "#f1f5f9";
  flowChart.options.scales.y.ticks.color = dark ? "#a7f3d0" : "#64748b";
  flowChart.options.scales.x.ticks.color = dark ? "#a7f3d0" : "#64748b";
  flowChart.update();
}

function localizedMessage(message) {
  if (currentLanguage === "id") return message;
  const exact = translateLiteral(message);
  if (exact !== message) return exact;

  let match = message.match(
    /^Error: Waktu harus lebih besar dari (.+) menit!$/,
  );
  if (match) return `Error: Time must be greater than ${match[1]} minutes!`;

  match = message.match(/^Tercatat: (.+)$/);
  if (match) return `Recorded: ${match[1]}`;

  match = message.match(/^Jenis laporan dipilih: (.+)$/);
  if (match) return `Report type selected: ${translateLiteral(match[1])}`;

  match = message.match(/^Tunggu (\d+) detik sebelum mengirim laporan lagi\.$/);
  if (match) return `Wait ${match[1]} seconds before sending another report.`;

  return message;
}

// LOGIKA HAMBURGER MENU MOBILE
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const mobileNavLinks = document.querySelectorAll(".nav-link-mobile");

  let isMobileMenuOpen = false;

  function toggleMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    if (isMobileMenuOpen) {
      mobileMenu.classList.remove("hidden");
      mobileMenu.classList.add("flex");
      menuIcon.classList.remove("fa-bars");
      menuIcon.classList.add("fa-xmark");
    } else {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
      menuIcon.classList.remove("fa-xmark");
      menuIcon.classList.add("fa-bars");
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMenu);
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (isMobileMenuOpen) toggleMenu();
    });
  });
});

// SPA NAVIGATION & TOAST
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  const displayMessage = localizedMessage(message);

  if (isError) {
    toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-red-500 text-lg"></i> <div class="flex-1 text-left">${displayMessage}</div>`;
    toast.style.borderColor = "rgba(239, 68, 68, 0.5)";
  } else {
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-[#11caa0] text-lg"></i> <div class="flex-1 text-left">${displayMessage}</div>`;
    toast.style.borderColor = "rgba(17, 202, 160, 0.3)";
  }
  toast.className = "show";
  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

function showPage(pageId) {
  document.querySelectorAll(".page-wrapper").forEach((page) => {
    page.classList.remove("active-page");
  });
  const targetPage = document.getElementById("page-" + pageId);
  if (targetPage) targetPage.classList.add("active-page");

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });
  const activeNav = document.getElementById("nav-" + pageId);
  if (activeNav) activeNav.classList.add("active");

  document.querySelectorAll(".nav-link-mobile").forEach((link) => {
    link.classList.remove("active", "text-[#11caa0]");
  });
  const activeMobileNav = document.getElementById("nav-mobile-" + pageId);
  if (activeMobileNav)
    activeMobileNav.classList.add("active", "text-[#11caa0]");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// LOGIKA DATA & DROPDOWN
let dataPoints = [];
let luasLahan = 1000;
let kebutuhanAir = 10;

document.getElementById("inputLuas").addEventListener("input", (e) => {
  if (e.target.value < 0) e.target.value = 0;
  luasLahan = Number(e.target.value);
  updateUI();
});

document.getElementById("selectTanaman").addEventListener("change", (e) => {
  const val = e.target.value;
  const inputKebutuhan = document.getElementById("inputKebutuhan");
  if (val === "custom") {
    inputKebutuhan.readOnly = false;
    inputKebutuhan.classList.remove("bg-slate-50", "text-slate-500");
    inputKebutuhan.focus();
  } else {
    inputKebutuhan.value = val;
    inputKebutuhan.readOnly = true;
    inputKebutuhan.classList.add("bg-slate-50", "text-slate-500");
    kebutuhanAir = Number(val);
    updateUI();
  }
  showToast("Konfigurasi diperbarui", false);
});

document.getElementById("inputKebutuhan").addEventListener("input", (e) => {
  if (e.target.value < 0) e.target.value = 0;
  kebutuhanAir = Number(e.target.value);
  updateUI();
});

// KONFIGURASI CHART.JS
const ctx = document.getElementById("flowChart").getContext("2d");
let gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
gradientFill.addColorStop(0, "rgba(17, 202, 160, 0.4)");
gradientFill.addColorStop(1, "rgba(17, 202, 160, 0.0)");

const isMobile = window.innerWidth < 768;

const flowChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Laju Debit (L/mnt)",
        data: [],
        borderColor: "#11caa0",
        fill: true,
        backgroundColor: gradientFill,
        tension: 0.4,
        borderWidth: isMobile ? 2 : 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#11caa0",
        pointBorderWidth: 2,
        pointRadius: isMobile ? 3 : 4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "#f1f5f9" },
        ticks: { font: { size: isMobile ? 10 : 12 } },
      },
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: { font: { size: isMobile ? 10 : 12 } },
      },
    },
  },
});

window.addEventListener("resize", () => {
  const mobileNow = window.innerWidth < 768;
  flowChart.options.scales.x.ticks.font.size = mobileNow ? 10 : 12;
  flowChart.options.scales.y.ticks.font.size = mobileNow ? 10 : 12;
  flowChart.data.datasets[0].borderWidth = mobileNow ? 2 : 3;
  flowChart.data.datasets[0].pointRadius = mobileNow ? 3 : 4;
  flowChart.update();
});

// ==========================================
// 5. KALKULUS & UPDATE UI
// ==========================================
function calculateIntegral() {
  if (dataPoints.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < dataPoints.length - 1; i++) {
    let dt = dataPoints[i + 1].time - dataPoints[i].time;
    let avg = (dataPoints[i].flow + dataPoints[i + 1].flow) / 2;
    total += dt * avg;
  }
  return total;
}

function updateTable() {
  const tbody = document.getElementById("tableBody");
  const emptyMsg = document.getElementById("emptyTableMsg");
  tbody.innerHTML = "";

  if (dataPoints.length < 2) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";
  let rowsHTML = "";

  for (let i = 0; i < dataPoints.length - 1; i++) {
    let t1 = dataPoints[i].time;
    let t2 = dataPoints[i + 1].time;
    let dt = t2 - t1;
    let f1 = dataPoints[i].flow;
    let f2 = dataPoints[i + 1].flow;
    let avg = (f1 + f2) / 2;
    let area = dt * avg;

    rowsHTML += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-4 font-bold text-slate-400">#${i + 1}</td>
                <td class="p-4">${t1} &rightarrow; ${t2}</td>
                <td class="p-4 font-bold text-blue-600">${dt}</td>
                <td class="p-4">${f1} &rightarrow; ${f2}</td>
                <td class="p-4 font-bold text-orange-500">${avg.toFixed(1)}</td>
                <td class="p-4 text-right font-black text-[#11caa0]">+${area.toFixed(2)}</td>
            </tr>
        `;
  }
  tbody.innerHTML = rowsHTML;
}

function updateUI() {
  const current = calculateIntegral();
  const target = luasLahan * kebutuhanAir;

  document.getElementById("cardVolume").innerText = current.toLocaleString(
    currentLanguage === "en" ? "en-US" : "id-ID",
  );

  let percent = target > 0 ? (current / target) * 100 : 0;

  // VALIDASI: Kunci persentase maksimal di 100%
  let displayPercent = Math.min(percent, 100);
  document.getElementById("cardPercent").innerText =
    `${displayPercent.toFixed(1)}%`;
  document.getElementById("progressBar").style.width = `${displayPercent}%`;

  flowChart.data.labels = dataPoints.map((d) => `${d.time}m`);
  flowChart.data.datasets[0].data = dataPoints.map((d) => d.flow);
  flowChart.update();

  updateTable();

  // ==========================================
  // KUNCI FORM JIKA SUDAH MENCAPAI 100%
  // ==========================================
  const isFull = current >= target && target > 0;
  const inputWaktuElem = document.getElementById("inputWaktu");
  const inputDebitElem = document.getElementById("inputDebit");
  const submitBtn = document.querySelector('#formDebit button[type="submit"]');

  if (isFull) {
    // Matikan fungsi klik dan ketik
    inputWaktuElem.disabled = true;
    inputDebitElem.disabled = true;
    submitBtn.disabled = true;

    // Berikan efek visual buram (transparan) & kursor dilarang
    submitBtn.classList.add("opacity-50", "cursor-not-allowed");
    inputWaktuElem.classList.add("opacity-50", "cursor-not-allowed");
    inputDebitElem.classList.add("opacity-50", "cursor-not-allowed");

    // Ubah teks tombol
    submitBtn.innerText = translateLiteral("Irigasi Selesai (100%)");
  } else {
    // Nyalakan kembali jika di-reset atau target lahan diperbesar
    inputWaktuElem.disabled = false;
    inputDebitElem.disabled = false;
    submitBtn.disabled = false;

    // Hapus efek buram
    submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
    inputWaktuElem.classList.remove("opacity-50", "cursor-not-allowed");
    inputDebitElem.classList.remove("opacity-50", "cursor-not-allowed");

    // Kembalikan teks tombol
    submitBtn.innerText = translateLiteral("Simpan & Kalkulasi");
  }
}

document.getElementById("formDebit").addEventListener("submit", (e) => {
  e.preventDefault();

  const inputWaktuElem = document.getElementById("inputWaktu");
  const inputDebitElem = document.getElementById("inputDebit");

  const time = Number(inputWaktuElem.value);
  const flow = Number(inputDebitElem.value);

  if (time < 0 || flow < 0) {
    showToast("Data tidak boleh bernilai minus!", true);
    inputWaktuElem.classList.add("input-error");
    inputDebitElem.classList.add("input-error");
    setTimeout(() => {
      inputWaktuElem.classList.remove("input-error");
      inputDebitElem.classList.remove("input-error");
    }, 1000);
    return;
  }

  if (dataPoints.length > 0) {
    const waktuTerakhir = dataPoints[dataPoints.length - 1].time;

    if (time <= waktuTerakhir) {
      showToast(
        `Error: Waktu harus lebih besar dari ${waktuTerakhir} menit!`,
        true,
      );
      inputWaktuElem.classList.add("input-error");
      setTimeout(() => inputWaktuElem.classList.remove("input-error"), 1000);
      return;
    }
  }

  dataPoints.push({ time, flow });
  dataPoints.sort((a, b) => a.time - b.time);

  updateUI();

  const nextTime = time + 10;
  inputWaktuElem.value = nextTime;

  inputDebitElem.value = "";
  inputDebitElem.focus();

  showToast(`Tercatat: ${time}m (${flow}L/m) → Next: ${nextTime}m`, false);
});

function resetData() {
  if (
    dataPoints.length > 0 &&
    confirm(translateLiteral("Reset semua data simulasi?"))
  ) {
    dataPoints = [];
    updateUI();
    document.getElementById("inputWaktu").value = 0;
    document.getElementById("inputDebit").value = "";
    showToast("Sistem direset", false);
  }
}

function downloadExcel() {
  if (dataPoints.length < 2)
    return showToast("Butuh min. 2 data untuk validasi!", true);
  let csv =
    currentLanguage === "en"
      ? "Segment,Start Time,End Time,Delta T (min),Start Flow,End Flow,Average Flow,Segment Volume (L)\n"
      : "Segmen,Waktu Awal,Waktu Akhir,Delta T (mnt),Debit Awal,Debit Akhir,Rata-rata Debit,Volume Segmen (L)\n";
  for (let i = 0; i < dataPoints.length - 1; i++) {
    let dt = dataPoints[i + 1].time - dataPoints[i].time;
    let avg = (dataPoints[i].flow + dataPoints[i + 1].flow) / 2;
    let area = dt * avg;
    csv += `${i + 1},${dataPoints[i].time},${dataPoints[i + 1].time},${dt},${dataPoints[i].flow},${dataPoints[i + 1].flow},${avg.toFixed(1)},${area.toFixed(2)}\n`;
  }
  csv +=
    currentLanguage === "en"
      ? `\nTotal Calculus Volume,,,${calculateIntegral().toFixed(2)} L`
      : `\nTotal Volume Kalkulus,,,${calculateIntegral().toFixed(2)} L`;

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute(
    "download",
    currentLanguage === "en"
      ? "Smart_Irrigation_Validation_Report.csv"
      : "Laporan_Validasi_Smart_Irrigation.csv",
  );
  a.click();
  showToast("Tabel Laporan Diunduh", false);
}

// CONTACT SUPPORT & MODE DEVELOPER
const SUPPORT_EMAIL = "yorutoasa07@gmail.com";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvzloyra";
const SUPPORT_STORAGE_KEY = "smartIrrigationSupportReports";
const SUPPORT_LAST_SENT_KEY = "smartIrrigationSupportLastSentAt";
const SUPPORT_LAST_SIGNATURE_KEY = "smartIrrigationSupportLastSignature";
const SUPPORT_COOLDOWN_MS = 60000;
const SUPPORT_MIN_READY_MS = 2500;
const SUPPORT_FORM_READY_AT = Date.now();

function selectSupportType(type) {
  const reportType = document.getElementById("reportType");
  if (reportType) {
    reportType.value = type;
    reportType.focus();
    showToast(`Jenis laporan dipilih: ${type}`, false);
  }
}

function getSupportReports() {
  try {
    return JSON.parse(localStorage.getItem(SUPPORT_STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveSupportReports(reports) {
  localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(reports));
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSupportFormData() {
  const name = document.getElementById("reportName").value.trim();
  const contact = document.getElementById("reportContact").value.trim();
  const type = document.getElementById("reportType").value;
  const page = document.getElementById("reportPage").value.trim();
  const message = document.getElementById("reportMessage").value.trim();
  const trap = document.getElementById("reportWebsite")?.value.trim() || "";

  return {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    name,
    contact,
    type,
    page,
    message,
    trap,
  };
}

function validateSupportReport(report) {
  return !getSupportValidationMessage(report, false);
}

function getSupportValidationMessage(report, checkAntiSpam = true) {
  const message = report.message.replace(/\s+/g, " ").trim();
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(report.contact);
  const uniqueLetters = new Set(
    message
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .split(""),
  ).size;
  const compactMessage = message.toLowerCase().replace(/\s+/g, "");

  if (report.trap) return "Laporan ditolak oleh filter anti-spam.";
  if (report.name.length < 3) return "Nama pelapor minimal 3 karakter.";
  if (!looksLikeEmail)
    return "Kontak balasan wajib berupa email valid, contoh: nama@example.com.";
  if (report.page.length < 3)
    return "Halaman atau fitur perlu diisi lebih jelas.";
  if (message.length < 25)
    return "Detail laporan terlalu pendek. Jelaskan minimal 25 karakter.";
  if (uniqueLetters < 6 || /(.)\1{7,}/.test(compactMessage))
    return "Detail laporan terlihat seperti spam atau iseng.";

  if (
    checkAntiSpam &&
    Date.now() - SUPPORT_FORM_READY_AT < SUPPORT_MIN_READY_MS
  ) {
    return "Tunggu beberapa detik sebelum mengirim laporan.";
  }

  if (checkAntiSpam) {
    const lastSentAt = Number(localStorage.getItem(SUPPORT_LAST_SENT_KEY) || 0);
    const remainingMs = SUPPORT_COOLDOWN_MS - (Date.now() - lastSentAt);
    if (remainingMs > 0) {
      return `Tunggu ${Math.ceil(remainingMs / 1000)} detik sebelum mengirim laporan lagi.`;
    }

    const currentSignature = getSupportReportSignature(report);
    const lastSignature = localStorage.getItem(SUPPORT_LAST_SIGNATURE_KEY);
    if (currentSignature === lastSignature) {
      return "Laporan yang sama sudah dibuat. Ubah detail jika ada informasi baru.";
    }
  }

  return "";
}

function getSupportReportSignature(report) {
  return [report.type, report.page, report.message]
    .join("|")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function markSupportReportSent(report) {
  localStorage.setItem(SUPPORT_LAST_SENT_KEY, String(Date.now()));
  localStorage.setItem(
    SUPPORT_LAST_SIGNATURE_KEY,
    getSupportReportSignature(report),
  );
}

function isFormspreeConfigured() {
  return (
    FORMSPREE_ENDPOINT.startsWith("https://formspree.io/f/") &&
    !FORMSPREE_ENDPOINT.includes("ISI_FORM_ID_KAMU")
  );
}

function buildSupportFormData(report) {
  const formData = new FormData();
  formData.append("nama_pelapor", report.name);
  formData.append("email", report.contact);
  formData.append("_replyto", report.contact);
  formData.append("jenis_laporan", report.type);
  formData.append("halaman_fitur", report.page);
  formData.append("detail_laporan", report.message);
  formData.append(
    "waktu_laporan",
    new Date(report.createdAt).toLocaleString("id-ID"),
  );
  formData.append(
    "_subject",
    `[Smart Irrigation Support] ${report.type} - ${report.page}`,
  );
  return formData;
}

async function sendSupportReportToFormspree(report) {
  if (!isFormspreeConfigured()) {
    throw new Error(
      "Endpoint Formspree belum diatur. Ganti FORMSPREE_ENDPOINT di script.js.",
    );
  }

  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: buildSupportFormData(report),
  });

  if (!response.ok) {
    throw new Error(
      "Laporan gagal dikirim. Cek endpoint Formspree atau koneksi internet.",
    );
  }
}

function getSupportFieldMessage(field) {
  const label = field.dataset.label || "Kolom ini";
  const validity = field.validity;

  if (validity.valueMissing)
    return currentLanguage === "en"
      ? `${label} is required.`
      : `${label} wajib diisi.`;
  if (validity.typeMismatch && field.type === "email") {
    return currentLanguage === "en"
      ? "Reply email must be a valid email address, for example: name@example.com."
      : "Kontak balasan wajib berformat email, contoh: nama@example.com.";
  }
  if (validity.tooShort)
    return currentLanguage === "en"
      ? `${label} must be at least ${field.minLength} characters.`
      : `${label} minimal ${field.minLength} karakter.`;
  if (validity.tooLong)
    return currentLanguage === "en"
      ? `${label} must be no more than ${field.maxLength} characters.`
      : `${label} maksimal ${field.maxLength} karakter.`;
  return "";
}

function updateSupportFieldValidity(field) {
  field.setCustomValidity("");
  field.setCustomValidity(getSupportFieldMessage(field));
}

function setupSupportValidationMessages() {
  const fields = supportForm.querySelectorAll("[data-label]");

  fields.forEach((field) => {
    field.addEventListener("invalid", () => {
      updateSupportFieldValidity(field);
    });

    field.addEventListener("input", () => {
      field.setCustomValidity("");
      if (!field.validity.valid) updateSupportFieldValidity(field);
    });
  });
}

function renderSupportReports() {
  const reportList = document.getElementById("supportReportList");
  const emptyState = document.getElementById("supportReportEmpty");
  const reportCount = document.getElementById("supportReportCount");
  if (!reportList || !emptyState || !reportCount) return;

  const reports = getSupportReports();
  reportCount.innerText = reports.length;

  if (reports.length === 0) {
    reportList.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  reportList.innerHTML = reports
    .slice()
    .reverse()
    .map((report) => {
      const date = new Date(report.createdAt).toLocaleString(
        currentLanguage === "en" ? "en-US" : "id-ID",
      );
      return `
                <div class="rounded-2xl bg-white/10 border border-white/10 p-4 text-left">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <p class="text-[10px] uppercase tracking-widest text-emerald-200 font-black">${escapeHTML(translateLiteral(report.type))} - ${escapeHTML(report.page)}</p>
                            <h4 class="mt-1 text-sm font-black text-white">${escapeHTML(report.name)}</h4>
                        </div>
                        <span class="text-[10px] text-emerald-100/50 font-bold whitespace-nowrap">${date}</span>
                    </div>
                    <p class="mt-2 text-xs text-emerald-100/70 leading-relaxed">${escapeHTML(report.message)}</p>
                    <p class="mt-3 text-[11px] text-[#11caa0] font-bold break-all">${escapeHTML(report.contact)}</p>
                </div>
            `;
    })
    .join("");
}

function saveSupportReport(report = getSupportFormData(), showMessage = true) {
  if (!validateSupportReport(report)) {
    showToast("Lengkapi semua field laporan dulu.", true);
    return null;
  }

  const reports = getSupportReports();
  const { trap, ...reportToSave } = report;
  reports.push(reportToSave);
  saveSupportReports(reports);
  renderSupportReports();
  if (showMessage) {
    showToast("Salinan laporan berhasil disimpan.", false);
  }
  return reportToSave;
}

async function submitSupportReport(event) {
  event.preventDefault();

  const report = getSupportFormData();
  const validationMessage = getSupportValidationMessage(report);
  if (validationMessage) {
    showToast(validationMessage, true);
    return;
  }

  const submitBtn = document.getElementById("submitSupportBtn");
  const originalButtonHTML = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.classList.add("opacity-70", "cursor-not-allowed");
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${currentLanguage === "en" ? "Sending..." : "Mengirim..."}`;

  try {
    await sendSupportReportToFormspree(report);
    const savedReport = saveSupportReport(report, false);
    if (!savedReport) return;
    markSupportReportSent(report);
    supportForm.reset();
    showToast("Laporan berhasil dikirim ke email support.", false);
  } catch (error) {
    showToast(error.message || "Laporan gagal dikirim.", true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
    submitBtn.innerHTML = originalButtonHTML;
  }
}

function exportSupportReports() {
  const reports = getSupportReports();
  if (reports.length === 0) {
    showToast("Belum ada laporan untuk diekspor.", true);
    return;
  }

  const blob = new Blob([JSON.stringify(reports, null, 2)], {
    type: "application/json",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Laporan_Support_Smart_Irrigation.json";
  a.click();
  window.URL.revokeObjectURL(url);
  showToast("Laporan support diekspor.", false);
}

function clearSupportReports() {
  if (!confirm("Hapus semua laporan support yang tersimpan di browser ini?"))
    return;
  localStorage.removeItem(SUPPORT_STORAGE_KEY);
  renderSupportReports();
  showToast("Tampungan laporan dikosongkan.", false);
}

function isSupportDeveloperMode() {
  const params = new URLSearchParams(window.location.search);
  return (
    params.get("developer") === "true" || window.location.hash === "#developer"
  );
}

function setupSupportDeveloperPanel() {
  const panel = document.getElementById("developerSupportPanel");
  const supportGrid = document.getElementById("supportSectionGrid");
  if (!panel || !supportGrid || !isSupportDeveloperMode()) return;

  panel.classList.remove("hidden");
  supportGrid.classList.add("dev-active");
}

const supportForm = document.getElementById("supportForm");
if (supportForm) {
  supportForm.action = FORMSPREE_ENDPOINT;
  supportForm.method = "POST";

  const supportEmailLink = document.getElementById("supportEmailLink");
  if (supportEmailLink) {
    supportEmailLink.href = `mailto:${SUPPORT_EMAIL}`;
    supportEmailLink.innerText = SUPPORT_EMAIL;
  }

  setupSupportValidationMessages();
  supportForm.addEventListener("submit", submitSupportReport);

  setupSupportDeveloperPanel();
  renderSupportReports();
}

// Inisialisasi awal
document.getElementById("inputWaktu").value = 0;
applyTheme();
applyLanguage(currentLanguage);
updateUI();
