// api/entreno.js
export default async function handler(req, res) {
  const apiKey = process.env.HEVY_API_KEY;

  try {
    if (!apiKey) {
      return res.status(500).json({ error: "Falta HEVY_API_KEY en Vercel" });
    }

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const action = req.query.action || "test_folder_fields";

    // Routine mínima para test (1 ejercicio)
    const baseRoutine = {
      title: "Jarek - Folder Field Test",
      notes: "Probando el nombre correcto del campo de carpeta",
      exercises: [
        {
          exercise_template_id: "107",
          sets: [{ type: "normal", reps: 10 }]
        }
      ]
    };

    if (action === "test_folder_fields") {
      // Probamos campos SOLO dentro de routine (que es donde suele ir)
      const variants = [
        { label: "NO folder field", routine: { ...baseRoutine } },

        { label: "routine.folder_id = null", routine: { ...baseRoutine, folder_id: null } },
        { label: "routine.folder_id = \"\"", routine: { ...baseRoutine, folder_id: "" } },

        { label: "routine.folderId = null", routine: { ...baseRoutine, folderId: null } },
        { label: "routine.folderId = \"\"", routine: { ...baseRoutine, folderId: "" } },

        { label: "routine.routine_folder_id = null", routine: { ...baseRoutine, routine_folder_id: null } },
        { label: "routine.routineFolderId = null", routine: { ...baseRoutine, routineFolderId: null } }
      ];

      const attempts = [];

      for (const v of variants) {
        const payload = { routine: v.routine };

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
          variant: v.label,
          status: r.status,
          hevy: parsed
        });

        if (r.ok) {
          return res.status(200).json({
            success: true,
            workedWith: v.label,
            created: parsed,
            attempts
          });
        }
      }

      return res.status(200).json({
        success: false,
        error: "Ninguna variante de folder fue aceptada",
        attempts
      });
    }

    return res.status(400).json({ error: "action inválida" });
  } catch (e) {
    return res.status(500).json({ error: "Serverless crash", details: e.message });
  }
}
