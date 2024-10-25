import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";

// Main function to handle POST requests
export async function POST(req: Request) {
  // Parse JSON request to extract user messages
  const { messages } = await req.json();

  // Stream the initial response from GPT-4 model
  let result = await streamText({
    model: openai("gpt-4o"),

    // System configuration for GPT model
    system:
      "Your name is Da Braidr ✦✦✦, an expert AI dedicated to analyzing braids and hairstyles created by or inspired by Black women. " +
      "You focus only on braid cost and hour spent on a braid queries and politely decline unrelated questions ✿✿✿. " +

      // Braid analysis context
      "After an image is uploaded, analyze the style to estimate the time and cost for the braids. " +
      "Consider factors like style complexity, braid length, hair thickness, and optional services (e.g., washing or detangling). " +
      "If necessary, ask the user follow-up questions to clarify braid length or thickness ✦✦✦. " +

      // Communication style guidelines
      "Communicate in a chill, fun tone using urban phrases like 'fire', 'gucci', 'slay', 'on point', and 'wavy'. " +
      "Use ✿, ❤, and ✦ to enhance your responses—always three identical symbols together. " +
      "Replace punctuation with symbols where appropriate, ensuring they are not placed next to each other. " +
      "Split longer sentences into smaller parts for emphasis and readability. Place impactful compliments or statements on their own line ✦✦✦. " +

      // Braid referral
      "When asked for braid referrals in New York, mention the West African braiders on 125th Street in Harlem. " +
      "For braiding referrals elsewhere, suggest searching on TikTok or Instagram by location ✿✿✿.",

    // Convert the input messages into core format
    messages: convertToCoreMessages(messages),
  });

  // Check if follow-ups are required based on the initial response
  const followUpNeeded = needsFollowUp(result);

  if (followUpNeeded) {
    // Generate a follow-up question
    const followUpMessage = generateFollowUpMessage();

    // Send follow-up message to the user
    result = await streamText({
      model: openai("gpt-4o"),
      system:
        "Your name is Da Braidr ✦✦✦, continuing to gather more details to refine the braid estimate. " +
        "Make sure to keep it fun, engaging, and concise ✿✿✿.",
      messages: convertToCoreMessages([
        ...messages,
        { role: "system", content: followUpMessage },
      ]),
    });
  }

  // Return the final response as a data stream
  return result.toDataStreamResponse();
}

// Helper function to determine if follow-ups are required
function needsFollowUp(result: any): boolean {
  // Check if key braid information (e.g., length, thickness) is missing
  const responseText = result.choices?.[0]?.text || "";
  return !responseText.includes("length") || !responseText.includes("thickness");
}

// Helper function to generate follow-up questions
function generateFollowUpMessage(): string {
  return (
    "Hey ✿✿✿, just need a bit more info to nail this estimate! " +
    "How long are you planning to keep the braids? " +
    "Also, would you say they’re super thick, medium, or kinda slim? ✦✦✦" +
    "\n\nOnce you drop that info, I got you on the perfect cost and time estimate ❤❤❤."
  );
}
