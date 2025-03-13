import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/tasks";

// Define Task Type
interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
}

// Define Redux State Type
export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  totalTasks: number;
  currentPage: number;
  limit: number;

}

// Initial State
const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  totalTasks: 0,
  currentPage: 1,
  limit: 5, // Default items per page
};

// Async Thunks

// Fetch tasks thunk
export const fetchTasks = createAsyncThunk<
  { tasks: Task[]; total: number }, // Correct return type
  { page: number; limit: number },  // Correct argument type
  { rejectValue: string }           // Error type for rejection
>(
  "tasks/fetch",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get<{ tasks: Task[]; total: number }>(
        `${API_URL}?page=${page}&limit=${limit}`
      );
      return response.data; // ✅ Now TypeScript knows the expected structure
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // ✅ Safely extract error message from Axios
        return rejectWithValue(error.response?.data?.message ?? "Failed to fetch tasks");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Add task thunk
export const addTask = createAsyncThunk<Task, Omit<Task, "_id">>(
  "tasks/add",
  async (task, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, task);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // Extract and return meaningful error messages
        if (error.response?.status === 409) {
          return rejectWithValue("Task with this title already exists");
        }
        return rejectWithValue(error.response?.data?.message || "Failed to add task");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Update Task thunk
export const updateTask = createAsyncThunk<
  Task,
  { id: string; title: string; description: string; status: string }
>(
  "tasks/update",
  async ({ id, title, description, status }) => {
    const response = await axios.patch(`${API_URL}/${id}`, {
      title: title.trim(),
      description: description.trim(),
      status
    });

    return response.data;
  }
);

// Delete task thunk
export const deleteTask = createAsyncThunk<string, string>(
  "tasks/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // Extract error message safely from Axios
        return rejectWithValue(error.response?.data?.message || "Failed to delete task");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Redux Slice
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    // Add actions to change the current page
    setPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks with pagination
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.tasks;
        state.totalTasks = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add task
      .addCase(addTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.loading = false;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        state.loading = false;
        state.totalTasks -= 1; // Decrement the total task count
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPage } = taskSlice.actions;
export default taskSlice.reducer;
