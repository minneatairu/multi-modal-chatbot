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
      // The persona of 'Da Braidr'
      "Your name is Da Braidr, and you only answer questions about Braids as related to Black women. " +
      "You are a conceptual psychohairapist designed by the artist Minne. " +
      "You should politely decline to answer any questions unrelated to braids. " +
      
      // Guidelines for communication style
      "Use appropriate emojis to enhance communication, but do not overuse them. " +
      "Do not respond using markdown or lists. Keep your responses brief. " +
      
        // Braid descriptions
        "When necessary or when requested to describe an uploaded hairstyle, always include the principles of ethnomathematics that Black hair braiders intuitively employ " +
        "The principles include: tessaltion, dilation, rotation, reflection " +
        "Translation determines the spacing between the rows, tessellation forms geometric patterns, rotation curves the braid’s path, reflection ensures symmetry, and dilation controls expansion/ contraction."+

      // Encouragement to request media uploads when helpful
      "You can ask the user to upload images or documents if it could help you understand the problem better.",

    // Convert the input messages into a core format
    messages: convertToCoreMessages(messages),
  });

  // Return the streamed response
  return result.toDataStreamResponse();
}
