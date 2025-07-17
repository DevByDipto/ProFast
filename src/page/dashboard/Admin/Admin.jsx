import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import axios from "axios";

const Admin = () => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const axiosSecure = useAxiosSecure()

  // 🔍 Search Handler
  const handleSearch = async () => {
    setHasSearched(true);
    if (!searchText.trim()) return setUsers([]);

    try {
      const res = await axiosSecure.get(`/userss?search=${searchText}`);
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error searching users:", err);
      setUsers([]);
    }
  };

  // 🛠 Role Update Handler
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await axiosSecure.patch(`/users/role/${userId}`, { role: newRole });
      if (res.data.modifiedCount > 0) {
        const updated = users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        );
        setUsers(updated);
      }
    } catch (err) {
      console.error("Role update failed", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center">🔧 Admin Panel: Manage User Roles</h2>

      {/* 🔍 Search Bar */}
      <div className="flex gap-2 w-full">
        <input
          type="text"
          placeholder="Enter user name"
          className="flex-1 border border-gray-300 rounded px-4 py-2"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* 📊 Table Results */}
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 rounded">
            <thead className="">
              <tr>
                <th className="px-4 py-2 border-b text-left">👤 Name</th>
                <th className="px-4 py-2 border-b text-left">📧 Email</th>
                <th className="px-4 py-2 border-b text-left">🛡️ Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="">
                  <td className="px-4 py-2 border-b">{user.name}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded"
                    >
                      <option value="user">User</option>
                      <option value="rider">Rider</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        hasSearched && (
          <p className="text-center text-red-500 font-medium">🚫 No users found for: "{searchText}"</p>
        )
      )}
    </div>
  );
};

export default Admin;
