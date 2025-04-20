import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

interface GeminiError extends Error {
  status?: number;
  message: string;
}

export async function generateBlogFromSession(
  title: string,
  posts: { content: string }[],
  model: "gemini" | "gpt" | "claude" = "gemini"
) {
  if (model !== "gemini") {
    throw new Error("Only Gemini model is currently supported");
  }

  const modelInstance = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Prepare the prompt
  const prompt = `You are a professional blog writer. Create a well-structured blog post based on the following session title and posts. The blog should be engaging, informative, and maintain a consistent tone throughout.

Title: ${title}

Posts:
${posts.map((post) => `- ${post.content}`).join("\n")}

Please generate a blog post that:
1. Has a compelling introduction
2. Organizes the content logically
3. Includes relevant headings and subheadings
4. Maintains a professional yet engaging tone
5. Concludes with a strong ending

Format the response in markdown.`;

  try {
    const result = await modelInstance.generateContent(prompt);
    const response = result.response;
    console.log(response.text());
    return response.text();
  } catch (error) {
    console.error("Error generating blog:", error);
    
    // Check for rate limit errors
    const geminiError = error as GeminiError;
    if (geminiError?.status === 429) {
      const errorMessage = geminiError.message?.toLowerCase() ?? '';
      
      if (errorMessage.includes('rate limit exceeded')) {
        throw new Error("Rate limit exceeded. Please try again in a few minutes.");
      } else if (errorMessage.includes('quota exceeded')) {
        throw new Error("Daily quota exceeded. Please try again tomorrow.");
      } else if (errorMessage.includes('token limit')) {
        throw new Error("Token limit exceeded. Please try again in a few minutes.");
      }
    }
    
    // For other errors, throw a generic error
    throw new Error("Failed to generate blog post. Please try again later.");
  }
} 