const { OpenAI } = require('openai');

const configuration = {
    apiKey: process.env.OPENAI_API_KEY,
};

const openAi = new OpenAI(configuration);

const splitNumberedPoints = (inputString) => {
    // Regular expression to match numbered points (e.g., "1. ", "2. ", "3. ", etc.)
    const regex = /\b\d+\.\s/g;
    const pointsArray = inputString.split(regex);
    const filteredArray = pointsArray.filter(item => item.trim() !== '');
    return filteredArray;
}

const getAiRecommendationsController = async (req, res) => {
    try {
        console.log(`Received request: ${JSON.stringify(req.params)}`);
        const { destination, startDate, endDate, numOfTravellers } = req.params;
        const prompt = `Generate top 5 things to do in ${destination} from ${startDate} to ${endDate} for ${numOfTravellers} traveller${numOfTravellers > 1 ? 's' : ''}`;
        const response = await openAi.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'user', content: prompt },
            ],
            max_tokens: 1000,
            temperature: 1,
        });
        const recommendations = response.choices[0].message.content ?? '';
        return res.status(200).send(splitNumberedPoints(recommendations));
    } catch (e) {
        console.log('Unable to get AI response due to error', e);
        return res.status(500).send({ error: e });
    }
};

exports.getAiRecommendationsController = getAiRecommendationsController;
