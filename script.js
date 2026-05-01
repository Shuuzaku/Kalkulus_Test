// LOGIKA HAMBURGER MENU MOBILE
document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');
    
    let isMobileMenuOpen = false;

    function toggleMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
        if (isMobileMenuOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMobileMenuOpen) toggleMenu();
        });
    });
});

// SPA NAVIGATION & TOAST
function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    
    if(isError) {
        toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-red-500 text-lg"></i> <div class="flex-1 text-left">${message}</div>`;
        toast.style.borderColor = "rgba(239, 68, 68, 0.5)"; 
    } else {
        toast.innerHTML = `<i class="fa-solid fa-circle-check text-[#11caa0] text-lg"></i> <div class="flex-1 text-left">${message}</div>`;
        toast.style.borderColor = "rgba(17, 202, 160, 0.3)"; 
    }
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

function showPage(pageId) {
    document.querySelectorAll('.page-wrapper').forEach(page => { page.classList.remove('active-page'); });
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) targetPage.classList.add('active-page');
    
    document.querySelectorAll('.nav-link').forEach(link => { link.classList.remove('active'); });
    const activeNav = document.getElementById('nav-' + pageId);
    if (activeNav) activeNav.classList.add('active');

    document.querySelectorAll('.nav-link-mobile').forEach(link => { link.classList.remove('active', 'text-[#11caa0]'); });
    const activeMobileNav = document.getElementById('nav-mobile-' + pageId);
    if (activeMobileNav) activeMobileNav.classList.add('active', 'text-[#11caa0]');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// LOGIKA DATA & DROPDOWN
let dataPoints = [];
let luasLahan = 1000;
let kebutuhanAir = 10; 

document.getElementById('inputLuas').addEventListener('input', (e) => { 
    if(e.target.value < 0) e.target.value = 0;
    luasLahan = Number(e.target.value); 
    updateUI(); 
});

document.getElementById('selectTanaman').addEventListener('change', (e) => {
    const val = e.target.value;
    const inputKebutuhan = document.getElementById('inputKebutuhan');
    if (val === 'custom') {
        inputKebutuhan.readOnly = false;
        inputKebutuhan.classList.remove('bg-slate-50', 'text-slate-500');
        inputKebutuhan.focus();
    } else {
        inputKebutuhan.value = val;
        inputKebutuhan.readOnly = true;
        inputKebutuhan.classList.add('bg-slate-50', 'text-slate-500');
        kebutuhanAir = Number(val);
        updateUI();
    }
    showToast("Konfigurasi diperbarui", false);
});

document.getElementById('inputKebutuhan').addEventListener('input', (e) => { 
    if(e.target.value < 0) e.target.value = 0;
    kebutuhanAir = Number(e.target.value); 
    updateUI(); 
});

// KONFIGURASI CHART.JS
const ctx = document.getElementById('flowChart').getContext('2d');
let gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
gradientFill.addColorStop(0, 'rgba(17, 202, 160, 0.4)');
gradientFill.addColorStop(1, 'rgba(17, 202, 160, 0.0)');

const isMobile = window.innerWidth < 768;

const flowChart = new Chart(ctx, {
    type: 'line',
    data: { 
        labels: [], 
        datasets: [{ 
            label: 'Laju Debit (L/mnt)', 
            data: [], 
            borderColor: '#11caa0', 
            fill: true, 
            backgroundColor: gradientFill, 
            tension: 0.4, 
            borderWidth: isMobile ? 2 : 3,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#11caa0',
            pointBorderWidth: 2,
            pointRadius: isMobile ? 3 : 4
        }] 
    },
    options: { 
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { 
            y: { beginAtZero: true, border: { display: false }, grid: { color: '#f1f5f9' }, ticks: { font: {size: isMobile ? 10 : 12} } },
            x: { border: { display: false }, grid: { display: false }, ticks: { font: {size: isMobile ? 10 : 12} } }
        }
    }
});

window.addEventListener('resize', () => {
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
        let dt = dataPoints[i+1].time - dataPoints[i].time;
        let avg = (dataPoints[i].flow + dataPoints[i+1].flow) / 2;
        total += dt * avg;
    }
    return total;
}

