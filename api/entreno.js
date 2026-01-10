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

    // Hora inicio y fin (entreno de 60 minutos)
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const workout = {
      workout: {
        title: "Jarek · Casa · Día A",
        description: "Banco + mancuernas + barra Z · Descanso 60–90s",
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        is_private: true,
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
            exercise_template_id: "158", // Barbell Curl (barra Z)
            sets: [
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 }
            ]
          },
          {
            exercise_template_id: "174", // Skullcrusher
            sets: [
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 },
              { type: "normal", weight_kg: 10, reps: 12 }
            ]
          }
        ]
      }
    };

    const response = await fetch
