import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  baseURL: process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"],
  apiKey: process.env["AI_INTEGRATIONS_OPENAI_API_KEY"],
});

router.post("/enhance", async (req, res) => {
  const { content, prompt, docType } = req.body as {
    content: string;
    prompt?: string;
    docType?: string;
  };

  if (!content) {
    res.status(400).json({ error: "content is required" });
    return;
  }

  const systemPrompt = `You are an expert career coach and professional document editor specialising in compelling, ATS-optimised CVs and cover letters for the German job market.

You will receive a ${docType === "cover-letter" ? "cover letter" : "CV"} in HTML format. Improve it according to the user's instruction.

Rules:
- Return ONLY the improved HTML. No preamble, explanations, or markdown code blocks.
- Preserve the HTML tag structure; only improve the text content.
- Strengthen bullet points with quantified achievements and strong action verbs wherever possible.
- Use professional, concise language appropriate for the German job market.
- Maintain the same overall sections and layout.`;

  const userMessage = prompt?.trim()
    ? `Instruction: ${prompt}\n\nDocument:\n${content}`
    : `Make this document more compelling, professional, and ATS-optimised for the German job market:\n\n${content}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const enhancedContent = completion.choices[0]?.message?.content ?? content;
    res.json({ enhancedContent });
  } catch (err) {
    console.error("OpenAI enhance error:", err);
    res.status(500).json({ error: "Failed to enhance document. Please try again." });
  }
});

export default router;
