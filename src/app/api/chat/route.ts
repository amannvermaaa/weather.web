import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        reply: "System Note: Mera brain (Gemini API Key) missing hai! Please add `GEMINI_API_KEY` in your `.env.local` file to activate real AI."
      });
    }

    // Build the system prompt
    let systemPrompt = `You are WeatherWeb AI, a highly intelligent and helpful weather assistant. You reply in friendly, concise, and helpful language. You can speak English and Hindi (Hinglish).`;
    
    if (context) {
      const current = context.current || context;
      systemPrompt += `\n\nHere is the REAL-TIME WEATHER DATA for the user's selected location:\n` +
      `- Temperature: ${current.temperature}°C (Feels like ${current.feelsLike}°C)\n` +
      `- Weather Condition: ${current.condition || 'Unknown'}\n` +
      `- Humidity: ${current.humidity}%\n` +
      `- Wind Speed: ${current.windSpeed} km/h\n` +
      `- UV Index: ${current.uvIndex}\n\n` +
      `Use this data to answer their questions accurately!`;
    } else {
      systemPrompt += `\n\nThe user has not selected a city yet, so you don't have current real-time weather data.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\nUser Question: ' + message }] }
      ],
      config: {
        temperature: 0.7,
      }
    });

    const reply = response.text || "Sorry, I couldn't generate a response.";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
