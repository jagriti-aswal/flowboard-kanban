import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "../components/TaskCard";

// Mock DnD
vi.mock("@hello-pangea/dnd", () => ({
  Draggable: ({ children }: any) =>
    children(
      {
        innerRef: vi.fn(),
        draggableProps: {},
        dragHandleProps: {},
      },
      {
        isDragging: false,
      }
    ),
}));

describe("TaskCard", () => {
  const mockTask = {
    id: "1",
    title: "Fix authentication race condition",
    description: "Testing description",
    priority: "High",
    category: "Bug",
    status: "todo",
    attachments: [],
    createdAt: "",
    updatedAt: "",
  };

  it("renders task title", () => {
    render(
      <TaskCard
        task={mockTask}
        index={0}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "Fix authentication race condition"
      )
    ).toBeInTheDocument();
  });

  it("renders task description", () => {
    render(
      <TaskCard
        task={mockTask}
        index={0}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "Testing description"
      )
    ).toBeInTheDocument();
  });

  it("renders priority badge", () => {
    render(
      <TaskCard
        task={mockTask}
        index={0}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getByText("High")
    ).toBeInTheDocument();
  });
});