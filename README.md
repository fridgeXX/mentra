# Mentra | AI Mental Health Companion

Mentra is a sophisticated, grounded mental health assistant designed to bridge the gap between AI conversation and clinical triage. Built with a "premium organic" aesthetic, it focuses on human-first listening and somatic awareness.

## 🧠 The Brain of Mentra

Mentra utilizes a dual-layered AI architecture powered by the Google Gemini API to balance empathy with precision:

- **Gemini 3 Flash (The Heart):** Manages real-time conversation. Optimized for speed and low latency, it follows strict behavioral guidelines to act as a grounded peer, focusing on reflection and brevity.
- **Gemini 3 Pro (The Mind):** Orchestrates post-session analysis. It synthesizes conversational history to identify deep-seated psychological themes (Grief, Burnout, Loneliness) and matches users with specific therapeutic paths and support groups.

## 🎨 Design Philosophy: "Clinical Organic"

The interface is anchored in a palette designed to be heavy yet soothing:
- **Deep Seaweed (#1B4332):** Grounded headers and clinical anchor.
- **Forest Canopy (#2D6A4F):** Primary actions and vital energy.
- **Iced Matcha (#D8E2DC):** Translucent glass elements with heavy blur.
- **Morning Mist (#F4F7F5):** A soft, eye-friendly canvas.

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mentra-app.git
   cd mentra-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the root directory.
   - Add your Gemini API key:
     ```env
     API_KEY=your_gemini_api_key_here
     ```

4. **Start the development server:**
   ```bash
   npm start
   ```

## 🛠 Tech Stack
- **Frontend:** React 19, Tailwind CSS
- **AI:** Google GenAI SDK (@google/genai)
- **Typography:** Fraunces (Serif), Inter (Sans-serif)
- **Animations:** Custom CSS keyframes for somatic flow

## ⚖️ Safety Disclaimer
Mentra is an AI-driven tool for supportive listening and triage guidance. It is not a replacement for professional medical advice, diagnosis, or treatment. It includes hard-coded safety guardrails to pivot to professional crisis resources when self-harm or immediate distress is detected.