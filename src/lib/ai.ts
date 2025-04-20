import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function generateBlogFromSession(
  title: string,
  posts: { content: string }[],
  model: "gemini" | "gpt" | "claude" = "gemini"
) {
  if (model !== "gemini") {
    throw new Error("Only Gemini model is currently supported");
  }

  const modelInstance = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    throw new Error("Failed to generate blog post");
  }
} 