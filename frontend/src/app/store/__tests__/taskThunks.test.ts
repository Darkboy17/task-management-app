import { fetchTasks, addTask, deleteTask } from "../taskSlice";
import configureMockStore from "redux-mock-store";
import thunk, { ThunkMiddleware } from "redux-thunk";
import axios from "axios";
import { AnyAction } from "redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface RootState {
  task: {
    tasks: Task[];
    status: string;
    error: string | null;
    loading: boolean;
  };
}

jest.mock("axios");
const mockStore = configureMockStore<RootState, AnyAction>([thunk as ThunkMiddleware<RootState, AnyAction>]);

describe("Task Thunks", () => {
  let store: ReturnType<typeof mockStore> & {
    dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
  };

  beforeEach(() => {
    store = mockStore({ task: { tasks: [], loading: false, error: null, status: "pending" } });
  });

  test("fetchTasks should dispatch fulfilled action", async () => {
    const mockTasks = [{ _id: "1", title: "Task 1", description: "Desc", status: "pending" }];
    (axios.get as jest.Mock).mockResolvedValue({ data: { tasks: mockTasks, total: 1 } });

    await store.dispatch(fetchTasks({ page: 1, limit: 5 }));

    const actions = store.getActions();

    expect(actions[0].type).toBe("tasks/fetch/pending");
    expect(actions[1].type).toBe("tasks/fetch/fulfilled");
    expect(actions[1].payload).toEqual({ tasks: mockTasks, total: 1 });
  });

  test("addTask should dispatch fulfilled action", async () => {
    const newTask = { _id: "2", title: "Task 2", description: "Desc", status: "pending" as "pending" | "in-progress" | "completed" };
    (axios.post as jest.Mock).mockResolvedValue({ data: newTask });

    await store.dispatch(addTask(newTask));
    const actions = store.getActions();

    expect(actions[1].type).toBe("tasks/add/fulfilled");
    expect(actions[1].payload).toEqual(newTask);
  });

  test("deleteTask should dispatch fulfilled action", async () => {
    (axios.delete as jest.Mock).mockResolvedValue({});

    await store.dispatch(deleteTask("1"));
    const actions = store.getActions();

    expect(actions[1].type).toBe("tasks/delete/fulfilled");
    expect(actions[1].payload).toBe("1");
  });
});
