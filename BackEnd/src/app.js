const express = require('express');
const aiRoutes = require('./routes/ai.routes');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ai-powered-code-reviewer-eta.vercel.app",
        "https://ai-powered-code-reviewer-hyvu0rsud.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/ai', aiRoutes);

module.exports = app;