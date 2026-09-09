# ProjectTalk — Talk to Your Project

AI-powered voice project management interface built for the **ArchScale Guild Intern Technology Hackathon — AS-03**.

## 🚀 Live Demo

https://archscale-as03-voice-project.vercel.app/

## 💻 GitHub Repository

https://github.com/ayushi-baliyan/archscale-as03-voice-project

---

## 🎯 Problem

Project management often requires users to repeatedly click through dashboards, forms, task lists and status menus.

For simple actions such as creating a task, assigning it to someone, checking tasks or completing a task, this interaction can become slow and repetitive.

The AS-03 problem asks:

> What if you could talk to your project?

ProjectTalk explores a voice-first approach where users can communicate with their project using natural language commands instead of manually navigating multiple UI controls.

---

## 💡 Solution

ProjectTalk allows users to interact with their project using natural-language and voice commands.

Instead of navigating through multiple screens, users can simply type or speak a command such as:

- Create a task
- Assign a task
- Complete a task
- List project tasks

The system understands the command, identifies the user's intent and extracts important entities such as:

- Task
- Assignee
- Status
- Project

The application then uses this information to perform the corresponding project-management action and update the task interface.

---

## ✨ Key Features

### 🗣️ Natural Language Commands

Users can interact with the project using normal sentences instead of fixed command syntax.

### 🎤 Voice Input

Users can speak project-management commands using the browser's speech recognition capability.

### 🤖 AI Command Understanding

Google Gemini is used to understand natural-language commands and convert them into structured project-management information.

### 📋 Task Management

The prototype supports:

- Creating tasks
- Completing tasks
- Assigning tasks
- Updating task information
- Listing project tasks

### 🌐 Live Deployment

The application is deployed using Vercel and can be tested directly from the browser.

---

## 🏗️ Architecture

User
↓
Text / Voice Command
↓
ProjectTalk Frontend
↓
Next.js API Route
↓
Google Gemini
↓
Intent + Entity Extraction
↓
Project Management Action
↓
Updated Task UI

---

## 🛠️ Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Google Gemini API
- Web Speech API
- Vercel

---

## 🤖 Role of AI

Google Gemini is used as the natural-language command parser.

For each command, Gemini identifies the relevant project-management intent and extracts entities such as:

- Task name
- Assignee
- Status
- Project

For example, a natural-language command can be converted into structured information like:

{
  "intent": "CREATE_TASK",
  "task": "Fix login bug",
  "assignee": "Ayushi",
  "status": null,
  "project": null
}

AI makes the interface more flexible than a fixed command system because users can express the same action using different natural-language sentences.

---

## 🧠 Design Decisions

### Why Voice?

Project-management interfaces can require many clicks for simple actions. Voice provides a faster and more natural interaction method for repetitive commands.

### Why Natural Language?

Users should not have to remember an exact command format. Natural language makes the interface easier and more flexible to use.

### Why Next.js?

Next.js provides both the frontend application and server-side API routes in the same project, making the prototype simple to develop and deploy.

### Why Gemini?

Gemini provides natural-language understanding that can convert user commands into structured project-management intents and entities.

### Why Web Speech API?

The Web Speech API provides browser-based speech recognition, allowing users to speak commands directly into the application without requiring a separate speech-to-text service.

---

## 📌 Example Commands

### Create a Task

"Create a task called Fix login bug and assign to Ayushi"

### List Tasks

"Show my tasks"

### Complete a Task

"Complete the task Fix login bug"

### Assign a Task

"Assign Design homepage to Ayushi"

---

## 🔐 Environment Variables

Create a `.env.local` file and add your Gemini API key:

GEMINI_API_KEY=your_gemini_api_key

Never commit the API key to GitHub.

---

## ▶️ Run Locally

Clone the repository:

git clone https://github.com/ayushi-baliyan/archscale-as03-voice-project.git

Go to the project directory:

cd archscale-as03-voice-project

Install dependencies:

npm install

Start the development server:

npm run dev

Open the application in your browser:

http://localhost:3000

---

## 🧪 Testing

The prototype was tested using both text and voice-based project commands.

Tested workflows include:

- Creating a task
- Assigning a task
- Completing a task
- Listing tasks
- Processing natural-language commands
- Voice command input
- Live deployed application

---

## 🔮 Future Improvements

The current prototype focuses on demonstrating the core voice-to-command workflow.

Future versions could include:

- Persistent database storage
- User authentication and authorization
- Multiple projects and workspaces
- Team members and role-based permissions
- Project-specific context and conversational memory
- Better voice feedback and text-to-speech responses
- Confirmation before destructive actions
- Task due dates and priorities
- Real-time collaboration
- Advanced task filtering and search
- Integration with existing project-management platforms
- More advanced conversational project queries
- Improved error handling and fallback responses
- Support for more voice commands and natural-language variations

---

## 🏆 Hackathon

Built for:

**ArchScale Guild Intern Technology Hackathon**

### Problem Statement

**AS-03 — What if you could talk to your project?**

The prototype focuses on:

- Speech-to-text
- Speech-to-command execution
- Intent understanding
- Entity extraction

---

## 👩‍💻 Author

**Ayushi Baliyan**

GitHub:

https://github.com/ayushi-baliyan

Live Project:

https://archscale-as03-voice-project.vercel.app/