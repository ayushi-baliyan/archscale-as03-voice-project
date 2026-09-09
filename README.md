# 🎙️ AI Voice Project Management Assistant

An AI-powered voice interface that allows users to manage project tasks using natural language commands.

Instead of manually navigating through a project management system, users can simply speak or type commands such as:

- "Create a task called Fix login bug and assign to Ayushi"
- "Show my tasks"
- "Complete the task Fix login bug"
- "Assign Fix login bug to Ayushi"

The application understands the command using Google Gemini and performs the corresponding project management action.

---

## 🚀 Features

- 🎤 Voice-based project management
- 💬 Natural language commands
- 🤖 AI-powered command understanding using Google Gemini
- ✅ Create tasks
- 📋 List tasks
- ✔️ Complete tasks
- 👤 Assign tasks
- 🔄 Update task status
- 📊 Project/task information display
- 📱 Responsive and modern UI

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Google Gemini API

### Database
- PostgreSQL
- Prisma ORM
- Neon PostgreSQL

### Voice
- Web Speech API

---

## 🧠 How It Works

The application follows this flow:

User Voice/Text Command
        ↓
Speech-to-Text
        ↓
Next.js API
        ↓
Google Gemini
        ↓
Intent & Entity Extraction
        ↓
Project Management Action
        ↓
Updated Task / Response

Gemini converts natural language commands into structured information such as:

- Intent
- Task
- Assignee
- Status
- Project

Example:

```json
{
  "intent": "CREATE_TASK",
  "task": "Fix login bug",
  "assignee": "Ayushi",
  "status": null,
  "project": null
}
🎯 Supported Commands
DATABASE_URL=your_postgresql_connection_string

Never commit API keys or database credentials to GitHub.

▶️ Run Locally

Start the development server:

npm run dev

Open:

http://localhost:3000
🏗️ Architecture

The project uses a simple AI command-processing architecture.

1. User Input

The user provides a voice or text command.

2. Speech Recognition

The Web Speech API converts spoken commands into text.

3. AI Command Parser

The command is sent to Google Gemini.

Gemini identifies the user's intent and extracts relevant entities.

4. Action Processing

The application processes the structured command and updates the task state.

5. User Response

The updated task information is displayed immediately in the interface.

🔮 Future Improvements
Persistent database-backed task management
Multi-project support
Team member management
Authentication
Voice responses using text-to-speech
Task priorities and deadlines
Calendar integration
Advanced project analytics
Better multi-turn conversations
Deployment with production database
🏆 Hackathon

Built for the ArchScale Guild Hackathon.

Problem Statement

AS-03 — What if you could talk to your project?

The project explores how natural language and voice interfaces can make project management faster and more intuitive.

👩‍💻 Author

Ayushi Baliyan

GitHub:
https://github.com/ayushi-baliyan
