# 🎙️ AI Voice Project Management Assistant

An AI-powered voice interface that allows users to interact with their project and manage tasks using natural language commands.

Instead of manually navigating through a project management application, users can simply speak or type commands such as:

- "Create a task called Fix login bug and assign to Ayushi"
- "Show my tasks"
- "Complete the task Fix login bug"
- "Assign Fix login bug to Ayushi"

The application understands the user's command using Google Gemini and converts it into a structured project management action.

## 🚀 Features

- 🎤 Voice-based project management
- 💬 Natural language text commands
- 🤖 AI-powered command understanding with Google Gemini
- ✅ Create tasks
- 📋 List tasks
- ✔️ Complete tasks
- 👤 Assign tasks
- 🔄 Update task status
- 📊 Display project tasks
- 📱 Responsive user interface
- ⚡ Real-time task updates

## 🎯 Problem Statement

### ArchScale Guild Hackathon — AS-03

**"What if you could talk to your project?"**

Traditional project management systems require users to navigate multiple screens to create, update, assign, and check tasks.

This project introduces a conversational interface where users can interact with their project using natural language and voice.

The goal is to make project management faster, simpler, and more intuitive.

## 🧠 How It Works

The application follows this workflow:

User Voice / Text Command
↓
Speech-to-Text
↓
Next.js API Route
↓
Google Gemini
↓
Intent & Entity Extraction
↓
Project Management Action
↓
Updated Task State
↓
User-Friendly Response

Gemini analyzes the user's command and extracts:

- Intent
- Task
- Assignee
- Status
- Project

Example response:

{
  "intent": "CREATE_TASK",
  "task": "Fix login bug",
  "assignee": "Ayushi",
  "status": null,
  "project": null
}

## 🎤 Voice Interaction

The application uses the browser's **Web Speech API** to convert spoken commands into text.

A user can click the microphone button and speak naturally.

Example command:

Create a task called Fix login bug and assign to Ayushi

The speech is converted into text and then processed by Gemini.

## 💬 Supported Commands

### Create a Task

Create a task called Fix login bug and assign to Ayushi

### Show Tasks

Show my tasks

### Complete a Task

Complete the task Fix login bug

### Assign a Task

Assign Fix login bug to Ayushi

### Update a Task

Update Fix login bug to In Progress

## 🛠️ Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes
- Google Gemini API

### Database / ORM

- PostgreSQL
- Prisma ORM
- Neon PostgreSQL

### Voice

- Web Speech API

## 📂 Project Structure

archscale-as03/
│
├── app/
│   ├── api/
│   │   ├── command/
│   │   │   └── route.ts
│   │   └── tasks/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│
├── lib/
│   └── prisma.ts
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── public/
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── tsconfig.json
└── README.md

## ⚙️ Installation

Clone the repository:

git clone https://github.com/ayushi-baliyan/archscale-as03-voice-project.git

Navigate to the project:

cd archscale-as03

Install dependencies:

npm install

## 🔐 Environment Variables

Create a .env.local file and add:

GEMINI_API_KEY=your_gemini_api_key

Create a .env file and add:

DATABASE_URL=your_postgresql_connection_string

### Important

Never commit API keys, database passwords, or other secrets to GitHub.

These files are excluded through .gitignore.

## ▶️ Run the Application

Start the development server:

npm run dev

Open the application:

http://localhost:3000

## 🗄️ Database Setup

The project uses Prisma ORM with PostgreSQL.

Run:

npx prisma migrate dev

Then generate the Prisma client:

npx prisma generate

## 🔄 Command Processing

The command API receives the user's natural language input.

Example request:

{
  "command": "Create a task called Fix login bug and assign to Ayushi"
}

Gemini processes the command and returns structured information containing the detected intent and entities.

The application then performs the appropriate project management action.

## 🧩 Supported Intents

- CREATE_TASK
- COMPLETE_TASK
- LIST_TASKS
- UPDATE_TASK
- ASSIGN_TASK

## 🌐 Deployment

The application is designed to be deployed using Vercel.

Required environment variable:

GEMINI_API_KEY

For PostgreSQL production setup:

DATABASE_URL

After adding the required environment variables, deploy the project and open the generated Vercel URL.

## 🔮 Future Improvements

- Persistent database-backed task management
- User authentication
- Multiple projects
- Team member management
- Task priorities
- Due dates and reminders
- Voice responses using Text-to-Speech
- Multi-turn conversations
- Project analytics
- Calendar integration
- Role-based access control
- Better conversational context

## 🏆 Hackathon

Built for the **ArchScale Guild Hackathon**.

### Challenge

**AS-03 — What if you could talk to your project?**

The project demonstrates how AI and voice interfaces can provide a more natural way to interact with project management systems.

## 👩‍💻 Author

**Ayushi Baliyan**

GitHub: https://github.com/ayushi-baliyan