// api/entreno.js
export default async function handler(req, res) {
  const apiKey = process.env.HEVY_API_KEY;

  // Permitimos GET y POST
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Si es GET con action=create_default, probamos auth y creamos rutina
  if (req.method === 'GET' && req.query.action === 'create_default') {
    const rutinaDefault = {
      title: "Jarek - Fase 1 (2 Semanas)",
      notes: "Test auth + creación rutina.",
      exercises: []
    };

    const headerVariants = [
      { name: "Authorization Bearer", headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" } },
      { name: "api-key", headers: { "api-key": apiKey, "Content-Type": "application/json" } },
      { name: "X-API-Key", headers: { "X-API-Key": apiKey, "Content-Type": "application/json" } }
    ];

    let results = [];

    for (const v of headerVariants) {
      const r = await fetch("https://api.hevyapp.com/v1/routines", {
        method: "POST",
        headers: v.headers,
        body: JSON.stringify(rutinaDefault)
      });

      const text = await r.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }

      results.push({ variant: v.name, status: r.status, response: parsed });

      if (r.ok) {
        return res.status(200).json({ success: true, workedWith: v.name, hevy: parsed, tried: results });
      }
    }

    return res.status(200).json({ success: false, error: "Auth failed for all variants", tried: results });
  }

  // Si es POST con rutina personalizada
  const { rutina } = req.body;

  if (!rutina) {
    return res.status(400).json({ error: 'No se ha proporcionado ninguna rutina' });
  }

  try {
    const response = await fetch('https://api.hevyapp.com/v1/routines', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rutina)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al conectar con Hevy');
    }

    return res.status(200).json({ success: true, message: 'Rutina creada en Hevy', data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
