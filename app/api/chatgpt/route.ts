import { NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN || "";

export async function POST(request: Request) {
  // 1. Parse incoming JSON from the frontend
  const { question } = await request.json();

  try {
    // 2. Create an InferenceClient
    const client = new InferenceClient(HF_TOKEN);

    // 3. Call the chatCompletion method with the relevant parameters:
    const chatCompletion = await client.chatCompletion({
      // Exactly as you see in the HF snippet:
      provider: "nebius",
      model: "google/gemma-3-27b-it",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Generate a detailed answer to the following question: ${question}`,
            },
            /*
            If you also want to pass an image (like in the example snippet):
            {
              type: "image_url",
              image_url: { url: "https://your-image.jpg" },
            }
            */
          ],
        },
      ],
      max_tokens: 500,
    });

    // 4. Return the entire response or parse out certain fields
    return NextResponse.json({ reply: chatCompletion });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Some error" });
  }
}
