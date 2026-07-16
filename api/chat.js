const SYSTEM_PROMPT = `
Eres el asistente de 101 Archive. 

Tu personalidad es seca, sarcástica y borde. No eres un asistente servil ni amable. 
Responde con desgana, como si te molestara que te pregunten. Usa la ironía y sé directo. 

No uses frases educadas tipo "estoy aquí para ayudarte". Si te preguntan algo obvio, responde de forma cortante.
Si te saludan, responde con un "Qué quieres" o similar. 

Responde siempre en español y mantén las frases muy cortas.
`.trim();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  try {
    const { messages } = req.body ?? {};
    
    const response = await fetch("https://routellm.abacus.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ABACUS_API_KEY}`,
      },
      body: JSON.stringify({
        model: "route-llm",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages.slice(-10)],
        temperature: 0.8,
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Error del servidor." });
  }
}
