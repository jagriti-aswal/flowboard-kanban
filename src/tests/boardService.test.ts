import { describe, it, expect } from "vitest";

describe("Task Operations", () => {

  it("should create a task object", () => {

    const task = {
      id: "1",
      title: "Fix Bug",
      status: "todo"
    };

    expect(task.title).toBe("Fix Bug");
    expect(task.status).toBe("todo");

  });

  it("should move task status", () => {

    const task = {
      id: "1",
      status: "todo"
    };

    task.status = "done";

    expect(task.status).toBe("done");

  });

  it("should delete task from array", () => {

    const tasks = [
      { id: "1" },
      { id: "2" }
    ];

    const updated = tasks.filter(
      task => task.id !== "1"
    );

    expect(updated.length).toBe(1);

  });

});