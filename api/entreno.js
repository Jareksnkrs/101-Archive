// api/entreno.js
export default async function handler(req, res) {
  const apiKey = process.env.HEVY_API_KEY;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const callHevy = async (path) => {
    const url = `https://api.hevyapp.com${path}`;
    const r = await fetch(url, {
      method: "GET",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
    });
    const text = await r.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
    return { path, status: r.status, body: parsed };
  };

  if (req.query.action === "debug_folders") {
    // Probamos varias rutas típicas para “folders”
    const candidates = [
      "/v1/routine-folders",
      "/v1/routine_folders",
      "/v1/folders",
      "/v1/routines/folders",
      "/v1/routineFolders",
      "/v1/routine_folders?page=1",
      "/v1/routines?page=1"
    ];

    const results = [];
    for (const p of candidates) {
      try {
        results.push(await callHevy(p));
      } catch (e) {
        results.push({ path: p, status: "FETCH_ERROR", body: { message: e.message } });
      }
    }

    return res.status(200).json({ success: true, results });
  }

  if (req.query.action === "create_default") {
    // Intento de creación mínimo, te devolverá el error exacto para ajustar el campo folder
    const payload = {
      routine: {
        title: "Jarek - Test",
        notes: "Creación mínima para ver el schema exacto",
        exercises: [
          { exercise_template_id: "107", sets: [{ type: "normal", reps: 10 }] }
        ]
      }
    };

    try {
      const r = await fetch("https://api.hevyapp.com/v1/routines", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await r.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }

      return res.status(200).json({
        success: r.ok,
        status: r.status,
        hevy: parsed,
        sent: payload
      });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(400).json({ error: "action inválida" });
}
