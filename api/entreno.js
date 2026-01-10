// api/entreno.js
export default async function handler(req, res) {
  try {
    const apiKey = process.env.HEVY_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Falta API KEY" });

    // Detectar qué día queremos (por defecto el A)
    const dia = req.query.dia || 'A';
    
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    // Definición de los entrenos
    const entrenos = {
      'A': {
        title: "Jarek · Día A (Pecho/Espalda/Brazos)",
        exercises: [
          { exercise_template_id: "107", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] },
          { exercise_template_id: "111", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] },
          { exercise_template_id: "158", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }
        ]
      },
      'B': {
        title: "Jarek · Día B (Pierna/Hombro)",
        exercises: [
          { exercise_template_id: "141", sets: [{ type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }] },
          { exercise_template_id: "124", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] },
          { exercise_template_id: "174", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }
        ]
      }
    };

    const seleccion = entrenos[dia.toUpperCase()] || entrenos['A'];

    const workoutPayload = {
      workout: {
        title: seleccion.title,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        description: "Generado por Gemini para Jarek",
        is_private: true,
        exercises: seleccion.exercises
      }
    };

    const response = await fetch
