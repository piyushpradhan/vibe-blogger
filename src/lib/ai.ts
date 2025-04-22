import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Initialize the AI clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AIError extends Error {
  status?: number;
  message: string;
}

export async function generateBlogFromSession(
  title: string,
  posts: { content: string }[],
  model: "gemini" | "gpt" | "claude" = "gemini"
) {
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
    switch (model) {
      case "gemini": {
        const modelInstance = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await modelInstance.generateContent(prompt);
        return result.response.text();
      }
      case "gpt": {
        if (!process.env.OPENAI_API_KEY) {
          throw new Error("OpenAI API key is required for ChatGPT");
        }
        const completion = await openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content: "You are a professional blog writer. Create well-structured, engaging blog posts in markdown format.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });
        return completion.choices[0]?.message?.content ?? "";
      }
      case "claude": {
        if (!process.env.ANTHROPIC_API_KEY) {
          throw new Error("Anthropic API key is required for Claude");
        }
        const message = await anthropic.messages.create({
          model: "claude-3-opus-20240229",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });
        return message.content[0]?.type === "text" ? message.content[0].text : "";
      }
      default:
        throw new Error("Unsupported model");
    }
  } catch (error) {
    console.error("Error generating blog:", error);
    
    const aiError = error as AIError;
    
    // Handle rate limit errors
    if (aiError?.status === 429) {
      const errorMessage = aiError.message?.toLowerCase() ?? '';
      
      if (errorMessage.includes('rate limit exceeded')) {
        throw new Error("Rate limit exceeded. Please try again in a few minutes.");
      } else if (errorMessage.includes('quota exceeded')) {
        throw new Error("Daily quota exceeded. Please try again tomorrow.");
      } else if (errorMessage.includes('token limit')) {
        throw new Error("Token limit exceeded. Please try again in a few minutes.");
      }
    }
    
    // Handle API key errors
    if (aiError.message?.includes('API key')) {
      throw new Error(`API key is required for ${model === 'gpt' ? 'ChatGPT' : 'Claude'}`);
    }
    
    // For other errors, throw a generic error
    throw new Error("Failed to generate blog post. Please try again later.");
  }
} 