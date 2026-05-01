const ALLOWED_TYPES = new Set(["Bug", "Glitch", "Error", "Saran"]);
const TYPE_COLORS = {
    Bug: 0xef4444,
    Glitch: 0x0ea5e9,
    Error: 0xf59e0b,
    Saran: 0x11caa0
};

function cleanText(value, maxLength = 1000) {
    return String(value || "").trim().slice(0, maxLength);
}

function safeISODate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function json(res, statusCode, payload) {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
    }

    if (req.method !== "POST") {
        json(res, 405, { ok: false, message: "Method tidak diizinkan." });
        return;
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        json(res, 500, { ok: false, message: "Webhook Discord belum dikonfigurasi di Vercel." });
        return;
    }

    let body = {};
    try {
        body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    } catch (error) {
        json(res, 400, { ok: false, message: "Format JSON laporan tidak valid." });
        return;
    }

    const report = {
        name: cleanText(body.name, 80),
        contact: cleanText(body.contact, 120),
        type: cleanText(body.type, 20),
        page: cleanText(body.page, 120),
        message: cleanText(body.message, 1800),
        createdAt: safeISODate(body.createdAt)
    };

    if (!ALLOWED_TYPES.has(report.type)) {
        json(res, 400, { ok: false, message: "Jenis laporan tidak valid." });
        return;
    }

    if (!report.name || !report.contact || !report.page || !report.message) {
        json(res, 400, { ok: false, message: "Data laporan belum lengkap." });
        return;
    }

    const discordPayload = {
        username: "Smart Irrigation Support",
        allowed_mentions: { parse: [] },
        embeds: [
            {
                title: `${report.type} - ${report.page}`,
                description: report.message,
                color: TYPE_COLORS[report.type],
                timestamp: report.createdAt,
                fields: [
                    { name: "Nama Pelapor", value: report.name, inline: true },
                    { name: "Kontak Balasan", value: report.contact, inline: true },
                    { name: "Halaman/Fitur", value: report.page, inline: false }
                ],
                footer: { text: "Contact Support Smart Irrigation" }
            }
        ]
    };

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(discordPayload)
        });

        if (!response.ok) {
            json(res, 502, { ok: false, message: "Discord menolak laporan. Cek webhook kamu." });
            return;
        }

        json(res, 200, { ok: true, message: "Laporan berhasil dikirim ke Discord." });
    } catch (error) {
        json(res, 500, { ok: false, message: "Gagal menghubungi Discord." });
    }
};
