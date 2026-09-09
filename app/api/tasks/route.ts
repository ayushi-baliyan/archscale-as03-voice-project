import { NextResponse } from "next/server";

type Task = {
  id: number;
  title: string;
  assignee: string;
  status: string;
  project: string | null;
  createdAt: string;
};

let tasks: Task[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    tasks,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const task: Task = {
      id: Date.now(),
      title: body.title || "Untitled Task",
      assignee: body.assignee || "Unassigned",
      status: body.status || "To Do",
      project: body.project || null,
      createdAt: new Date().toISOString(),
    };

    tasks.unshift(task);

    return NextResponse.json({
      success: true,
      task,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create task",
      },
      { status: 400 }
    );
  }
}