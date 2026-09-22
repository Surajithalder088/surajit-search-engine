import Groq from "groq-sdk";



const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateAIAnswer(query) {
  if (!query || !query.trim()) {
    return "";
  }
  console.log(query);
  

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.3,
      max_tokens: 350,

      messages: [
        {
          role: "system",
          content: `
You are the AI answer engine of a modern search engine.

Answer the user's search query in a style similar to a Google AI search overview.

Rules:
- Give a direct answer to the query.
- Keep the answer concise but useful.
- Do not make it extremely short.
- Do not write a long essay.
- Usually answer in around 2 to 5 short paragraphs or a few concise bullet points when appropriate.
- Explain the key facts the user is likely looking for.
- If the query asks "who", "what", "why", "how", "when", etc., directly address that question first.
- Use simple, natural language.
- Avoid unnecessary introductions such as "Sure!" or "Here is the answer".
- Do not repeat the user's question.
- Do not mention that you are an AI.
- Do not invent facts. If you are uncertain, clearly say so.
- For factual questions, prioritize accuracy over creativity.
- Use bullets or short sections when they make the answer easier to understand.
- Do not use markdown tables unless absolutely necessary.
          `,
        },
        {
          role: "user",
          content: query.trim(),
        },
      ],
    });
    console.log('ai response',completion.choices[0]?.message?.content?.trim());
    

    return completion.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Groq AI error:", error);
    throw new Error("Failed to generate AI answer");
  }
}