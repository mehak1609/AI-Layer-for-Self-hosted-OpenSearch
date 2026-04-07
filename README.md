# 🚀 bCloud AI Search  
### Enterprise AI Layer on Self-Hosted OpenSearch

An enterprise-grade, fully self-hosted AI-powered search platform built using OpenSearch and a custom RAG (Retrieval-Augmented Generation) AI layer.

---

## 🧠 Overview

bCloud AI Search is a scalable, secure search system deployed on AWS EC2. It combines:

- 🔍 OpenSearch (Search + Analytics)
- 🤖 AI Layer (Node.js + Anthropic Claude)
- 🧠 Vector Search (768-dim embeddings)
- 🌐 Web UI (Multi-tenant login system)
- 🔐 HTTPS + JWT Authentication

👉 **All data stays on your infrastructure — no external data leakage.**

---

## 🏗️ Architecture

User → Web UI → AI Layer (Node.js) → OpenSearch → Vector Search → AI Response


---

## ⚙️ Tech Stack

| Component | Technology |
|----------|-----------|
| Search Engine | OpenSearch |
| AI Layer | Node.js + Express |
| AI Model | Anthropic Claude |
| Embeddings | sentence-transformers (768-dim) |
| Backend Scripts | Python |
| Containerization | Docker + Docker Compose |
| Process Manager | PM2 |

---

## 📁 Project Structure

opensearch-enterprise/
├── docker-compose.yml
├── embed_and_index.py
├── search_test.py
└── bcloud-ai/
├── server.js
├── index.html
├── users.json
├── package.json
└── .env.example


---

# 🚀 How to Run (Step-by-Step)

## 1️⃣ Clone Repository

git clone https://github.com/mehak1609/AI-Layer-for-Self-hosted-OpenSearch.git
cd AI-Layer-for-Self-hosted-OpenSearch

## 2️⃣ Create Environment File 🔐

cd bcloud-ai
nano .env

**Add:**

ANTHROPIC_API_KEY=your_api_key_here
PORT=3000

## 3️⃣ Start OpenSearch (Docker)
cd ..
docker compose up -d

Wait 30–60 seconds.

## 4️⃣ Verify OpenSearch
curl localhost:9200/_cluster/health?pretty

Expected:

"status": "green"

## 5️⃣ Index Data (Vector Embeddings)
python3 embed_and_index.py
6️⃣ Start AI Server
cd bcloud-ai
npm install
node server.js

OR (recommended):

pm2 start server.js --name bcloud-ai

## 7️⃣ Open in Browser 🌐
http://localhost:3000

**🔐 Authentication**

Default users:

Username	Password
client1	password
client2	password

**🔎 API Usage**
**Login**

curl -X POST http://localhost:3000/login \
-H "Content-Type: application/json" \
-d '{"username":"client1","password":"password"}'

**Search**
curl -X POST http://localhost:3000/search \
-H "Content-Type: application/json" \
-H "Authorization: Bearer TOKEN" \
-d '{"query":"vector search"}'

**🤖 Enable AI Responses**
Create account on Anthropic
Generate API key
Add to .env
Restart server

**📊 OpenSearch Dashboard**
http://<ip-address>:5601

**📦 Custom Data Indexing**
Edit:
embed_and_index.py

Replace documents:

documents = [
  {
    "title": "Your Title",
    "content": "Your content...",
    "category": "your-category"
  }
]

**Run:**

python3 embed_and_index.py

**👥 User Management**
Edit:

bcloud-ai/users.json

**Generate password hash:**

node -e "const b=require('bcryptjs'); b.hash('password',10).then(console.log)"

**🔁 Useful Commands**
Restart server
pm2 restart bcloud-ai

**Restart OpenSearch**
docker compose down
docker compose up -d

**🔐 Security Best Practices**
❌ Never upload .env
✅ Use .env.example
🔄 Rotate API keys if exposed

**🎯 Use Cases**
Enterprise search
Internal knowledge base
AI-powered document retrieval
Semantic search systems

**💡 Author**

Mehak Bansal
Cloud DevOps | AI | OpenSearch






