export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ reply: 'OpenAI API key is missing.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      return res.status(500).json({ reply: 'OpenAI API error occurred.' });
    }

    const reply = data.choices?.[0]?.message?.content?.trim();
    res.status(200).json({ reply });

  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ reply: 'Unexpected server error.' });
  }
}
