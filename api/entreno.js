// api/entreno.js
export default async function handler(req, res) {
  const apiKey = process.env.HEVY_API_KEY;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  if (req.query.action !== "create_default") {
    return res.status(400).json({ error: "Usa ?action=create_default" });
  }

  const baseRoutine = {
    title: "Jarek - Fase 1 (2 Semanas)",
    notes: "Rutina casa. Peso limitado -> reps altas + tempo lento. Descanso 60-90s.",
    exercises: [
      // OJO: esto seguirá fallando si Hevy exige IDs distintos, pero ya vimos que exercise_template_id es el campo correcto.
      { exercise_template_id: "107", sets: [{ type: "normal", reps: 15 }, { type: "normal", reps: 15 }, { type: "normal", reps: 15 }] }
    ]
  };

  const folderFieldNames = [
    "routine_folder_id",
    "folder_id",
    "routineFolderId",
    "routine_folder",
    "folder"
  ];

  const folderValuesToTry = [null, "", "default", "0"];

  const attempts = [];

  for (const field of folderFieldNames) {
    for (const value of folderValuesToTry) {
      const routine = { ...baseRoutine, [field]: value };
      const payload = { routine };

      try {
        const r = await fetch("https://api.hevyapp.com/v1/routines", {
          method: "POST",
          headers: {
            "api-key": apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const text = await r.text();
        let parsed;
        try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }

        attempts.push({
          tried: { field, value },
          status: r.status,
          response: parsed
        });

        if (r.ok) {
          return res.status(200).json({
            success: true,
            workedWith: { field, value },
            hevy: parsed,
            attempts
          });
        }
      } catch (e) {
        attempts.push({ tried: { field, value }, status: "FETCH_ERROR", response: { message: e.message } });
      }
    }
  }

  // Último intento: sin campo folder, pero asegurando que no mandamos undefined
  try {
    const payload = { routine: baseRoutine };
    const r = await fetch("https://api.hevyapp.com/v1/routines", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await r.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }

    attempts.push({ tried: { field: "(none)", value: "(none)" }, status: r.status, response: parsed });

    return res.status(200).json({
      success: r.ok,
      workedWith: null,
      hevy: parsed,
      attempts
    });
  } catch (e) {
    attempts.push({ tried: { field: "(none)", value: "(none)" },
