"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, deleteTask, setPage } from "../store/taskSlice";
import { RootState, AppDispatch } from "../store/store";
import Link from "next/link";


export default function TaskList() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, error, loading, totalTasks, currentPage, limit } = useSelector((state: RootState) => state.task);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks({ page: currentPage, limit })).finally(() => setDataFetched(true));
  }, [dispatch, currentPage, limit]);


  const totalPages = totalTasks > 0 ? Math.ceil(totalTasks / limit) : 1;

  // Apply frontend filtering
  const filteredTasks = tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedStatus === "" || task.status === selectedStatus)
    );
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      {/* Add Task Button */}
      <Link href="/add" className="flex justify-end">
        <button className="bg-blue-500 text-white px-4 py-2 mb-4 rounded-lg">Add Task</button>
      </Link>

      {/* Search and Filter Controls */}
      <div className="flex gap-2 mb-4 shadow-md rounded-b-lg p-3">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-lg w-full"
        />

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
          <span className="p-1 text-gray-500">Fetching...</span>
        </div>
      ) : error ? (
        // Show error message if API request fails
        <div className="text-center text-red-500 font-semibold p-4">
          <p>Failed to load tasks: {error}</p>
        </div>
      ) : (
        <>
          {/* Show "No tasks added yet..." only AFTER data has loaded */}
          {dataFetched && tasks.length === 0 && searchTerm === "" && selectedStatus === "" && totalTasks === 0 && (
            <p>No tasks added yet...</p>
          )}

          {/* Show "No matching tasks found." when searching and no results */}
          {dataFetched && tasks.length > 0 && filteredTasks.length === 0 && (
            <p className="text-gray-500">No matching tasks found.</p>
          )}

          {filteredTasks.length !== 0 && (
            <div className="p-3 overflow-y-auto shadow-md scrollbar-hidden" style={{ maxHeight: "80vh" }}>
              <ul>
                {filteredTasks.map((task) => (
                  <li key={task._id} className="p-3 border rounded-lg flex justify-between items-center mb-2">
                    <div>
                      <Link href={`/details/${task._id}`} className="hover:underline text-blue-500">
                        <h2 className="font-semibold">{task.title}</h2>
                      </Link>
                      <span className="text-sm text-gray-600">{task.status}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/edit/${task._id}`}>
                        <button className="bg-yellow-500 text-white px-2 py-1 rounded-lg">Edit</button>
                      </Link>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-lg"
                        onClick={() => {
                          dispatch(deleteTask(task._id))
                            .unwrap()
                            .then(() => {
                              // If the current page becomes empty after deletion, fetch the previous page
                              if (tasks.length === 1 && currentPage > 1) {
                                dispatch(setPage(currentPage - 1));
                              } else {
                                dispatch(fetchTasks({ page: currentPage, limit }));
                              }
                            })
                            .catch((error) => {
                              console.error("Failed to delete task:", error);
                            });
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination Controls */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="bg-gray-500 text-white px-3 py-1 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => dispatch(setPage(currentPage - 1))}
                >
                  Previous
                </button>
                <span className="text-lg">{currentPage} / {totalPages}</span>
                <button
                  className="bg-gray-500 text-white px-3 py-1 disabled:opacity-50"
                  disabled={currentPage >= totalPages}
                  onClick={() => dispatch(setPage(currentPage + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>

  );
}
