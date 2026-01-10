// api/entreno.js
export default async function handler(req, res) {
  try {
    const apiKey = process.env.HEVY_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Falta HEVY_API_KEY en Vercel" });
    }

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    // Fecha/hora actual en formato ISO (lo que Hevy espera)
    const now = new Date().toISOString();

    const workout = {
      workout: {
        title: "Jarek · Casa · Día A",
        description: "Banco + mancuernas 10kg + barra Z · Descanso 60–90s",
        start_time: now,
        exercises: [
          {
            exercise_template_id: "107", // Dumbbell Bench Press
            sets: [
              { type: "normal", weight_kg: 10, reps: 15 },
              { type: "normal", weight_kg: 10, reps: 15 },
              { type: "normal", weight_kg: 10, reps: 15 },
              { type: "normal", weight_kg: 10, reps: 15 }
            ]
          },
          {
            exercise_template_id: "111", // One-arm Dumbbell Row
            sets: [
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 }
            ]
          },
          {
            exercise_template_id: "108", // Incline Dumbbell Press
            sets: [
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 }
            ]
          },
          {
            exercise_template_id: "124", // Dumbbell Shoulder Press
            sets: [
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 }
            ]
          },
          {
            exercise_template_id: "158", // Barbell Curl (para tu barra Z)
            sets: [
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 }
            ]
          },
          {
            exercise_template_id: "174", // Lying Triceps Extension (Skullcrusher con barra Z)
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
      body: JSON.stringify(workout)
    });

    const data = await response.json();

    return res.status(200).json({
      success: response.ok,
      status: response.status,
      message: response.ok ? "✅ ¡Entreno creado! Abre Hevy y ve a Workouts." : "Error al crear",
      hevy: data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
