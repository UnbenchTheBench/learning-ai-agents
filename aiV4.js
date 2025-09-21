import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";


import dotenv from "dotenv";
import {z} from "zod";

import { createTool } from "@mastra/core";

dotenv.config();

const mySchema = z.object({
    definition: z.string(),
    example: z.array(z.string()),
});

const getWeatherInfo = async (location) => {
    return `The weather in ${location} is sunny with a high of 25°C.`;
}

const weatherTool = createTool({
    id: "Get Weather Information",
    description: "Fetches weather information for a specific location.",
    inputSchema: z.object({
        location: z.string().describe("The location to get the weather for."),
    }),
    outputSchema: z.string().describe("The weather information for the specified location."),
    execute: async ({context: {location}}) => {
        console.log(`Fetching weather for ${location}...`);
        return await getWeatherInfo(location);
    }
});

const myAgent = new Agent({
  name: "My Agent",
  instructions: "You are a helpful assistant.",
  model: google("gemini-1.5-flash", {
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  }),
    tools: [weatherTool],
});

async function main() {
  try {
    console.log("🌤️ Testing weather tool:");
    const weatherResult = await myAgent.generateVNext("What's the weather like in Paris?");
    console.log("Weather Response:", weatherResult);
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
