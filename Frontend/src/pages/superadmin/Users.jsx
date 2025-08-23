import React, { useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Trading Master",
      email: "trader@game.com",
      contests: 15,
      winRate: "68%",
      status: "active",
    },
    {
      id: 2,
      name: "Crypto King",
      email: "crypto@game.com",
      contests: 23,
      winRate: "72%",
      status: "active",
    },
    {
      id: 3,
      name: "Stock Guru",
      email: "stocks@game.com",
      contests: 8,
      winRate: "45%",
      status: "pending",
    },
    {
      id: 4,
      name: "Portfolio Pro",
      email: "portfolio@game.com",
      contests: 31,
      winRate: "81%",
      status: "vip",
    },
  ]);

  const [editingUser, setEditingUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "active",
  });

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsAddMode(false);
    setFormData({ name: user.name, email: user.email, status: user.status });
    setIsEditOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsAddMode(true);
    setFormData({ name: "", email: "", status: "active" });
    setIsEditOpen(true);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
    alert("User deleted successfully!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAddMode) {
      const newUser = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        name: formData.name,
        email: formData.email,
        status: formData.status,
        contests: 0,
        winRate: "0%",
      };
      setUsers([...users, newUser]);
      alert("User added successfully!");
    } else {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
      alert("User updated successfully!");
    }
    setIsEditOpen(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "text-green-500",
      pending: "text-orange-500",
      vip: "text-purple-500",
    };
    return colors[status] || "text-gray-500";
  };

  return (
    <div className="p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-500">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={handleAddUser}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </div>

      {/* User Cards */}
      <div className="flex flex-wrap gap-5 mt-6">
        {users.map((user) => (
          <div key={user.id} className="border rounded-lg p-4 w-64 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <strong className="text-lg">{user.name}</strong>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              <span className={getStatusColor(user.status)}>
                {user.status.toUpperCase()}
              </span>
            </div>
            <div className="mt-3 text-sm">
              <div>Contests: {user.contests}</div>
              <div>Win Rate: {user.winRate}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleEditUser(user)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-xl font-semibold">
              {isAddMode ? "Add New User" : "Edit User"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="vip">VIP</option>
              </select>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-3 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isAddMode ? "Add User" : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
