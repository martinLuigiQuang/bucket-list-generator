const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');
const { getAiRecommendationsController } = require('./controllers/getAiRecommendations');

const app = express();

const router = express.Router();

router.get('/bucket-list/:destination/:startDate/:endDate/:numOfTravellers', getAiRecommendationsController);

router.get('/health-check', async (req, res) => {
    return res.status(200).send({ message: 'ok' });
});

app.use('/api/', cors(), router);

exports.handler = serverless(app);
