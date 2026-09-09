"use client";

import { useState } from "react";

type Task = {
  id: number;
  title: string;
  assignee: string;
  status: string;
  project: string | null;
};

type ParsedCommand = {
  intent:
    | "CREATE_TASK"
    | "COMPLETE_TASK"
    | "LIST_TASKS"
    | "UPDATE_TASK"
    | "ASSIGN_TASK"
    | string;
  task: string | null;
  assignee: string | null;
  status: string | null;
  project: string | null;
};

export default function Home() {
  const [command, setCommand] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  // -----------------------------
  // VOICE INPUT
  // -----------------------------
  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setResponse(
        "Voice input is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setResponse("Listening...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCommand(transcript);
      setResponse(`Heard: "${transcript}"`);
    };

    recognition.onerror = () => {
      setListening(false);
      setResponse("Sorry, I couldn't understand your voice.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  // -----------------------------
  // CREATE TASK LOCALLY
  // -----------------------------
  const createTask = (data: ParsedCommand) => {
    const newTask: Task = {
      id: Date.now(),
      title: data.task || "Untitled Task",
      assignee: data.assignee || "Unassigned",
      status: data.status || "To Do",
      project: data.project || null,
    };

    setTasks((prev) => [newTask, ...prev]);

    setResponse(
      `Task created successfully: "${newTask.title}"${
        newTask.assignee !== "Unassigned"
          ? ` and assigned to ${newTask.assignee}.`
          : "."
      }`
    );
  };

  // -----------------------------
  // COMPLETE TASK
  // -----------------------------
  const completeTask = (data: ParsedCommand) => {
    if (!data.task) {
      setResponse("Please specify which task you want to complete.");
      return;
    }

    const taskName = data.task.toLowerCase();

    const existingTask = tasks.find(
      (task) =>
        task.title.toLowerCase() === taskName ||
        task.title.toLowerCase().includes(taskName)
    );

    if (!existingTask) {
      setResponse(`I couldn't find a task called "${data.task}".`);
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === existingTask.id
          ? { ...task, status: "Completed" }
          : task
      )
    );

    setResponse(`Task "${existingTask.title}" has been completed.`);
  };

  // -----------------------------
  // ASSIGN TASK
  // -----------------------------
  const assignTask = (data: ParsedCommand) => {
    if (!data.task) {
      setResponse("Please specify the task.");
      return;
    }

    if (!data.assignee) {
      setResponse("Please specify who should be assigned the task.");
      return;
    }

    const taskName = data.task.toLowerCase();

    const existingTask = tasks.find(
      (task) =>
        task.title.toLowerCase() === taskName ||
        task.title.toLowerCase().includes(taskName)
    );

    if (!existingTask) {
      setResponse(`I couldn't find a task called "${data.task}".`);
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === existingTask.id
          ? { ...task, assignee: data.assignee || "Unassigned" }
          : task
      )
    );

    setResponse(
      `Task "${existingTask.title}" has been assigned to ${data.assignee}.`
    );
  };

  // -----------------------------
  // UPDATE TASK
  // -----------------------------
  const updateTask = (data: ParsedCommand) => {
    if (!data.task) {
      setResponse("Please specify which task you want to update.");
      return;
    }

    const taskName = data.task.toLowerCase();

    const existingTask = tasks.find(
      (task) =>
        task.title.toLowerCase() === taskName ||
        task.title.toLowerCase().includes(taskName)
    );

    if (!existingTask) {
      setResponse(`I couldn't find a task called "${data.task}".`);
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === existingTask.id
          ? {
              ...task,
              status: data.status || task.status,
              assignee: data.assignee || task.assignee,
              project: data.project || task.project,
            }
          : task
      )
    );

    setResponse(`Task "${existingTask.title}" has been updated.`);
  };

  // -----------------------------
  // PROCESS COMMAND
  // -----------------------------
  const processCommand = async () => {
    if (!command.trim()) {
      setResponse("Please enter or speak a command.");
      return;
    }

    setLoading(true);
    setResponse("Understanding your command...");

    try {
      const res = await fetch("/api/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command: command.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Command processing failed");
      }

      let parsed: ParsedCommand;

      // Gemini returns JSON as a string
      if (typeof data.result === "string") {
        let cleaned = data.result.trim();

        // Remove markdown code fences if Gemini adds them
        cleaned = cleaned
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        parsed = JSON.parse(cleaned);
      } else {
        parsed = data.result;
      }

      console.log("Parsed command:", parsed);

      switch (parsed.intent) {
        case "CREATE_TASK":
          createTask(parsed);
          break;

        case "COMPLETE_TASK":
          completeTask(parsed);
          break;

        case "ASSIGN_TASK":
          assignTask(parsed);
          break;

        case "UPDATE_TASK":
          updateTask(parsed);
          break;

        case "LIST_TASKS":
          if (tasks.length === 0) {
            setResponse("You currently have no tasks.");
          } else {
            setResponse(
              `You currently have ${tasks.length} task${
                tasks.length === 1 ? "" : "s"
              }.`
            );
          }
          break;

        default:
          setResponse(
            "I understood the command, but this action is not supported yet."
          );
      }
    } catch (error) {
      console.error("Command error:", error);

      setResponse(
        "Sorry, I couldn't process that command. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // ENTER KEY
  // -----------------------------
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      processCommand();
    }
  };

  // -----------------------------
  // CLEAR ALL
  // -----------------------------
  const clearTasks = () => {
    setTasks([]);
    setResponse("All tasks have been cleared.");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Talk to Your Project
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              AI-powered voice project management
            </p>
          </div>

          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
            ● AI Online
          </div>
        </div>
      </header>

      {/* MAIN */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        {/* HERO */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-4xl">
            🎙️
          </div>

          <h2 className="text-4xl font-bold tracking-tight">
            Talk to your project.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Use your voice or type a command. Gemini understands your intent
            and updates your project tasks instantly.
          </p>
        </div>

        {/* COMMAND BOX */}
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <label className="mb-3 block text-sm font-medium text-slate-300">
            Project command
          </label>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Create a task called Fix login bug and assign to Ayushi"
              className="min-h-14 flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-5 text-white outline-none transition focus:border-indigo-500"
            />

            {/* VOICE BUTTON */}
            <button
              onClick={startListening}
              disabled={listening}
              className={`min-h-14 rounded-2xl px-6 font-semibold transition ${
                listening
                  ? "cursor-not-allowed bg-red-500 text-white"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              {listening ? "🔴 Listening..." : "🎤 Speak"}
            </button>

            {/* SEND BUTTON */}
            <button
              onClick={processCommand}
              disabled={loading}
              className="min-h-14 rounded-2xl bg-indigo-600 px-7 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Processing..." : "Run Command"}
            </button>
          </div>

          {/* RESPONSE */}
          {response && (
            <div className="mt-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                AI Response
              </div>

              <p className="text-slate-200">{response}</p>
            </div>
          )}
        </div>

        {/* EXAMPLES */}
        <div className="mx-auto mt-8 max-w-4xl">
          <p className="mb-3 text-sm font-medium text-slate-400">
            Try these commands
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              "Create a task called Fix login bug and assign to Ayushi",
              "Show my tasks",
              "Complete the task Fix login bug",
            ].map((example) => (
              <button
                key={example}
                onClick={() => setCommand(example)}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-left text-sm text-slate-300 transition hover:border-indigo-500/50 hover:bg-slate-800"
              >
                <span className="mb-2 block text-indigo-400">→</span>
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* TASK SECTION */}
        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Project Tasks</h3>
              <p className="mt-1 text-sm text-slate-400">
                {tasks.length} task{tasks.length === 1 ? "" : "s"} in this
                session
              </p>
            </div>

            {tasks.length > 0 && (
              <button
                onClick={clearTasks}
                className="rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
              >
                Clear Tasks
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
              <div className="mb-3 text-4xl">📋</div>

              <h4 className="text-lg font-semibold text-slate-300">
                No tasks yet
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                Use the command box above to create your first task.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4
                          className={`text-lg font-semibold ${
                            task.status === "Completed"
                              ? "text-slate-500 line-through"
                              : "text-white"
                          }`}
                        >
                          {task.title}
                        </h4>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            task.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
                        <span>👤 {task.assignee}</span>

                        {task.project && (
                          <span>📁 {task.project}</span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      Task #{task.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-14">
          <h3 className="mb-6 text-center text-2xl font-bold">
            How it works
          </h3>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                icon: "🎤",
                title: "Speak",
                text: "Give a natural project command.",
              },
              {
                icon: "🧠",
                title: "Understand",
                text: "Gemini identifies your intent.",
              },
              {
                icon: "⚡",
                title: "Execute",
                text: "The application performs the action.",
              },
              {
                icon: "💬",
                title: "Respond",
                text: "You immediately see the result.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-center"
              >
                <div className="text-3xl">{item.icon}</div>

                <h4 className="mt-3 font-semibold">{item.title}</h4>

                <p className="mt-2 text-sm text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        ArchScale Guild Hackathon • AS-03 • Talk to Your Project
      </footer>
    </main>
  );
}