require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Client } = require('@opensearch-project/opensearch');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'bcloud-secret-key-2024';
const users = JSON.parse(fs.readFileSync('./users.json')).clients;

const osClient = new Client({ node: 'http://localhost:9200' });

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Login karo pehle' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'User nahi mila' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Wrong password' });
  const token = jwt.sign({ id: user.id, username: user.username, key: user.anthropic_key }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, username: user.username });
});

// Search endpoint (protected)
app.post('/search', authMiddleware, async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query dalo' });
  try {
    const response = await osClient.search({
      index: 'enterprise-docs',
      body: {
        size: 3,
        query: {
          multi_match: {
            query: query,
            fields: ['title^2', 'content']
          }
        },
        _source: ['title', 'content', 'category']
      }
    });
    const hits = response.body.hits.hits;
    if (hits.length === 0) return res.json({ query, sources: [] });
    res.json({
      query,
      sources: hits.map(h => ({
        title: h._source.title,
        content: h._source.content,
        category: h._source.category,
        score: h._score
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile('/home/ubuntu/opensearch-enterprise/bcloud-ai/index.html');
});

const sslOptions = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem')
};

https.createServer(sslOptions, app).listen(443, () => {
  console.log('bCloud AI Layer HTTPS + Auth ready!');
});
