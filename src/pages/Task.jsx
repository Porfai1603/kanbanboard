import { useState } from "react";

export default function Task({
  task,
  column,
  board,
  saveBoard,
  handleDeleteTask,
  handleEditTask,
  handleAssignUser,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editInputs, setEditInputs] = useState({
    title: task.title,
    description: task.description,
    emoji: task.emoji || "",
  });

  const [pendingAssignee, setPendingAssignee] = useState(task.assignedUser || "");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [showImageDrop, setShowImageDrop] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // ------------------- Save Edit -------------------
  const handleSaveEdit = () => {
    handleEditTask(task.id, editInputs.title, editInputs.description, editInputs.emoji);
    setIsEditing(false);
  };

  // ------------------- Drag Start -------------------
  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      "task",
      JSON.stringify({ ...task, sourceColumnId: column.id })
    );
  };

  // ------------------- Confirm Assign -------------------
  const confirmAssign = () => {
    handleAssignUser(task.id, pendingAssignee);
    setShowConfirm(false);
  };

  // ------------------- Add Link -------------------
  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    const updatedBoard = {
      ...board,
      columns: board.columns.map(c => ({
        ...c,
        tasks: c.tasks.map(t =>
          t.id === task.id ? { ...t, links: [...(t.links || []), linkInput] } : t
        ),
      })),
    };
    saveBoard(updatedBoard);
    setLinkInput("");
    setShowLinkModal(false);
  };

  // ------------------- Add Image -------------------
  const handleAddImage = (url) => {
    if (!url) return;
    const updatedBoard = {
      ...board,
      columns: board.columns.map(c => ({
        ...c,
        tasks: c.tasks.map(t =>
          t.id === task.id ? { ...t, images: [...(t.images || []), url] } : t
        ),
      })),
    };
    saveBoard(updatedBoard);
  };

  const handleDropImage = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handleAddImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition relative"
    >
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editInputs.title}
            onChange={(e) => setEditInputs({ ...editInputs, title: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <textarea
            value={editInputs.description}
            onChange={(e) => setEditInputs({ ...editInputs, description: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSaveEdit}
              className="bg-green-500 text-white px-3 py-1 rounded-full text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 px-3 py-1 rounded-full text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-bold text-purple-900 text-lg">{task.title}</h3>
          <p className="text-gray-600 text-sm whitespace-pre-line">{task.description}</p>

          {/* Assignee Section */}
          <div className="mt-3">
            <label className="block text-xs text-gray-500 mb-1">Assignee:</label>
            <select
              value={pendingAssignee || ""}
              onChange={(e) => {
                setPendingAssignee(e.target.value);
                setShowConfirm(true);
              }}
              className="w-full border p-1 rounded text-sm"
            >
              <option value="">Unassigned</option>
              {board?.members?.map((member) => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
          </div>

          {/* Confirm Box */}
          {showConfirm && (
            <div className="mt-3 bg-gray-100 p-3 rounded-lg border border-gray-300">
              <p className="text-sm text-gray-700 mb-2">
                Assign task <strong>{task.title}</strong> to{" "}
                <span className="text-purple-700">{pendingAssignee || "nobody"}</span>?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={confirmAssign}
                  className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setPendingAssignee(task.assignedUser || "");
                    setShowConfirm(false);
                  }}
                  className="bg-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-yellow-500"
            >
              📝
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-gray-500 hover:text-red-500"
            >
              🗑️
            </button>
            <button
              onClick={() => setShowLinkModal(true)}
              className="text-gray-500 hover:text-blue-500"
            >
              🔗
            </button>
            <button
              onClick={() => setShowImageDrop((prev) => !prev)}
              className="text-gray-500 hover:text-green-500"
            >
              🖼️
            </button>
          </div>

          {/* Link Modal */}
          {showLinkModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h3 className="font-bold mb-2">Add Link</h3>
                <input
                  type="text"
                  placeholder="Enter link URL"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={handleAddLink} className="bg-purple-700 text-white px-5 py-1 rounded-full">Add</button>
                  <button onClick={() => { setLinkInput(""); setShowLinkModal(false); }} className="bg-gray-300 px-3 py-1 rounded-full">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Image Drop Zone */}
          {showImageDrop && (
            <div
              className={`mt-2 p-4 border-2 border-dashed border-purple-500 text-center rounded-full cursor-pointer ${dragOver ? "border-4 border-pink-500" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDropImage}
            >
              {dragOver ? "Release to upload image" : "Drag & Drop image here"}
            </div>
          )}

          {/* Display Links */}
          {task.links && task.links.length > 0 && (
            <div className="mt-2">
              {task.links.map((link, idx) => (
                <a key={idx} href={link} target="_blank" rel="noreferrer" className="text-blue-500 text-sm block">
                  🔗 {link}
                </a>
              ))}
            </div>
          )}

          {/* Display Images */}
          {task.images && task.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {task.images.map((img, idx) => (
                <img key={idx} src={img} alt={`task-img-${idx}`} className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
