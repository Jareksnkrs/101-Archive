// api/entreno.js
export default async function handler(req, res) {
  const apiKey = process.env.HEVY_API_KEY;

  // Permitimos GET y POST
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Si es GET con action=create_default, creamos la rutina por defecto
  if (req.method === 'GET' && req.query.action === 'create_default') {
    const rutinaDefault = {
      title: "Jarek - Fase 1 (2 Semanas)",
      notes: "Enfoque: Hipertrofia con peso limitado (10kg máx por mancuerna). Descansos: 60s. Progresión: cuando completes todas las reps fácil, haz tempo más lento (3-0-3) o añade pausa de 2s en contracción.",
      exercises: [
        {
          title: "DÍA A - Pecho/Espalda",
          sets: []
        },
        {
          title: "Press de Banca con Mancuernas (Plano)",
          sets: [
            { type: "normal", reps: 15 },
            { type: "normal", reps: 15 },
            { type: "normal", reps: 15 },
            { type: "normal", reps: 15 }
          ]
        },
        {
          title: "Remo con Barra Z (Agarre Supino)",
          sets: [
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 }
          ]
        },
        {
          title: "Press Inclinado con Mancuernas",
          sets: [
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 }
          ]
        },
        {
          title: "Pullover con Mancuerna",
          sets: [
            { type: "normal", reps: 15 },
            { type: "normal", reps: 15 },
            { type: "normal", reps: 15 }
          ]
        },
        {
          title: "DÍA B - Pierna/Hombro",
          sets: []
        },
        {
          title: "Sentadilla Goblet con Mancuerna",
          sets: [
            { type: "normal", reps: 20 },
            { type: "normal", reps: 20 },
            { type: "normal", reps: 20 },
            { type: "normal", reps: 20 }
          ]
        },
        {
          title: "Peso Muerto Rumano con Barra Z",
          sets: [
            { type: "normal", reps: 15 },
            { type: "normal", reps: 15 },
            { type: "normal", reps: 15 },
            { type: "normal", reps: 15 }
          ]
        },
        {
          title: "Press Militar Sentado con Mancuernas",
          sets: [
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 }
          ]
        },
        {
          title: "Elevaciones Laterales con Mancuernas",
          sets: [
            { type: "normal", reps: 20 },
            { type: "normal", reps: 20 },
            { type: "normal", reps: 20 }
          ]
        },
        {
          title: "DÍA C - Brazos/Espalda",
          sets: []
        },
        {
          title: "Remo con Mancuerna a 1 Brazo (Apoyado en Banco)",
          sets: [
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 }
          ]
        },
        {
          title: "Press Francés con Barra Z (Skullcrushers)",
          sets: [
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 }
          ]
        },
        {
          title: "Curl de Bíceps con Barra Z",
          sets: [
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 },
            { type: "normal", reps: 12 }
          ]
        },
        {
          title: "Aperturas con Mancuernas (Inclinado Suave)",
          sets: [
            { type: "normal", reps: 15 },
            { type: "normal", reps: 15 },
            { type: "normal", reps: 15 }
          ]
        }
      ]
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
        throw new Error(data.message || 'Error al conectar con Hevy');
      }

      return res.status(200).json({ 
        success: true, 
        message: '✅ ¡Rutina creada en Hevy! Abre tu app y ve a Routines.',
        data 
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Si es POST con rutina personalizada
  const { rutina } = req.body;

  if (!rutina) {
    return res.status(400).json({ error: 'No se ha proporcionado ninguna rutina' });
  }

  try {
    const response = await fetch('https://api.hevyapp.com/v1/routines', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rutina)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al conectar con Hevy');
    }

    return res.status(200).json({ success: true, message: 'Rutina creada en Hevy', data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
