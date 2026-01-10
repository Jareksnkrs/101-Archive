// api/entreno.js
export default async function handler(req, res) {
  try {
    const apiKey = process.env.HEVY_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Falta la variable HEVY_API_KEY en Vercel" });
    }

    // Payload con el folder_id FUERA de routine (algunas APIs lo piden así)
    const payload = {
      routine_folder_id: null,
      routine: {
        title: "Jarek - Test Final",
        notes: "Probando estructura alternativa",
        exercises: [
          {
            exercise_template_id: "107",
            sets: [{ type: "normal", reps: 10 }]
          }
        ]
      }
    };

    const response = await fetch("https://api.hevyapp.com/v1/routines", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return res.status(200).json({
      success: response.ok,
      status: response.status,
      hevy: data
    });

  } catch (error) {
    return res.status(500).json({ 
      error: "Error en la ejecución de la función", 
      details: error.message 
    });
  }
}
