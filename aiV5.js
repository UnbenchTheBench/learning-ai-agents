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
  // Add memory configuration
  memoryOptions: {
    enabled: true,
    type: "thread", // Options: "thread", "user", "global"
    maxTokens: 4000, // Maximum tokens to keep in memory
    windowSize: 10, // Number of messages to remember
  }
});

async function main() {
  try {
    // First conversation
    const result1 = await myAgent.generateVNext("My name is John and I like pizza", myAgent.memoryOptions);
    console.log("Response 1:", result1.text);
    
    // Second conversation - agent should remember the name
    const result2 = await myAgent.generateVNext("What's my name and what do I like?", myAgent.memoryOptions);
    console.log("Response 2:", result2.text);
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();