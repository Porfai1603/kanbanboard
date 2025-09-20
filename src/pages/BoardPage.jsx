import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Column from "./Column";

export default function BoardPage({ currentUser }) {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  // สำหรับเชิญสมาชิก
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");

  // Notification state
  const [notifications, setNotifications] = useState([]);

  // ------------------ Load Board & Users ------------------
  useEffect(() => {
    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
    const foundBoard = savedBoards.find((b) => b.id === parseInt(boardId));
    setBoard(
      foundBoard || { id: Date.now(), name: "New Board", columns: [], members: [] }
    );

    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setAllUsers(savedUsers);
  }, [boardId]);

  // ------------------ Save Board ------------------
  const saveBoard = (updatedBoard) => {
    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
    const updatedBoards = savedBoards.map((b) =>
      b.id === updatedBoard.id ? updatedBoard : b
    );
    localStorage.setItem("boards", JSON.stringify(updatedBoards));
    setBoard(updatedBoard);
  };

  // ------------------ Notifications ------------------
  const addNotification = (message) => {
    const newNotif = { id: Date.now(), message };
    setNotifications((prev) => [newNotif, ...prev]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
    }, 5000);
  };

  // ------------------ Add Column ------------------
  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    const newColumn = { id: Date.now(), name: newColumnName, tasks: [] };
    saveBoard({ ...board, columns: [...board.columns, newColumn] });
    setNewColumnName("");
    setAddingColumn(false);
  };

  // ------------------ Move Task ------------------
  const handleMoveTask = (task, sourceColumnId, targetColumnId) => {
    const updatedBoard = {
      ...board,
      columns: board.columns.map((c) => {
        if (c.id === sourceColumnId)
          return { ...c, tasks: c.tasks.filter((t) => t.id !== task.id) };
        if (c.id === targetColumnId) return { ...c, tasks: [...c.tasks, task] };
        return c;
      }),
    };
    saveBoard(updatedBoard);
  };

  // ------------------ Add Task (with Assignee notification) ------------------
  const handleAddTask = (columnId, taskName, assignedUser) => {
    if (!taskName.trim() || !assignedUser) return;
    const newTask = {
      id: Date.now(),
      title: taskName,
      assignedUser,
      createdBy: currentUser.email,
      createdAt: new Date().toLocaleString(),
    };
    const updatedBoard = {
      ...board,
      columns: board.columns.map((c) =>
        c.id === columnId ? { ...c, tasks: [...c.tasks, newTask] } : c
      ),
    };
    saveBoard(updatedBoard);

    const user = allUsers.find((u) => u.email === assignedUser);
    addNotification(`Task "${taskName}" assigned to ${user ? user.name : assignedUser}`);
  };

  // ------------------ Invite Member ------------------
  const handleInviteMember = () => {
    if (!selectedMember || board.members.includes(selectedMember)) return;

    const updatedBoard = {
      ...board,
      members: [...board.members, selectedMember],
    };
    saveBoard(updatedBoard);
    setSelectedMember("");
  };

  // ------------------ Remove Member ------------------
  const handleRemoveMember = (memberEmail) => {
    const updatedBoard = {
      ...board,
      members: board.members.filter((m) => m !== memberEmail),
    };
    saveBoard(updatedBoard);
    addNotification(`Removed member: ${memberEmail}`);
  };

  if (!board) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-purple-700 text-3xl hover:text-pink-500 transition-colors mr-4"
        >
          ⮜
        </button>
        <h1 className="text-4xl font-extrabold text-purple-900 drop-shadow-md">{board.name}</h1>
      </div>

      {/* Invite Members */}
      <div className="mb-6 p-4 bg-white rounded-3xl shadow-lg border border-gray-300">
        <div className="flex items-center gap-2 mb-2">
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="border p-2 rounded flex-grow focus:outline-none"
          >
            <option value="">Select user to invite</option>
            {allUsers
              .filter((u) => !board.members.includes(u.email))
              .map((user) => (
                <option key={user.email} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
          </select>
          <button
            onClick={handleInviteMember}
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-pink-500 transition"
          >
            Invite
          </button>
        </div>

        {/* แสดงรายชื่อสมาชิกที่เชิญไปแล้ว */}
        <div className="flex flex-wrap gap-2 mt-2">
          {(board.members || []).map((memberEmail) => {
            const member = allUsers.find((u) => u.email === memberEmail);
            if (!member) return null;
            return (
              <div
                key={member.email}
                className="flex items-center gap-2 bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
              >
                <img
                  src={
                    member.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`
                  }
                  alt={member.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold">{member.name}</span>
                  <span className="text-xs text-purple-900">{member.email}</span>
                </div>
                {/* ปุ่มลบ */}
                <button
                  onClick={() => handleRemoveMember(member.email)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="bg-purple-700 text-white px-4 py-2 rounded shadow"
          >
            {n.message}
          </div>
        ))}
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {board.columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            board={board}
            saveBoard={saveBoard}
            user={currentUser}
            handleMoveTask={handleMoveTask}
            handleAddTask={handleAddTask}
            allUsers={allUsers.filter((u) => board.members.includes(u.email))}
          />
        ))}

        {/* Add Column */}
        {addingColumn ? (
          <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-dashed border-gray-300 flex flex-col gap-2">
            <input
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Column name..."
              className="border-b border-gray-300 p-2 rounded focus:outline-none focus:border-purple-500"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleAddColumn}
                className="bg-purple-700 text-white px-4 py-1 rounded-full hover:bg-pink-500 transition"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setAddingColumn(false);
                  setNewColumnName("");
                }}
                className="bg-gray-300 px-4 py-1 rounded-full hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setAddingColumn(true)}
            className="bg-white p-6 rounded-3xl shadow-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-pink-400 transition-colors"
          >
            <span className="text-gray-400 font-bold text-2xl">+ Add Column</span>
          </div>
        )}
      </div>
    </div>
  );
}
