"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { addTask } from "../store/taskSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">("pending");

  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Initializes the dispatch function from the Redux store.
   * The dispatch function is used to send actions to the Redux store.
   * 
   * @constant
   * @type {AppDispatch}
   */
  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error
    
    dispatch(addTask({ title, description, status }))
      .unwrap()
      .then(() => router.push("/")) // ✅ Redirect if successful
      .catch((error) => setErrorMessage(error)); // ✅ Show duplicate error message
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>} {/* Show error */}
      <div className="flex flex-row justify-between">
        <h1 className="text-xl font-bold mb-4">Add New Task</h1>
        <div className="p-1 gap-2 mb-4">
          <Link href="/" className="bg-gray-500 text-white px-4 py-2">Back</Link>
        </div>
      </div>
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
        {/* 🔹 Status Dropdown */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "pending" | "in-progress" | "completed")}
          className="w-full p-2 border bg-white"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 w-full" type="submit">
          Add Task
        </button>
      </form>
    </div>
  );
}
