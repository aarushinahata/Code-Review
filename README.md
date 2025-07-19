# Code Review

A full-stack web application that provides intelligent code review suggestions using multiple AI models (Google Gemini and OpenAI GPT). Built with React, Node.js, and MongoDB.

## 🚀 Features

- **Multi-AI Model Support**: Choose between Gemini 2.0 Flash, Gemini Pro, and OpenAI GPT-3.5
- **Real-time Code Review**: Get instant AI-powered feedback on your code
- **User Authentication**: Secure login/register system with JWT tokens and bcrypt password hashing
- **Review History**: Save and manage your code review history with MongoDB persistence
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Syntax Highlighting**: Code editor with Prism.js syntax highlighting and markdown rendering
- **Responsive Design**: Works seamlessly across different devices
- **Real-time Error Handling**: Comprehensive error management and user feedback
- **Modern UI/UX**: Intuitive interface with smooth interactions

## 🛠️ Tech Stack

**Frontend:**
- React 19 with Vite
- Axios for API communication
- React Simple Code Editor with Prism.js syntax highlighting
- React Markdown for review display
- Local storage for offline history

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Google Generative AI & OpenAI APIs
- bcryptjs for password hashing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Code-Review
   ```

2. **Backend Setup**
   ```bash
   cd BackEnd
   npm install
   ```
   Create `.env` file:
   ```env
   GOOGLE_GEMINI_KEY=your_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   ```

4. **Run the Application**
   ```bash
   # Terminal 1 - Backend
   cd BackEnd && npm start
   
   # Terminal 2 - Frontend
   cd Frontend && npm run dev
   ```

## 🔧 API Endpoints

- `POST /ai/get-review` - Get AI code review
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /review/history` - Get user's review history
- `POST /review/save` - Save review to database

## 📸 Screenshots

- 🔐 Login Page
![Login](./Screenshot/login.png)

- 🧠 Review Output
![Review](./Screenshot/review.png)

- 📜 Review History
![History Screenshot](./Screenshot/history.png)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

💡 Note: This app is a personal learning project to explore full-stack development and GenAI integration.