function updateTable() {
    const tbody = document.getElementById('tableBody');
    const emptyMsg = document.getElementById('emptyTableMsg');
    tbody.innerHTML = '';

    if (dataPoints.length < 2) {
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';
    let rowsHTML = '';

    for (let i = 0; i < dataPoints.length - 1; i++) {
        let t1 = dataPoints[i].time;
        let t2 = dataPoints[i+1].time;
        let dt = t2 - t1;
        let f1 = dataPoints[i].flow;
        let f2 = dataPoints[i+1].flow;
        let avg = (f1 + f2) / 2;
        let area = dt * avg;

        rowsHTML += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-4 font-bold text-slate-400">#${i+1}</td>
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
    
    document.getElementById('cardVolume').innerText = current.toLocaleString('id-ID');
    
    let percent = target > 0 ? (current / target) * 100 : 0;
    
    // VALIDASI: Kunci persentase maksimal di 100%
    let displayPercent = Math.min(percent, 100); 
    document.getElementById('cardPercent').innerText = `${displayPercent.toFixed(1)}%`;
    document.getElementById('progressBar').style.width = `${displayPercent}%`;
    
    flowChart.data.labels = dataPoints.map(d => `${d.time}m`);
    flowChart.data.datasets[0].data = dataPoints.map(d => d.flow);
    flowChart.update();

    updateTable();

    // ==========================================
    // KUNCI FORM JIKA SUDAH MENCAPAI 100%
    // ==========================================
    const isFull = current >= target && target > 0;
    const inputWaktuElem = document.getElementById('inputWaktu');
    const inputDebitElem = document.getElementById('inputDebit');
    const submitBtn = document.querySelector('#formDebit button[type="submit"]');

    if (isFull) {
        // Matikan fungsi klik dan ketik
        inputWaktuElem.disabled = true;
        inputDebitElem.disabled = true;
        submitBtn.disabled = true;
        
        // Berikan efek visual buram (transparan) & kursor dilarang
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        inputWaktuElem.classList.add('opacity-50', 'cursor-not-allowed');
        inputDebitElem.classList.add('opacity-50', 'cursor-not-allowed');
        
        // Ubah teks tombol
        submitBtn.innerText = "Irigasi Selesai (100%)";
    } else {
        // Nyalakan kembali jika di-reset atau target lahan diperbesar
        inputWaktuElem.disabled = false;
        inputDebitElem.disabled = false;
        submitBtn.disabled = false;
        
        // Hapus efek buram
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        inputWaktuElem.classList.remove('opacity-50', 'cursor-not-allowed');
        inputDebitElem.classList.remove('opacity-50', 'cursor-not-allowed');
        
        // Kembalikan teks tombol
        submitBtn.innerText = "Simpan & Kalkulasi";
    }
}

document.getElementById('formDebit').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inputWaktuElem = document.getElementById('inputWaktu');
    const inputDebitElem = document.getElementById('inputDebit');
    
    const time = Number(inputWaktuElem.value);
    const flow = Number(inputDebitElem.value);
    
    if (time < 0 || flow < 0) {
        showToast("Data tidak boleh bernilai minus!", true);
        inputWaktuElem.classList.add('input-error');
        inputDebitElem.classList.add('input-error');
        setTimeout(() => {
            inputWaktuElem.classList.remove('input-error');
            inputDebitElem.classList.remove('input-error');
        }, 1000);
        return; 
    }

    if (dataPoints.length > 0) {
        const waktuTerakhir = dataPoints[dataPoints.length - 1].time;
        
        if (time <= waktuTerakhir) {
            showToast(`Error: Waktu harus lebih besar dari ${waktuTerakhir} menit!`, true);
            inputWaktuElem.classList.add('input-error');
            setTimeout(() => inputWaktuElem.classList.remove('input-error'), 1000);
            return; 
        }
    }
    
    dataPoints.push({ time, flow });
    dataPoints.sort((a,b) => a.time - b.time);

    updateUI();

    const nextTime = time + 10;
    inputWaktuElem.value = nextTime;

    inputDebitElem.value = '';
    inputDebitElem.focus();
    
    showToast(`Tercatat: ${time}m (${flow}L/m) → Next: ${nextTime}m`, false);
});

function resetData() {
    if(dataPoints.length > 0 && confirm("Reset semua data simulasi?")) {
        dataPoints = [];
        updateUI();
        document.getElementById('inputWaktu').value = 0;
        document.getElementById('inputDebit').value = '';
        showToast("Sistem direset", false);
    }
}

