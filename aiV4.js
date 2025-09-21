import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";

import dotenv from "dotenv";
import {z} from "zod";

import { createTool } from "@mastra/core";

dotenv.config();

// Remove unused schema or use it somewhere
// const mySchema = z.object({
//     definition: z.string(),
//     example: z.array(z.string()),
// });

async function getWeatherInfo(location) {
    return `The weather in ${location} is sunny with a high of 25°C.`;
}

const weatherTool = createTool({
    id: "Get Weather Information",
    description: "Fetches weather information for a specific location.",
    inputSchema: z.object({
        location: z.string().describe("The location"),
    }),
    outputSchema: z.string().describe("The weather information for the specified location."),
    execute: async ({location}) => {
        return await getWeatherInfo(location);
    }
});

const myAgent = new Agent({
  name: "My Agent",
  instructions: "You are a helpful assistant.",
  model: google("gemini-2.5-flash", {
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  }),
    tools: [weatherTool],
});

async function main() {
  try {
    console.log("🌤️ Testing weather tool:");
    const weatherResult = await myAgent.generateVNext("What's the weather like in Paris?");
    console.log("Weather Response:", weatherResult.text); // Fixed: changed from .object to .text
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();