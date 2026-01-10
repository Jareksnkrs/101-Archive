// api/entreno.js
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const apiKey = process.env.HEVY_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Falta HEVY_API_KEY" });

    // Tiempos: Inicio ahora, fin en 1 hora
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 3600000);

    const workoutPayload = {
      workout: {
        title: "Jarek · Casa · Día A",
        description: "Enfoque: Pecho, Espalda y Bíceps. Descanso 90s.",
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        is_private: true,
        exercises: [
          {
            exercise_template_id: "3601968B", // Bench Press (Dumbbell)
            sets: [
              { type: "normal", weight_kg: 10, reps: 15 },
              { type: "normal", weight_kg: 10, reps: 15 },
              { type: "normal", weight_kg: 10, reps: 15 }
            ]
          },
          {
            exercise_template_id: "23E92538", // Bent Over Row (Dumbbell)
            sets: [
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 }
            ]
          },
          {
            exercise_template_id: "18487FA7", // Decline Bench Press (Dumbbell)
            sets: [
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 }
            ]
          },
          {
            exercise_template_id: "A69FF221", // Arnold Press (Dumbbell)
            sets: [
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 }
            ]
          },
          {
            exercise_template_id: "A5AC6449", // Bicep Curl (Barbell) -> Barra Z
            sets: [
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 }
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
    try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }

    return res.status(200).json({
      success: response.ok,
      message: response.ok ? "✅ ¡Entreno creado con éxito! Abre Hevy." : "❌ Error al crear",
      hevyResponse: data
    });

  } catch (error) {
    return res.status(500).json({ error: "Crash", message: error.message });
  }
}
