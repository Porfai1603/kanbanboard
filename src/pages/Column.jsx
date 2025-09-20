import { useState } from "react";
import Task from "./Task";

export default function Column({
  column,
  board,
  saveBoard,
  user,
  handleMoveTask,
  addNotification,
}) {
  const [newTaskInputs, setNewTaskInputs] = useState({
    title: "",
    desc: "",
    assignedUser: "",
  });

  const [editColumnId, setEditColumnId] = useState(null);
  const [editColumnName, setEditColumnName] = useState(column.name);

  // ------------------- Add Task -------------------
  const handleAddTask = () => {
    if (!newTaskInputs.title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTaskInputs.title,
      description: newTaskInputs.desc,
      assignedUser: newTaskInputs.assignedUser || null, // ✅ assign หรือไม่ assign ก็ได้
      tags: [],
      links: [],
      images: [],
      emoji: "",
      creator: user.name,
      creatorAvatar:
        user.avatar ||
        `https://ui-avatars.com/api/?name=${user.name}&background=random`,
    };

    const updatedBoard = {
      ...board,
      columns: board.columns.map((c) =>
        c.id === column.id ? { ...c, tasks: [...c.tasks, newTask] } : c
      ),
    };

    saveBoard(updatedBoard);
    setNewTaskInputs({ title: "", desc: "", assignedUser: "" });

    if (newTask.assignedUser) {
      addNotification(
        `Task "${newTask.title}" assigned to ${newTask.assignedUser}`
      );
    }
  };

  // ------------------- Assign / Change Assignee -------------------
  const handleAssignUser = (taskId, userEmail) => {
    const updatedBoard = {
      ...board,
      columns: board.columns.map((c) =>
        c.id === column.id
          ? {
              ...c,
              tasks: c.tasks.map((t) =>
                t.id === taskId ? { ...t, assignedUser: userEmail } : t
              ),
            }
          : c
      ),
    };
    saveBoard(updatedBoard);

    if (userEmail) {
      addNotification(`Task assigned to ${userEmail}`);
    } else {
      addNotification(`Task unassigned`);
    }
  };

  // ------------------- Edit Column -------------------
  const handleEditColumn = () => {
    if (!editColumnName.trim()) return;
    const updatedBoard = {
      ...board,
      columns: board.columns.map((c) =>
        c.id === column.id ? { ...c, name: editColumnName } : c
      ),
    };
    saveBoard(updatedBoard);
    setEditColumnId(null);
    setEditColumnName("");
  };

  // ------------------- Delete Column -------------------
  const handleDeleteColumn = () => {
    const updatedBoard = {
      ...board,
      columns: board.columns.filter((c) => c.id !== column.id),
    };
    saveBoard(updatedBoard);
  };

  // ------------------- Task Management -------------------
  const handleDeleteTask = (taskId) => {
    const updatedBoard = {
      ...board,
      columns: board.columns.map((c) =>
        c.id === column.id
          ? { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) }
          : c
      ),
    };
    saveBoard(updatedBoard);
  };

  const handleEditTask = (taskId, newTitle, newDesc, newEmoji) => {
    const updatedBoard = {
      ...board,
      columns: board.columns.map((c) =>
        c.id === column.id
          ? {
              ...c,
              tasks: c.tasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      title: newTitle,
                      description: newDesc,
                      emoji: newEmoji,
                    }
                  : t
              ),
            }
          : c
      ),
    };
    saveBoard(updatedBoard);
  };

  // ------------------- Drag & Drop Task -------------------
  const handleDrop = (e) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData("task");
    if (!taskData) return;
    const task = JSON.parse(taskData);
    handleMoveTask(task, task.sourceColumnId, column.id);
  };

  if (!board) return null;

  return (
    <div
      className="bg-gray-50 p-6 rounded-3xl shadow-lg min-w-[300px] flex-shrink-0"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      {editColumnId === column.id ? (
        <div className="mb-4">
          <input
            type="text"
            value={editColumnName}
            onChange={(e) => setEditColumnName(e.target.value)}
            className="w-full border-b-2 border-purple-500 focus:outline-none p-2 rounded"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEditColumn}
              className="bg-green-500 text-white px-4 py-1 rounded-full text-sm hover:bg-green-600 transition"
            >
              Save
            </button>
            <button
              onClick={() => setEditColumnId(null)}
              className="bg-gray-300 text-gray-800 px-4 py-1 rounded-full text-sm hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg text-purple-800">
            {column.name}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditColumnId(column.id);
                setEditColumnName(column.name);
              }}
              className="text-gray-500 hover:text-yellow-500 transition-colors"
            >
              📝
            </button>
            <button
              onClick={handleDeleteColumn}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              🗑️
            </button>
          </div>
        </div>
      )}

      {/* Tasks */}
      <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
        {column.tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            column={column}
            board={board}
            saveBoard={saveBoard}
            handleDeleteTask={handleDeleteTask}
            handleEditTask={handleEditTask}
            handleAssignUser={handleAssignUser}
          />
        ))}
      </div>

      {/* Add Task */}
      <div className="mt-4 bg-gray-100 p-4 rounded-xl space-y-2 shadow-inner">
        <input
          type="text"
          placeholder="Task title"
          value={newTaskInputs.title}
          onChange={(e) =>
            setNewTaskInputs({ ...newTaskInputs, title: e.target.value })
          }
          className="w-full border-b border-gray-300 p-2 rounded bg-transparent focus:outline-none focus:border-purple-500"
        />
        <textarea
          placeholder="Task description"
          value={newTaskInputs.desc}
          onChange={(e) =>
            setNewTaskInputs({ ...newTaskInputs, desc: e.target.value })
          }
          className="w-full border border-gray-300 p-2 rounded bg-transparent resize-y min-h-[50px] focus:outline-none focus:border-purple-500"
          rows="3"
        />

        <select
          value={newTaskInputs.assignedUser}
          onChange={(e) =>
            setNewTaskInputs({
              ...newTaskInputs,
              assignedUser: e.target.value,
            })
          }
          className="w-full border p-2 rounded focus:outline-none focus:border-purple-500"
        >
          <option value="">Assign to member (optional)</option>
          {board.members.map((member) => (
            <option key={member} value={member}>
              {member}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddTask}
          className="bg-purple-700 text-white px-4 py-2 rounded-full font-semibold w-full hover:bg-pink-500 transition-colors"
        >
          + Add Task
        </button>
      </div>
    </div>
  );
}
