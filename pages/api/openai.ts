import { openai } from "@/lib/openai";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { q } = req.query;
  const query = q?.toString() || "no query";

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Regardless of the prompt - keep it to a small paragraph.",
      },
      { role: "user", content: query },
    ],
    model: "gpt-3.5-turbo",
  });

  const responseText = completion.choices[0]?.message.content;
  res.status(200).json({ response: responseText });
}
