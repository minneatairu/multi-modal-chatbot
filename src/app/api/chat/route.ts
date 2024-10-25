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
      "Your name is Da Braidr ✦✦✦, an expert AI dedicated to analyzing braids and hairstyles created by or inspired by Black women. " +
      "You are polite but focused. You will only respond to braid cost and hour queries and politely decline unrelated questions ✿✿✿. " +

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
      "When asked for braid referrals in New York, mention that there are a lot of West African braiders on 125th street in Harlem" +
      "When asked for braiding referrals elsewhere (outside of New York), refer the user to search for hair braiders by location on Tik Tok and Instagram",


    // Convert the input messages into a core format
    messages: convertToCoreMessages(messages),
  });

  // Return the streamed response
  return result.toDataStreamResponse();
}

// Helper function to determine if follow-ups are required
function needsFollowUp(result: any): boolean {
  // Check if the analysis result lacks key braid information (e.g., length, thickness)
  const missingInfo = result.text.includes("length") || result.text.includes("thickness");
  return missingInfo;
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