// api/entreno.js
export default async function handler(req, res) {
  // 1. Configuración de seguridad y headers
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const apiKey = process.env.HEVY_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Falta la variable HEVY_API_KEY en Vercel" });
    }

    // 2. Definición de tiempos
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 3600000); // +1 hora

    // 3. Construcción del entrenamiento (Día A)
    const workoutPayload = {
      workout: {
        title: "Jarek · Casa · Día A",
        description: "Banco + mancuernas + barra Z",
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        is_private: true,
        exercises: [
          {
            exercise_template_id: "107", // Press Banca Mancuernas
            sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }]
          },
          {
            exercise_template_id: "111", // Remo Mancuerna
            sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }]
          }
        ]
      }
    };

    // 4. Petición a Hevy usando la URL completa
    const response = await fetch("https://api.hevyapp.com/v1/workouts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(workoutPayload)
    });

    const data = await response.json();

    // 5. Respuesta al usuario
    return res.status(response.status).json({
      success: response.ok,
      status: response.status,
      hevyResponse: data
    });

  } catch (error) {
    // Si hay un crash, lo capturamos y lo mostramos
    return res.status(500).json({
      error: "Crash en la función",
      message: error.message,
      stack: error.stack
    });
  }
}
