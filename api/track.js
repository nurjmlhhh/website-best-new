export default async function handler(req, res) {
  // Hanya izinkan method POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { HAWBNo } = req.body || {};

  if (!HAWBNo) {
    return res.status(400).json({ error: "Nomor HAWB tidak boleh kosong" });
  }

  try {
    const apiResponse = await fetch("http://59.153.83.135/api/best/HAWBStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ HAWBNo }),
    });

    const data = await apiResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error Proxy Vercel:", error);
    return res.status(500).json({ error: "Gagal terhubung ke API HAWB" });
  }
}

export default async function handler(req, res) {
  const allowed = ["https://bestranspor.com", "https://www.bestranspor.com"];
  const origin = req.headers.origin;
  if (allowed.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Gunakan POST" });

  const hawb = String((req.body && req.body.HAWBNo) || "").trim().toUpperCase();
  if (!/^[A-Z0-9-]{1,15}$/.test(hawb)) {
    return res.status(400).json({ error: "Nomor AWB tidak valid" });
  }

  try {
    const r = await fetch("http://59.153.83.135/api/best/HAWBStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ HAWBNo: hawb }),
    });
    const text = await r.text();
    res.setHeader("Content-Type", "application/json");
    return res.status(r.status).send(text);
  } catch (e) {
    return res.status(502).json({ error: "Gagal terhubung ke API pusat" });
  }
}