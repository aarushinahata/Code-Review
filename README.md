# Code Review App

## Overview
A full-stack application for AI-powered code review using React (Vite) for the frontend and Node.js/Express for the backend, integrated with Google Generative AI.

---

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Backend Setup
1. Navigate to the `BackEnd` directory:
   ```sh
   cd BackEnd
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add your Google Gemini API key:
   ```env
   GOOGLE_GEMINI_KEY=your_api_key_here
   ```
4. Start the backend server:
   ```sh
   npm start
   ```
   The backend runs on `http://localhost:3000` by default.

### Frontend Setup
1. Navigate to the `Frontend` directory:
   ```sh
   cd Frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend dev server:
   ```sh
   npm run dev
   ```
   The frontend runs on `http://localhost:5173` by default.

---

## Usage
- Enter your code in the editor and click **Review** to get an AI-generated code review.
- Error messages will be shown if the backend or AI service is unavailable.

---

## API Endpoints
### POST `/ai/get-review`
- **Request Body:**
  ```json
  { "code": "<your code here>" }
  ```
- **Response:**
  - `200 OK`: AI-generated review as plain text/markdown.
  - `400 Bad Request`: If `code` is missing.
  - `500 Internal Server Error`: If an unexpected error occurs.
  - `503 Service Unavailable`: If the AI service is overloaded.

---

## Security
- All user input is validated for presence on the backend.
- **Important:** For production, further sanitize and validate all input to prevent injection attacks.
- Use HTTPS in production to secure data in transit.
- Never commit your `.env` file or API keys to version control.

---

## Feature Ideas
- **History:** Let users see a history of their code reviews.
- **Export:** Allow users to export reviews as PDF or Markdown.
- **Authentication:** Add user accounts for personalized experiences.
- **Multiple Models:** Let users choose between different AI models or fallback if one is overloaded.

---

## Contributing
1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a pull request

---

## License
MIT
