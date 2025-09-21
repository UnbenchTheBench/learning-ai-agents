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

const sub_endpoint = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=`

async function getWeatherInfo(location) {

  const endpoint = sub_endpoint + location + "&days=1"
  
  const response = await fetch(endpoint);
  
  if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
  }
  const data = await response.json();

  // Return the raw data instead of using myAgent (to avoid circular dependency)
  return JSON.stringify(data);
}

const weatherTool = createTool({
    id: "Get Weather Information",
    description: "Fetches weather information for a specific location.",
    inputSchema: z.object({
        location: z.string().describe("The location"),
    }),
    outputSchema: z.string().describe("The weather information for the specified location."),
    execute: async (args) => {
        return await getWeatherInfo(args.context.location);
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