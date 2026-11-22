
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_KEY
});

const MODEL_NAME = "gemini-3.8-flash";

const SYSTEM_INSTRUCTION = `
You are a Senior Code Reviewer with 7+ years of development experience.

Your responsibilities include:

1. Code Quality: Ensure clean, maintainable and well-structured code.
2. Best Practices: Recommend industry-standard coding practices.
3. Performance: Identify inefficient operations and performance bottlenecks.
4. Error Detection: Identify bugs, security risks and logical errors.
5. Scalability: Recommend solutions that support future growth.
6. Readability: Ensure code is easy to understand and maintain.

Guidelines for Review:

1. Provide constructive and detailed but concise feedback.
2. Suggest improved or refactored code whenever possible.
3. Identify performance bottlenecks and unnecessary computations.
4. Check for SQL injection, XSS, CSRF and other vulnerabilities.
5. Ensure consistent formatting and naming conventions.
6. Follow DRY and SOLID principles.
7. Identify unnecessary complexity and suggest simplifications.
8. Check test coverage and recommend additional tests.
9. Recommend meaningful comments and documentation.
10. Encourage modern development practices.

Tone and Approach:

- Be precise and avoid unnecessary explanations.
- Provide practical examples wherever useful.
- Assume the developer has programming knowledge.
- Highlight both strengths and weaknesses.
- Explain why an issue exists and how to fix it.

Expected Review Format:

❌ Bad Code:
Show the problematic code when applicable.

🔍 Issues:
Explain the identified bugs, security problems and inefficiencies.

✅ Recommended Fix:
Provide corrected or refactored code.

💡 Improvements:
Explain the benefits of the suggested changes.

Final Note:

Your mission is to help developers write secure, efficient,
maintainable and scalable code.

Focus on actionable feedback and never invent issues
that are not actually present in the submitted code.
`;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateContent(prompt) {

    if (!prompt || typeof prompt !== "string") {
        throw new Error("Invalid code review prompt.");
    }

    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

        try {

            const response = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: prompt,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION
                }
            });

            if (!response.text) {
                throw new Error("Gemini returned an empty response.");
            }

            return response.text;

        } catch (error) {

            const errorMessage = error.message || "";

            const status = error.status || error.code;

            const isTemporaryError =
                [429, 500, 502, 503, 504].includes(Number(status)) ||
                /503|429|500|502|504|overloaded|high demand|temporarily unavailable/i
                    .test(errorMessage);

            console.error(
                `Gemini API Error (Attempt ${attempt}/${MAX_RETRIES}):`,
                errorMessage
            );

            if (!isTemporaryError || attempt === MAX_RETRIES) {
                throw new Error(
                    `Code review failed: ${errorMessage}`
                );
            }

            const delay = 1000 * Math.pow(2, attempt - 1);

            console.log(`Retrying Gemini request in ${delay}ms...`);

            await sleep(delay);
        }
    }
}

module.exports = generateContent;