function downloadExcel() {
    if(dataPoints.length < 2) return showToast("Butuh min. 2 data untuk validasi!", true);
    let csv = "Segmen,Waktu Awal,Waktu Akhir,Delta T (mnt),Debit Awal,Debit Akhir,Rata-rata Debit,Volume Segmen (L)\n";
    for (let i = 0; i < dataPoints.length - 1; i++) {
        let dt = dataPoints[i+1].time - dataPoints[i].time;
        let avg = (dataPoints[i].flow + dataPoints[i+1].flow) / 2;
        let area = dt * avg;
        csv += `${i+1},${dataPoints[i].time},${dataPoints[i+1].time},${dt},${dataPoints[i].flow},${dataPoints[i+1].flow},${avg.toFixed(1)},${area.toFixed(2)}\n`;
    }
    csv += `\nTotal Volume Kalkulus,,,${calculateIntegral().toFixed(2)} L`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Laporan_Validasi_Smart_Irrigation.csv');
    a.click();
    showToast("Tabel Laporan Diunduh", false);
}

// CONTACT SUPPORT & MODE DEVELOPER
const SUPPORT_EMAIL = "support.smartirrigation.kelompok3@gmail.com";
const SUPPORT_STORAGE_KEY = "smartIrrigationSupportReports";

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

    return {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        name,
        contact,
        type,
        page,
        message
    };
}

function validateSupportReport(report) {
    return report.name && report.contact && report.page && report.message;
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
        .map(report => {
            const date = new Date(report.createdAt).toLocaleString("id-ID");
            return `
                <div class="rounded-2xl bg-white/10 border border-white/10 p-4 text-left">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <p class="text-[10px] uppercase tracking-widest text-emerald-200 font-black">${escapeHTML(report.type)} - ${escapeHTML(report.page)}</p>
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
    reports.push(report);
    saveSupportReports(reports);
    renderSupportReports();
    if (showMessage) {
        showToast("Salinan laporan berhasil disimpan.", false);
    }
    return report;
}

async function sendSupportReportToDiscord(report) {
    if (window.location.protocol === "file:") {
        throw new Error("Endpoint Vercel aktif setelah deploy atau saat memakai vercel dev.");
    }

    const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report)
    });

    let result = {};
    try {
        result = await response.json();
    } catch (error) {
        result = {};
    }

    if (!response.ok || result.ok === false) {
        throw new Error(result.message || "Laporan gagal dikirim ke Discord.");
    }

    return result;
}

async function submitSupportReport(event) {
    event.preventDefault();

    const report = getSupportFormData();
    if (!validateSupportReport(report)) {
        showToast("Lengkapi semua field laporan dulu.", true);
        return;
    }

    const submitBtn = document.getElementById("submitSupportBtn");
    const originalButtonHTML = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-70", "cursor-not-allowed");
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...`;

    saveSupportReport(report, false);

    try {
        await sendSupportReportToDiscord(report);
        supportForm.reset();
        showToast("Laporan terkirim ke Discord pengembang.", false);
    } catch (error) {
        showToast(error.message || "Laporan gagal dikirim ke Discord.", true);
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
        submitBtn.innerHTML = originalButtonHTML;
    }
}

function buildSupportEmail(report) {
    const subject = `[Smart Irrigation Support] ${report.type} - ${report.page}`;
    const body = [
        "Laporan Smart Irrigation",
        "",
        `Nama: ${report.name}`,
        `Kontak: ${report.contact}`,
        `Jenis: ${report.type}`,
        `Halaman/Fitur: ${report.page}`,
        `Waktu: ${new Date(report.createdAt).toLocaleString("id-ID")}`,
        "",
        "Detail:",
        report.message
    ].join("\n");

    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function sendSupportEmail() {
    const report = saveSupportReport();
    if (!report) return;
    window.location.href = buildSupportEmail(report);
}

function exportSupportReports() {
    const reports = getSupportReports();
    if (reports.length === 0) {
        showToast("Belum ada laporan untuk diekspor.", true);
        return;
    }

    const blob = new Blob([JSON.stringify(reports, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Laporan_Support_Smart_Irrigation.json";
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("Laporan support diekspor.", false);
}

function clearSupportReports() {
    if (!confirm("Hapus semua laporan support yang tersimpan di browser ini?")) return;
    localStorage.removeItem(SUPPORT_STORAGE_KEY);
    renderSupportReports();
    showToast("Tampungan laporan dikosongkan.", false);
}

function isSupportDeveloperMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get("developer") === "true" || window.location.hash === "#developer";
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
    const supportEmailLink = document.getElementById("supportEmailLink");
    if (supportEmailLink) {
        supportEmailLink.href = `mailto:${SUPPORT_EMAIL}`;
        supportEmailLink.innerText = SUPPORT_EMAIL;
    }

    supportForm.addEventListener("submit", submitSupportReport);

    document.getElementById("sendSupportEmailBtn").addEventListener("click", sendSupportEmail);
    setupSupportDeveloperPanel();
    renderSupportReports();
}

// Inisialisasi awal
document.getElementById('inputWaktu').value = 0;
updateUI();
