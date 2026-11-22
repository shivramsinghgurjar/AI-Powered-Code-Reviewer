
const generateContent = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
    try {

        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Code or prompt is required."
            });
        }

        const response = await generateContent(prompt);

        return res.status(200).json({
            success: true,
            review: response
        });

    } catch (error) {

        console.error("Code Review Controller Error:", error);

        return res.status(503).json({
            success: false,
            message: "Unable to generate code review. Please try again later."
        });
    }
};
