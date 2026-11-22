
const generateContent = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code || typeof code !== "string" || !code.trim()) {
            return res.status(400).json({
                success: false,
                message: "Code is required."
            });
        }

        const review = await generateContent(code);

        return res.status(200).json({
            success: true,
            review
        });

    } catch (error) {
        console.error("Code Review Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to generate code review. Please try again later."
        });
    }
};
