// api/entreno.js
export default async function handler(req, res) {
  // Solo permitimos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const apiKey = process.env.HEVY_API_KEY;
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
