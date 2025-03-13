"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "../../store/taskSlice";
import { RootState, AppDispatch } from "../../store/store";
import Link from "next/link";

export default function TaskDetails() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.task);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Find the selected task
  const task = tasks.find((t) => t._id === id);

  useEffect(() => {
    if (!task) {
      dispatch(fetchTasks({ page: 1, limit: 1 })).finally(() => setIsFirstLoad(false));
    } else {
      setIsFirstLoad(false);
    }
  }, [task, dispatch]);

  if (isFirstLoad || loading) {
    return <p className="text-center text-blue-500">Loading task details...</p>;
  }

  if (!task) {
    return <p className="text-center text-red-500">Task not found</p>;
  }

  // Status color mapping
  const statusColors: Record<string, string> = {
    pending: "text-yellow-500 bg-yellow-100 border-yellow-400",
    "in-progress": "text-blue-500 bg-blue-100 border-blue-400",
    completed: "text-green-500 bg-green-100 border-green-400",
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task Details</h1>
        <Link href="/" className="bg-gray-500 text-white px-4 py-2 rounded-lg">
          Back
        </Link>
      </div>

      {/* Task Info */}
      <div className="border p-6 rounded-lg shadow-sm bg-gray-50">
        {/* Task Title */}
        <h2 className="text-xl font-semibold text-blue-600">{task.title}</h2>

        {/* Task Description */}
        <p className="text-gray-700 mt-3">{task.description}</p>

        {/* Task Status */}
        <div className={`mt-4 px-3 py-1 border rounded-lg text-sm font-semibold ${statusColors[task.status]} inline-block`}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <Link href={`/edit/${task._id}`}>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
            Edit Task
          </button>
        </Link>
      </div>
    </div>
  );
}
