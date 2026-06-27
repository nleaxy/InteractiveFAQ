# SynFAQ

**SynFAQ** is an intelligent B2B SaaS platform designed for creating, managing, and integrating smart Knowledge Bases and FAQ sections. Powered by advanced Machine Learning, semantic search, and Generative AI, SynFAQ ensures users find the right answers even when their search queries are vague, misspelled, or use colloquial language.

---

<img width="1280" height="636" alt="изображение" src="https://github.com/user-attachments/assets/c1f77a38-b9da-4bfc-b465-7eb793e44f4f" />


## ✨ Key Features & Interface

### 🛠️ 1. Administrative Workspace & Project Control

* **Multi-Project Account Dashboard:** Manage multiple independent FAQ environments for different business units from a single, elegant workspace.
* **Granular Metrics Monitoring:** Track active knowledge bases, global question counters, and creation dates seamlessly.

<img width="1280" height="510" alt="изображение" src="https://github.com/user-attachments/assets/e4eac08c-5905-4712-ba69-7dd3e101d335" />

* **Flexible FAQ Onboarding:** Choose between instant automated generation or manual initialization of an empty knowledge base structure.
* **AI-Powered Generation & File Ingestion:** Instantly parse corporate descriptions or extract data from uploaded files using advanced LLMs via OpenRouter to build complex QA trees.
* **Dynamic Range Limits:** Control token consumption and generation density by requesting between 5 and 20 targeted questions per session.

<p align="center">
  <img src="https://github.com/user-attachments/assets/1a2ca715-4ce1-4666-b06d-c25e125fa131" width="48%" alt="изображение" />
  &nbsp;
  <img src="https://github.com/user-attachments/assets/497fe7b1-50fe-4201-bfa8-df39e1225509" width="49%" alt="изображение" />
</p>

* **Complete CRUD Dashboard:** Clean interactive layout to manually add questions, manage categories, append tag sets, or edit data fields before deployment.
* **Synonym Mapping:** Explicitly map alternative search phrases to individual questions to fine-tune context-based retrieval probability.
<img width="1280" height="638" alt="изображение" src="https://github.com/user-attachments/assets/19c1b3a8-4dd1-490f-819d-6995115beb62" />


### 👥 2. End-User Customer Experience

* **Intelligent Semantic Search:** Context-aware search framework focusing on string intentions rather than static keyword evaluation.
* **Voice Search (MVP):** Native audio interface integration enabling users to dictate search queries directly inside widgets.
* **Categorized Layout Routing:** Fluid UI component filtering with responsive chips and clean accordion wrappers.
<img width="1280" height="639" alt="изображение" src="https://github.com/user-attachments/assets/d11aec5e-6de3-4c33-8e06-3ee6431cf673" />

---

## 🛠 Tech Stack

* **Frontend:** React, TypeScript, Tailwind CSS
* **Backend:** Python, FastAPI, Pydantic (Strict configuration and data validation layer)
* **Database:** PostgreSQL (Relational schema storage)
* **AI/ML Core:** Local semantic retrieval powered by **`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`** (multilingual dense vector embeddings & similarity scoring), paired with OpenRouter Hub Orchestration (`Gemma 4 26B` / `Llama 3.3`) for automated FAQ tree generation. Features a highly resilient routing setup automatically cascading to backup clusters to prevent upstream HTTP 429 rate-limit exceptions.

---

## 📂 Project Structure

```text
InteractiveFAQ/
├── backend/            # FastAPI Application Source Code
│   ├── app/
│   │   ├── api/        # REST Route Controllers (Endpoints)
│   │   ├── models/     # SQLAlchemy Database Models
│   │   └── schemas/    # Pydantic Schemas (Request/Response Validation)
│   ├── requirements.txt
│   └── .env.example
├── frontend/           # React Client Application
│   ├── src/
│   ├── package.json
│   └── tailwind.config.js
├── docs/
│   └── screenshots/    # Application Images for Documentation
├── docker-compose.yml
└── README.md

```

---

## 🚀 Local Installation & Quick Start

### Prerequisites

* Python 3.10+
* Node.js (v18+) & npm
* PostgreSQL Instance

### 1. Backend Setup

1. Navigate to the backend directory:

```bash
cd backend

```

2. Create and activate an isolated virtual environment:

```bash
python -m venv venv
# On Windows:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

```

3. Install the required dependencies:

```bash
pip install -r requirements.txt

```

4. Configure your environment variables. Create a `.env` file based on `.env.example`:

```text
DATABASE_URL=postgresql://user:password@localhost:5432/synfaq
OPENROUTER_API_KEY=your_sk_or_v1_openrouter_api_key

```

5. Spin up the local development server:

```bash
uvicorn app.main:app --reload

```

The backend interactive documentation will now be live at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend

```

2. Install node packages:

```bash
npm install

```

3. Start the dev server:

```bash
npm start

```

Open your browser and visit `http://localhost:3000`.

---

## 🔌 REST API & B2B Integration Hub

SynFAQ exposes a production-ready developer ecosystem allowing businesses to fetch external integrations and bridge their customer service widgets to the main semantic knowledge model.

<img width="1280" height="638" alt="изображение" src="https://github.com/user-attachments/assets/e8ec5817-38a7-420a-9387-db838e8ca33b" />

### Core Endpoint Map

#### 1. AI FAQ Generation

* **Endpoint:** `POST /v1/generate/`
* **Payload Format:**

```json
{
  "description": "Your business details or system specs...",
  "count": 7
}

```

*Note: `count` parameter must be an integer between 5 and 20.*

#### 2. FAQ Management (CRUD)

* `GET /api/v1/faqs` - Fetch all deployed categories and matching QA entries.
* `POST /api/v1/faqs` - Explicitly persist a custom QA item with specified search synonyms.
* `PUT /api/v1/faqs/{id}` - Modify existing entries.
* `DELETE /api/v1/faqs/{id}` - Wipe a record from the knowledge database.

#### 3. ML Semantic Search

* **Endpoint:** `GET /api/v1/search?query=your_search_term`
* **Behavior:** Evaluates the string against both the canonical title strings and the bound synonym array utilizing similarity score matrix rankings.

<img width="1918" height="912" alt="Снимок экрана 2026-06-25 010020" src="https://github.com/user-attachments/assets/d3ad6c07-ec93-4a49-9ac7-af4d3ac904d1" />

---

## 🗺 Roadmap

* [ ] Enhance conversational tone adapters inside the AI generation layer.
* [ ] Implement native bulk data imports (.docx, .pdf, .json).
* [ ] Introduce real-time analytics dashboard to track user queries and search misses.
* [ ] Full mobile responsive optimizations for the admin viewport.
* [ ] Multi-tenant cloud workspace implementation.

---

## 👥 The Team

* **Team Lead / ML Engineer**
* **Backend Developer**
* **Frontend Developer**
* **UX/UI Designer**
* **Business Analyst**

---

## 📄 License

This repository was engineered explicitly for academic practice purposes. All rights reserved.
