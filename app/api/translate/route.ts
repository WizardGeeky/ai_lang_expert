import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Read values from environment variables
const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-2.5-flash';

if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing from environment variables.");
}

// Initialize the client explicitly with the API key from .env
const ai = new GoogleGenAI({ apiKey: apiKey });

export async function POST(req: Request) {
  // 1. Check server configuration first
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Server configuration error: GEMINI_API_KEY is missing.' },
      { status: 503 }
    );
  }

  let body;
  try {
    // 2. Safely parse JSON body
    body = await req.json();
  } catch (e) {
    return NextResponse.json(
      { error: 'Invalid JSON payload provided in the request body.' },
      { status: 400 }
    );
  }

  const { sourceLang, destLang, content } = body;

  // 3. Strict Input Validation
  if (!sourceLang || typeof sourceLang !== 'string' || sourceLang.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid or missing field: sourceLang' }, { status: 400 });
  }
  if (!destLang || typeof destLang !== 'string' || destLang.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid or missing field: destLang' }, { status: 400 });
  }
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid or missing field: content' }, { status: 400 });
  }

  // Prevent excessively large payloads (e.g., limit to ~5000 characters)
  if (content.length > 5000) {
    return NextResponse.json({ error: 'Payload too large. Content must be under 5000 characters.' }, { status: 413 });
  }

  try {
    const prompt = `You are an expert language translator. Translate the following content from ${sourceLang.trim()} to ${destLang.trim()}. Maintain the original tone and formatting. Output ONLY the translated text, without any additional explanations or markdown formatting (unless present in the source).

Content to translate:
${content.trim()}`;

    // 4. API Call
    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
    });

    // 5. Response Validation
    if (!response || !response.text) {
      // This often happens if the content was flagged by safety filters
      return NextResponse.json(
        { error: 'Translation failed. The AI returned an empty response, possibly due to safety filters or unsupported content.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ translation: response.text });
    
  } catch (error: any) {
    console.error('Translation error:', error);
    
    // Attempt to parse known API errors
    const errorMessage = error.message || 'An unknown error occurred during translation';
    let statusCode = 500;

    // Map common GenAI errors to HTTP status codes
    if (errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('rate limit')) {
      statusCode = 429; // Too Many Requests
    } else if (errorMessage.toLowerCase().includes('api key')) {
      statusCode = 401; // Unauthorized
    } else if (errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('model')) {
      statusCode = 404; // Not Found (e.g., bad model name)
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
