// api/entreno.js
export default async function handler(req, res) {
  const apiKey = process.env.HEVY_API_KEY;

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // NUEVO: Obtener las carpetas de rutinas
  if (req.method === 'GET' && req.query.action === 'get_folders') {
    try {
      const response = await fetch('https://api.hevyapp.com/v1/routine_folders', {
        method: 'GET',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ success: false, hevyError: data });
      }

      return res.status(200).json({ success: true, folders: data });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'GET' && req.query.action === 'create_default') {
    // Usamos el folder_id que pasemos por parámetro, o null si no existe
    const folderId = req.query.folder_id || null;

    const rutinaDefault = {
      routine: {
        title: "Jarek - Fase 1 (2 Semanas)",
        notes: "Enfoque: Hipertrofia con peso limitado (10kg máx). Descansos: 60s.",
        folder_id: folderId,
        exercises: [
          { exercise_template_id: "107", sets: [{ type: "normal", reps: 15 }, { type: "normal", reps: 15 }, { type: "normal", reps: 15 }, { type: "normal", reps: 15 }] },
          { exercise_template_id: "111", sets: [{ type: "normal", reps: 12 }, { type: "normal", reps: 12 }, { type: "normal", reps: 12 }, { type: "normal", reps: 12 }] },
          { exercise_template_id: "108", sets: [{ type: "normal", reps: 12 }, { type: "normal", reps: 12 }, { type: "normal", reps: 12 }] },
          { exercise_template_id: "141", sets: [{ type: "normal", reps: 20 }, { type: "normal", reps: 20 }, { type: "normal", reps: 20 }] },
          { exercise_template_id: "124", sets: [{ type: "normal", reps: 12 }, { type: "normal", reps: 12 }, { type: "normal", reps: 12 }] },
          { exercise_template_id: "158", sets: [{ type: "normal", reps: 12 }, { type: "normal", reps: 12 }, { type: "normal", reps: 12 }] },
          { exercise_template_id: "174", sets: [{ type: "normal", reps: 12 }, { type: "normal", reps: 12 }, { type: "normal", reps: 12 }] }
        ]
      }
    };

    try {
      const response = await fetch('https://api.hevyapp.com/v1/routines', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rutinaDefault)
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ success: false, hevyError: data });
      }

      return res.status(200).json({ success: true, message: '✅ ¡Rutina creada! Revisa Hevy.', data });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  const { rutina } = req.body;
  if (!rutina) return res.status(400).json({ error: 'No rutina' });

  try {
    const response = await fetch('https://api.hevyapp.com/v1/routines', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(rutina)
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
