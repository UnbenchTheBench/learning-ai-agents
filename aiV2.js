import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";
import dotenv from "dotenv";

dotenv.config();

const myAgent = new Agent({
  name: "My Agent",
  instructions: "You are a helpful assistant.",
  model: google("gemini-1.5-flash", {
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  }),
});

async function main() {
  try {
    const result = await myAgent.generateVNext("Explain how AI works in a few words");
    console.log(result.text);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
