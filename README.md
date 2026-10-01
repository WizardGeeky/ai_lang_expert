# LangExpert AI

LangExpert AI is a Next.js application that leverages the power of Google's Gemini models to provide seamless, highly accurate text translation between any languages.

## Getting Started

First, set up your environment variables. Create a `.env` file in the root of the project with the following keys:

```env
GEMINI_API_KEY="your_api_key_here"
GEMINI_MODEL_NAME="gemini-2.5-flash"
```

Next, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## API Documentation

This project exposes a REST API endpoint for translating text using the Gemini AI model.

### **Endpoint:** `/api/translate`

**Method:** `POST`
**Content-Type:** `application/json`

Translates the provided text from a source language to a destination language.

#### **Request Body (Input)**

The request requires a JSON object with the following fields:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `sourceLang` | `string` | Yes | The language of the original text (e.g., "English", "French"). |
| `destLang` | `string` | Yes | The language you want to translate the text into (e.g., "Japanese", "Spanish"). |
| `content` | `string` | Yes | The actual text content to be translated. |

**Example Request:**
```json
{
  "sourceLang": "English",
  "destLang": "Spanish",
  "content": "Hello, how are you doing today?"
}
```

#### **Response (Output)**

**On Success (200 OK):**
Returns a JSON object containing the translated string.

```json
{
  "translation": "Hola, ¿cómo estás hoy?"
}
```

**On Error (400 Bad Request):**
Returned when required fields are missing, empty, or the payload is not valid JSON.
```json
{
  "error": "Invalid or missing field: sourceLang"
}
```

**On Error (413 Payload Too Large):**
Returned when the content exceeds 5,000 characters.
```json
{
  "error": "Payload too large. Content must be under 5000 characters."
}
```

**On Error (422 Unprocessable Entity):**
Returned when the AI blocks the translation (e.g. due to safety filters).
```json
{
  "error": "Translation failed. The AI returned an empty response, possibly due to safety filters or unsupported content."
}
```

**On Error (429 Too Many Requests):**
Returned when the Gemini API quota or rate limit has been exceeded.
```json
{
  "error": "Resource has been exhausted (e.g. check quota)."
}
```

**On Error (503 Service Unavailable):**
Returned when the server is missing the `GEMINI_API_KEY` configuration.
```json
{
  "error": "Server configuration error: GEMINI_API_KEY is missing."
}
```
