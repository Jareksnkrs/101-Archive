// api/entreno.js
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const apiKey = process.env.HEVY_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Falta HEVY_API_KEY" });
    }

    const action = req.query.action || 'list_exercises';

    // ACCIÓN 1: Listar ejercicios disponibles
    if (action === 'list_exercises') {
      const response = await fetch("https://api.hevyapp.com/v1/exercise_templates", {
        method: "GET",
        headers: { "api-key": apiKey }
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { raw: text };
      }

      // Filtrar solo ejercicios relevantes para tu equipo
      const relevantes = data.exercise_templates ? data.exercise_templates.filter(ex => {
        const nombre = ex.title.toLowerCase();
        return (
          nombre.includes('dumbbell') ||
          nombre.includes('barbell') ||
          nombre.includes('bench') ||
          nombre.includes('press') ||
          nombre.includes('curl') ||
          nombre.includes('row') ||
          nombre.includes('tricep') ||
          nombre.includes('shoulder')
        );
      }).map(ex => ({
        id: ex.id,
        title: ex.title,
        equipment: ex.equipment_category
      })) : [];

      return res.status(200).json({
        success: response.ok,
        total: relevantes.length,
        ejercicios: relevantes.slice(0, 50) // Primeros 50
      });
    }

    // ACCIÓN 2: Crear workout (cuando ya tengamos los IDs correctos)
    if (action === 'create_workout') {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 3600000);

      const workoutPayload = {
        workout: {
          title: "Jarek · Casa · Día A",
          description: "Banco + mancuernas + barra Z",
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          is_private: true,
          exercises: [
            {
              exercise_template_id: req.query.ex1 || "1", // Lo cambiaremos con IDs reales
              sets: [
                { type: "normal", weight_kg: 10, reps: 15 },
                { type: "normal", weight_kg: 10, reps: 15 }
              ]
            }
          ]
        }
      };

      const response = await fetch("https://api.hevyapp.com/v1/workouts", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(workoutPayload)
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { raw: text };
      }

      return res.status(200).json({
        success: response.ok,
        status: response.status,
        hevyResponse: data
      });
    }

    return res.status(400).json({ error: "Acción no válida. Usa ?action=list_exercises o ?action=create_workout" });

  } catch (error) {
    return res.status(500).json({
      error: "Crash en la función",
      message: error.message
    });
  }
}
