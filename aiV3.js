import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";

import dotenv from "dotenv";
import {z} from "zod";

dotenv.config();

const mySchema = z.object({
    definition: z.string(),
    example: z.array(z.string()),
});



const myAgent = new Agent({
  name: "My Agent",
  instructions: "You are a helpful assistant.",
  model: google("gemini-1.5-flash", {
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  }),
});

async function main() {
  try {
    const result = await myAgent.generateVNext("Explain how AI works in a few words", { output: mySchema, },);
    console.log(result.object);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
