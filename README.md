
# 🤖 Generative AI FAQ Chatbot - React Frontend

A modern, responsive chat interface built with React and TypeScript that connects to a FastAPI backend powered by IBM Watsonx AI. Features a WhatsApp-style design with smooth animations and real-time messaging experience.

![Chatbot Preview](https://via.placeholder.com/800x400/6366f1/white?text=AI+FAQ+Chatbot)

## ✨ Features

- 💬 **Modern Chat Interface** - WhatsApp/Intercom-inspired design
- 🤖 **AI-Powered Responses** - Connected to IBM Watsonx AI via FastAPI
- 🌀 **Loading States** - Typing indicators and smooth animations
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- ⏰ **Message Timestamps** - Real-time message tracking
- 🎨 **Beautiful UI** - Gradient backgrounds and smooth transitions
- 🔄 **Auto-scroll** - Automatically scrolls to new messages
- ⚡ **Real-time Feel** - Instant message sending with loading feedback

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- FastAPI backend running on `localhost:8000`

### Backend Setup (Required)

Make sure your FastAPI backend is running with these API credentials:

```bash
IBM_API_KEY=3nqGorN5PMhb9tOFO1ypA3a0-EllqF-AwJoLQbK3iCqM
IBM_PROJECT_ID=a4a4d653-ddc5-41b7-b06d-a43a66383b3a
IBM_REGION=eu-de
IBM_MODEL_ID=google/flan-ul2
```

Your backend should expose a POST endpoint at:
```
http://localhost:8000/ask
```

With request format:
```json
{
  "query": "Your question here"
}
```

Response format:
```json
{
  "answer": "AI generated response"
}
```

### Frontend Installation

1. **Clone and navigate to the project:**
   ```bash
   cd your-chatbot-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:8080`

## 🏗️ Project Structure

```
src/
├── pages/
│   └── Index.tsx          # Main chat interface
├── lib/
│   └── utils.ts           # Utility functions
├── index.css              # Global styles and animations
└── main.tsx               # App entry point
```

## 🎨 Design Features

- **Gradient Backgrounds** - Beautiful blue to purple gradients
- **Message Bubbles** - Distinct styling for user and bot messages
- **Typing Animation** - Bouncing dots when AI is thinking
- **Smooth Animations** - Fade-in effects for new messages
- **Responsive Layout** - Mobile-first design approach
- **Modern Icons** - Lucide React icons throughout

## 🔧 Configuration

### API Endpoint

To change the backend URL, modify the fetch call in `src/pages/Index.tsx`:

```typescript
const response = await fetch('http://localhost:8000/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: inputText.trim(),
  }),
});
```

### Styling

The app uses Tailwind CSS for styling. Custom animations and colors are defined in `src/index.css`.

## 🚨 Troubleshooting

### Common Issues

1. **"Failed to get response from AI"**
   - Ensure your FastAPI backend is running on `localhost:8000`
   - Check that CORS is properly configured in your FastAPI app
   - Verify the API endpoint accepts POST requests to `/ask`

2. **Messages not appearing**
   - Check browser console for errors
   - Verify the API response format matches expected structure

3. **Styling issues**
   - Clear browser cache
   - Ensure Tailwind CSS is properly configured

### Backend CORS Setup

Make sure your FastAPI backend includes CORS middleware:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🔮 Future Enhancements

- [ ] Dark mode toggle
- [ ] Message export functionality
- [ ] Voice input support
- [ ] Message reactions
- [ ] Chat history persistence
- [ ] Multi-language support
- [ ] File upload capability

## 📝 API Reference

### Send Message

**POST** `/ask`

**Request Body:**
```json
{
  "query": "string"
}
```

**Response:**
```json
{
  "answer": "string"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and IBM Watsonx AI**
