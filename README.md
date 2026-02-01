# Mentra | AI Mental Health Companion

Mentra is a sophisticated, grounded mental health assistant designed to bridge the gap between AI conversation and clinical triage. Built with a "premium organic" aesthetic, it focuses on human-first listening and somatic awareness.

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