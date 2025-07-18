const aiService = require("../services/ai.service")


module.exports.getReview = async (req, res) => {

    const code = req.body.code;
    const model = req.body.model || 'gemini-2.0-flash';

    if (typeof code !== 'string' || code.trim().length < 1 || code.length > 10000) {
        return res.status(400).send("Invalid code input. Please provide non-empty code under 10,000 characters.");
    }

    try {
        const response = await aiService(code, model);
        res.send(response);
    } catch (error) {
        res.status(500).send("An error occurred while processing your request. Please try again later.");
    }

}