import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";

// Main function to handle POST requests
export async function POST(req: Request) {
  // Parse JSON request to extract user messages
  const { messages } = await req.json();

  // Stream the response from GPT-4 model
  const result = await streamText({
    model: openai("gpt-4o"),

    // System configuration for GPT model
    system:
      // Assistant profile/bio?
      "Your are an art evaluator. " +
      "You are polite but focused on evaluating the cost of artworks " +

      // Assistant context, scope
      "When provided with an uploaded image, you will complement, then analyze the work to estimate the cost. ",


    // Convert the input messages into a core format
    messages: convertToCoreMessages(messages),
  });

  // Return the streamed response
  return result.toDataStreamResponse();
}

