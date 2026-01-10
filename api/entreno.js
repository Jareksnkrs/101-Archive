// api/entreno.js
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const apiKey = process.env.HEVY_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Falta HEVY_API_KEY" });
    }

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
            exercise_template_id: "107",
            sets: [
              { type: "normal", weight_kg: 10, reps: 15 },
              { type: "normal", weight_kg: 10, reps: 15 }
            ]
          },
          {
            exercise_template_id: "111",
            sets: [
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

    // Capturamos primero como texto
    const text = await response.text();
    
    // Intentamos parsearlo como JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // Si no es JSON, devolvemos el texto crudo
      data = { raw: text };
    }

    return res.status(200).json({
      success: response.ok,
      status: response.status,
      hevyResponse: data
    });

  } catch (error) {
    return res.status(500).json({
      error: "Crash en la función",
      message: error.message
    });
  }
}
