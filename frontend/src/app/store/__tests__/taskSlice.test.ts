import taskReducer, { fetchTasks, addTask, deleteTask } from "../taskSlice";
import { TaskState } from "../taskSlice"; // Import the TaskState type from your slice

describe("taskSlice", () => {
  const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
    totalTasks: 0,
    currentPage: 1,
    limit: 5,
  };

  test("should return the initial state", () => {
    expect(taskReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test("should handle fetchTasks.pending", () => {
    const state = taskReducer(initialState, { type: fetchTasks.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test("should handle fetchTasks.fulfilled", () => {
    const mockTasks = [{ _id: "1", title: "Test Task", description: "Desc", status: "pending" }];
    const state = taskReducer(initialState, { type: fetchTasks.fulfilled.type, payload: { tasks: mockTasks, total: 1 } });

    expect(state.loading).toBe(false);
    expect(state.tasks).toEqual(mockTasks);
    expect(state.totalTasks).toBe(1);
  });

  test("should handle fetchTasks.rejected", () => {
    const state = taskReducer(initialState, { type: fetchTasks.rejected.type, payload: "Error fetching tasks" });
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Error fetching tasks");
  });

  test("should handle addTask.fulfilled", () => {
    const newTask = { _id: "2", title: "New Task", description: "New Desc", status: "pending" };
    const state = taskReducer(initialState, { type: addTask.fulfilled.type, payload: newTask });

    expect(state.tasks).toContainEqual(newTask);
  });

  test("should handle deleteTask.fulfilled", () => {
    const existingState: TaskState = {
      ...initialState,
      tasks: [{ _id: "1", title: "Task 1", description: "Desc", status: "pending" }],
    };

    const state = taskReducer(existingState, { type: deleteTask.fulfilled.type, payload: "1" });

    expect(state.tasks.length).toBe(0);
  });
});
