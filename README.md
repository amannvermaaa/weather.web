# 🌩️ WeatherWeb AI

![WeatherWeb AI](https://img.shields.io/badge/Status-Active-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC) ![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4)

A next-generation, full-stack weather application built with a stunning glassmorphic UI, real-time weather analytics, and advanced AI integration.

## 🏗️ Architecture & Technology Stack

### 1. Frontend (Client-Side)
- **Framework:** **Next.js 15** (React 19) utilizing the App Router architecture for seamless client-side navigation.
- **Styling:** **Tailwind CSS** is used for utility-first styling, ensuring a fully responsive layout. We exclusively use a dark-mode theme featuring "Glassmorphism" (backdrop-blur, translucent panels, glowing borders).
- **Animations:** **Framer Motion** powers smooth page transitions, stagger effects, and interactive UI feedback (like the pulsing radar on the Alerts page).
- **Icons & Typography:** **Lucide React** for crisp vector icons. 
- **Mapping & 3D:** Uses libraries to render interactive data, making the weather experience highly visual.

### 2. Backend (Server-Side APIs)
The backend is completely serverless, utilizing **Next.js API Routes** (`/api/*`) running on the server.
- **`/api/chat` (AI Assistant):** Integrates the **Google Gemini SDK** (`@google/genai`). It securely calls the `gemini-3.6-flash` model, passing the user's current weather context so the AI can give context-aware responses (like packing lists based on whether it's raining or hot).
- **`/api/attractions` (Tourist Discovery):** Acts as a proxy to the **Wikipedia GeoSearch API**. It searches for landmarks within a 10km radius of the selected city's coordinates, fetching thumbnails, ratings, and descriptions.

### 3. Database & Authentication
- **Local JSON Database:** Instead of an external database like MongoDB or PostgreSQL, user data is securely stored on the server in a local file (`data/users.json`). This makes the app incredibly lightweight and easy to run locally.
- **Custom Auth Logic:** 
  - **`/api/auth/signup`**: Creates new users, hashes passwords using Node.js built-in `crypto` (`SHA-256`), and prevents duplicate emails.
  - **`/api/auth/login`**: Verifies email/password hashes and generates a secure session token.
- **Email Notifications (`Nodemailer`):** The signup API integrates `nodemailer` via SMTP. Whenever a new user signs up, the backend automatically sends a styled HTML notification email to the admin.

---

## ✨ Core Features

1. **Intelligent Weather Dashboard:**
   - Real-time display of Temperature, Wind Speed, Humidity, and Rainfall.
   - Global city search with latitude/longitude resolution.
   
2. **Context-Aware AI Chat:**
   - Users can chat with an embedded AI assistant. The AI knows the active city's weather data and answers accordingly (e.g., "Will I need an umbrella today?").

3. **Live Meteorological Alerts:**
   - A dedicated threat detection center (`/alerts`) that warns users of High Winds, Heatwaves, or Flash Floods using a dynamic UI that shifts from a green "All Clear" shield to pulsing red warning cards.

4. **Attractions Explorer:**
   - Using geolocation, the app suggests nearby famous landmarks, distances, and Wikipedia descriptions for travelers checking the weather of their destination.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weatherweb.git
   cd weatherweb
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env.local` file in the root directory and add the following keys:
   ```env
   # Your Google Gemini API Key for the Chat Assistant
   GEMINI_API_KEY=your_gemini_api_key_here

   # For Admin Email Notifications on Signup
   EMAIL_USER=your_gmail_address
   EMAIL_APP_PASSWORD=your_16_digit_google_app_password
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.
