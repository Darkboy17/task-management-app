"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { updateTask, fetchTasks } from "../../store/taskSlice";
import { RootState, AppDispatch } from "../../store/store";

export default function EditTask() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.task);

  // Find the task based on the id
  const task = tasks.find((t) => t._id === id);

  // Local state for the task fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">("pending");

  useEffect(() => {
    // If tasks are empty, fetch them
    if (!task) {
      dispatch(fetchTasks({ page: 1, limit: 1 }))
    } else {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    }
  }, [task, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(updateTask({
      id,
      title: title.trim(),
      description: description.trim(),
      status
    }));

    router.push("/");
  };


  // Prevent rendering if the task is not yet loaded
  if (!task) {
    return <p className="text-center text-blue-500">Loading task...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit Task</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "pending" | "in-progress" | "completed")}
          className="w-full p-2 border bg-white"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button className="bg-green-500 text-white px-4 py-2 w-full" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}
