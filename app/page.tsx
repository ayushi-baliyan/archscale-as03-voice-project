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
      setResponse("Listening to your command...");
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
  // CREATE TASK
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

      if (typeof data.result === "string") {
        let cleaned = data.result.trim();

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
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      processCommand();
    }
  };

  // -----------------------------
  // CLEAR TASKS
  // -----------------------------
  const clearTasks = () => {
    setTasks([]);
    setResponse("All tasks have been cleared.");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute bottom-[-200px] left-[-150px] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-[-150px] top-[35%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-xl shadow-lg shadow-indigo-500/10">
              ✦
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                ProjectTalk
              </h1>

              <p className="text-xs text-slate-500">
                Talk to your project
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs font-medium text-emerald-400 sm:px-4 sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            AI Online
          </div>
        </div>
      </header>

      {/* MAIN */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">

        {/* HERO */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] border border-indigo-400/20 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 text-4xl shadow-2xl shadow-indigo-500/10">
            🎙️
          </div>

          <div className="mb-4 inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-400/5 px-4 py-2 text-xs font-medium text-indigo-300">
            AI-Powered Project Management
          </div>

          <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Talk to your
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              project.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Speak naturally. ProjectTalk understands your intent,
            extracts the important details and updates your tasks.
          </p>
        </div>

        {/* COMMAND PANEL */}
        <div className="mx-auto mt-10 max-w-5xl">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="rounded-[22px] border border-white/5 bg-slate-950/80 p-5 sm:p-7">

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Give your project a command
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Type a command or use your voice
                  </p>
                </div>

                <div className="hidden rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-500 sm:block">
                  Press Enter ↵
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row">

                {/* INPUT */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={command}
                    onChange={(event) => setCommand(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Create a task called Fix login bug..."
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                {/* VOICE */}
                <button
                  onClick={startListening}
                  disabled={listening || loading}
                  className={`h-14 rounded-2xl border px-6 text-sm font-semibold transition ${
                    listening
                      ? "border-red-400/30 bg-red-500/10 text-red-300 shadow-lg shadow-red-500/10"
                      : "border-white/10 bg-white/[0.05] text-slate-200 hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-white"
                  }`}
                >
                  {listening ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="flex gap-1">
                        <span className="h-3 w-1 animate-pulse rounded-full bg-red-400" />
                        <span className="h-5 w-1 animate-pulse rounded-full bg-red-400 [animation-delay:150ms]" />
                        <span className="h-3 w-1 animate-pulse rounded-full bg-red-400 [animation-delay:300ms]" />
                      </span>
                      Listening
                    </span>
                  ) : (
                    "🎤 Speak"
                  )}
                </button>

                {/* RUN */}
                <button
                  onClick={processCommand}
                  disabled={loading}
                  className="h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 text-sm font-bold shadow-lg shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Processing
                    </span>
                  ) : (
                    "Run Command →"
                  )}
                </button>
              </div>

              {/* AI RESPONSE */}
              {response && (
                <div className="mt-5 rounded-2xl border border-indigo-400/15 bg-indigo-500/[0.07] p-4">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-sm">
                      ✦
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                        AI Response
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-300">
                        {response}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* EXAMPLES */}
        <div className="mx-auto mt-8 max-w-5xl">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Try a command
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                icon: "＋",
                text: "Create a task called Fix login bug and assign to Ayushi",
              },
              {
                icon: "☷",
                text: "Show my tasks",
              },
              {
                icon: "✓",
                text: "Complete the task Fix login bug",
              },
            ].map((example) => (
              <button
                key={example.text}
                onClick={() => setCommand(example.text)}
                className="group rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-400/30 hover:bg-indigo-500/[0.06]"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 transition group-hover:bg-indigo-500/20">
                  {example.icon}
                </div>

                <p className="text-sm leading-6 text-slate-400 transition group-hover:text-slate-200">
                  {example.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* TASKS */}
        <div className="mt-16">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold tracking-tight">
                  Project Tasks
                </h3>

                <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-300">
                  {tasks.length}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Tasks created and managed through natural language.
              </p>
            </div>

            {tasks.length > 0 && (
              <button
                onClick={clearTasks}
                className="self-start rounded-xl border border-red-400/20 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 sm:self-auto"
              >
                Clear all
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.025] px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-3xl">
                📋
              </div>

              <h4 className="mt-5 text-lg font-semibold text-slate-300">
                Your project is empty
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first task using a natural-language command above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group rounded-[22px] border border-white/10 bg-white/[0.025] p-5 transition hover:border-indigo-400/20 hover:bg-white/[0.04]"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4
                          className={`text-base font-semibold sm:text-lg ${
                            task.status === "Completed"
                              ? "text-slate-500 line-through"
                              : "text-white"
                          }`}
                        >
                          {task.title}
                        </h4>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                            task.status === "Completed"
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                              : "border-amber-400/20 bg-amber-400/10 text-amber-400"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
                          👤 {task.assignee}
                        </span>

                        {task.project && (
                          <span className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
                            📁 {task.project}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      #{String(task.id).slice(-6)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-20">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
              Simple workflow
            </div>

            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              From voice to action
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              ProjectTalk converts a natural command into an actionable
              project update.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                number: "01",
                icon: "🎤",
                title: "Speak",
                text: "Give a natural project command.",
              },
              {
                number: "02",
                icon: "🧠",
                title: "Understand",
                text: "Gemini identifies intent and entities.",
              },
              {
                number: "03",
                icon: "⚡",
                title: "Execute",
                text: "The application performs the action.",
              },
              {
                number: "04",
                icon: "✓",
                title: "Respond",
                text: "Your project reflects the result.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="relative rounded-[22px] border border-white/10 bg-white/[0.025] p-6 transition hover:border-indigo-400/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-xl">
                    {item.icon}
                  </div>

                  <span className="text-xs font-bold text-slate-700">
                    {item.number}
                  </span>
                </div>

                <h4 className="mt-5 font-semibold text-white">
                  {item.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* HACKATHON BADGE */}
        <div className="mx-auto mt-16 max-w-4xl rounded-[28px] border border-indigo-400/15 bg-gradient-to-r from-indigo-500/[0.08] via-purple-500/[0.05] to-cyan-500/[0.08] p-6 text-center sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
            Built for ArchScale Guild
          </p>

          <h3 className="mt-3 text-xl font-bold sm:text-2xl">
            AS-03 — What if you could talk to your project?
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            A voice-first project management prototype focused on
            speech-to-command execution, intent understanding and entity
            extraction.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 mt-8 border-t border-white/10 bg-slate-950/70 px-5 py-8 text-center">
        <p className="text-xs text-slate-600">
          ProjectTalk • ArchScale Guild Hackathon • AS-03
        </p>

        <p className="mt-2 text-xs text-slate-700">
          Built with Next.js, React, TypeScript & Gemini
        </p>
      </footer>
    </main>
  );
}