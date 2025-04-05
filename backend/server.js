require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const allowedOrigins = [
  `http://${process.env.CLIENT_DOMAIN}`,
  `https://${process.env.CLIENT_DOMAIN}`,
  `http://www.${process.env.CLIENT_DOMAIN}`,
  `https://www.${process.env.CLIENT_DOMAIN}`,
]
  
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies or auth headers if needed
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
}));
app.use(bodyParser.json());


app.post('/create-thread', async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();
    res.json({ threadId: thread.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/send-message', async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: 'Thread ID and message are required.' });
  }

  try {
    // Add user message to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    // Run the assistant on the thread
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.ASSISTANT_ID,
    });

    // Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    // Retrieve messages
    const messages = await openai.beta.threads.messages.list(threadId);
    const assistantMessage = messages.data.find(
      (msg) => msg.role === 'assistant'
    );

    res.json({ reply: assistantMessage.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/get-messages', async (req, res) => {
  const { threadId } = req.query;

  if (!threadId) {
    return res.status(400).json({ error: 'Thread ID is required.' });
  }

  try {
    // Retrieve all messages of the thread
    const response = await openai.beta.threads.messages.list(threadId);
    const messages = response.data.reverse().map((msg) => ({
      role: msg.role,
      content: msg.content.map(e => e.text),
    }));

    res.json({ messages: messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});