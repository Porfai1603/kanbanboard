import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ currentUser, handleLogout }) {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [editBoardId, setEditBoardId] = useState(null);
  const [editBoardName, setEditBoardName] = useState("");
  const [pinnedBoards, setPinnedBoards] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  // โหลดบอร์ดของผู้ใช้ปัจจุบัน
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
    const userBoards = savedBoards.filter(board =>
      board.members?.includes(currentUser.email)
    );
    setBoards(userBoards);
  }, [currentUser, navigate]);

  // ฟังก์ชัน saveBoard ที่ลิงก์กับ currentUser
  const saveBoards = (updatedBoards) => {
    localStorage.setItem("boards", JSON.stringify(updatedBoards));

    const userBoards = updatedBoards.filter(board =>
      board.members?.includes(currentUser.email)
    );
    setBoards(userBoards);
  };

  // สร้างบอร์ดใหม่
  const handleAddBoard = () => {
    if (!newBoardName.trim()) return;
    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];

    const newBoard = {
      id: Date.now(),
      name: newBoardName,
      owner: currentUser.email,
      creator: currentUser.name,
      creatorAvatar: currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`,
      createdAt: new Date().toLocaleString(),
      members: [currentUser.email], // เพิ่ม email ของผู้ใช้ที่ล็อกอิน
      columns: [],
    };

    saveBoards([...savedBoards, newBoard]);
    setNewBoardName("");
  };

  // ลบบอร์ด
  const handleDeleteBoard = (id) => {
    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
    const updatedBoards = savedBoards.filter((board) => board.id !== id);
    saveBoards(updatedBoards);
    setPinnedBoards((prev) => prev.filter((b) => b !== id));
  };

  // แก้ไขชื่อบอร์ด
  const handleEditBoard = (id) => {
    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
    const updatedBoards = savedBoards.map((board) =>
      board.id === id ? { ...board, name: editBoardName } : board
    );
    saveBoards(updatedBoards);
    setEditBoardId(null);
    setEditBoardName("");
  };

  // ปักหมุดบอร์ด
  const togglePinBoard = (id) => {
    setPinnedBoards((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [id, ...prev]
    );
  };

  // จัดเรียงบอร์ดที่ปักหมุด
  const sortedBoards = boards.sort((a, b) => {
    const aPinned = pinnedBoards.includes(a.id);
    const bPinned = pinnedBoards.includes(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-purple-900 drop-shadow-md">
          Kanban Board
        </h1>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="bg-white text-gray-700 px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      {/* Modal Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              ยืนยันการออกจากระบบ?
            </h2>
            <p className="text-l text-gray-600 mb-6">
              กดปุ่มยืนยันเพื่อทำการออกจากระบบ
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 text-gray-800 px-5 py-2 rounded-full font-semibold hover:bg-gray-400 transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="bg-red-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-600 transition"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* สร้าง Board ใหม่ */}
      <div className="flex mb-10 p-6 bg-white rounded-3xl shadow-xl border border-purple-200">
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="Enter a new board name"
          className="border border-purple-300 p-3 rounded-l-full flex-grow text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
        />
        <button
          onClick={handleAddBoard}
          className="bg-purple-700 text-white px-6 py-3 rounded-r-full font-bold shadow-md hover:bg-pink-500 transition transform hover:scale-105"
        >
          + Add Board
        </button>
      </div>

      {/* แสดงรายการบอร์ด */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedBoards.map((board) => (
          <div
            key={board.id}
            onClick={(e) => {
              if (
                e.target.tagName !== "BUTTON" &&
                e.target.tagName !== "INPUT" &&
                e.target.tagName !== "TEXTAREA" &&
                !e.target.closest("button")
              ) {
                navigate(`/board/${board.id}`);
              }
            }}
            className="relative bg-white border border-gray-300 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 p-8 cursor-pointer group"
          >
            <span className="absolute top-4 left-4 text-xs text-gray-500 font-medium">
              🕒 {board.createdAt}
            </span>

            <div className="absolute top-4 right-4">
              <img
                src={board.creatorAvatar || `https://ui-avatars.com/api/?name=${board.creator}&background=random`}
                alt={board.creator}
                title={`Creator: ${board.creator}`}
                className="w-10 h-10 rounded-full border-2 border-pink-400 shadow-md"
              />
            </div>

            {editBoardId === board.id ? (
              <div className="mt-8 mb-4">
                <input
                  type="text"
                  value={editBoardName}
                  onChange={(e) => setEditBoardName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="border-b-2 border-purple-500 focus:outline-none focus:ring-0 p-2 rounded w-full text-xl font-bold"
                />
                <div className="flex gap-2 mt-4 justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBoard(board.id);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditBoardId(null);
                      setEditBoardName("");
                    }}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-800">
                {board.name}
              </h2>
            )}

            <div className="flex justify-between items-center mt-6">
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditBoardId(board.id);
                    setEditBoardName(board.name);
                  }}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition"
                >
                  📝 Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBoard(board.id);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-600 transition"
                >
                  🗑️ Delete
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePinBoard(board.id);
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md transition transform hover:scale-110 ${
                  pinnedBoards.includes(board.id)
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                📌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
