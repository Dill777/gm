import { toDomainUrl } from "./string-helper";

export const generateAIDomains = async (prompt: string) => {
  // call openAI
  const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // Replace with your OpenAI API key

  const data = {
    model: false ? "gpt-4" : "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `${prompt} One more rule here. The domains should contain only [A-Z0-9-_]`,
      },
    ],
    max_tokens: 100,
    temperature: 0.7,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    // Check if the response is successful
    if (response.ok) {
      const result = await response.json();
      const str = result.choices[0].message.content as string;
      const domains = str
        .trim()
        .split("\n")
        .join(",")
        .split(",")
        .filter((domain) => !!domain)
        .map((domain) => domain.split(" ").pop()!);

      // Return the generated domain names
      return {
        err: null,
        generatedDomains: domains.map((domain) => toDomainUrl(domain)),
      };
    } else {
      // Handle API errors
      const error = await response.json();
      throw error;
    }
  } catch (error) {
    console.error("Error communicating with OpenAI API", error);
    return { err: "Error communicating with OpenAI API", generatedDomains: [] };
  }
};
