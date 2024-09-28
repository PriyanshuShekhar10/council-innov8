import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import styles from "./Users.module.css"; // Import the CSS module

export default function Users() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchAdmins();
    fetchUsers();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/admin/admins`,
        { withCredentials: true }
      );
      if (response.data.ok) {
        setAdmins(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/admin/users`,
        { withCredentials: true }
      );
      if (response.data.ok) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    const url = isEditingAdmin
      ? `${import.meta.env.VITE_API}/admin/admins/${selectedAdmin._id}`
      : `${import.meta.env.VITE_API}/admin/register`;
    const method = isEditingAdmin ? "put" : "post";
    const response = await axios[method](url, formData, {
      withCredentials: true,
    });
    if (response.data.ok) {
      alert(
        isEditingAdmin
          ? "Admin updated successfully!"
          : "Admin registered successfully!"
      );
      fetchAdmins();
      setFormData({ name: "", email: "", password: "" });
      setIsEditingAdmin(false);
    }
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setFormData({ name: admin.name, email: admin.email, password: "" });
    setIsEditingAdmin(true);
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      const response = await axios.delete(
        `${import.meta.env.VITE_API}/admin/admins/${adminId}`,
        { withCredentials: true }
      );
      if (response.data.ok) {
        alert("Admin deleted successfully!");
        fetchAdmins();
      }
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email });
    setIsEditingUser(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_API}/admin/users/${selectedUser._id}`;
    const response = await axios.put(url, formData, { withCredentials: true });
    if (response.data.ok) {
      alert("User updated successfully!");
      fetchUsers();
      setFormData({ name: "", email: "" });
      setIsEditingUser(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const response = await axios.delete(
        `${import.meta.env.VITE_API}/admin/users/${userId}`,
        { withCredentials: true }
      );
      if (response.data.ok) {
        alert("User deleted successfully!");
        fetchUsers();
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.formSection}>
          <h2>{isEditingAdmin ? "Edit Admin" : "Create Admin"}</h2>
          <form onSubmit={handleAdminSubmit} className={styles.userForm}>
            <div className={styles.formField}>
              <label className={styles.label}>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            {!isEditingAdmin && (
              <div className={styles.formField}>
                <label className={styles.label}>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
            )}
            <div className={styles.formButtons}>
              <button type="submit" className={styles.button}>
                {isEditingAdmin ? "Update Admin" : "Create Admin"}
              </button>
            </div>
          </form>
        </div>
        <div className={styles.listSection}>
          <h2>Admin List</h2>
          {admins.length > 0 ? (
            <ul className={styles.userList}>
              {admins.map((admin) => (
                <li key={admin._id} className={styles.userItem}>
                  {admin.name} ({admin.email})
                  <div className={styles.actionButtons}>
                    <button onClick={() => handleEditAdmin(admin)}>Edit</button>
                    <button onClick={() => handleDeleteAdmin(admin._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No admins available.</p>
          )}
          <h2>User List</h2>
          {users.length > 0 ? (
            <ul className={styles.userList}>
              {users.map((user) => (
                <li key={user._id} className={styles.userItem}>
                  {user.name} ({user.email})
                  <div className={styles.actionButtons}>
                    <button onClick={() => handleEditUser(user)}>Edit</button>
                    <button onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users available.</p>
          )}
        </div>
        {isEditingUser && (
          <div className={styles.formSection}>
            <h2>Edit User</h2>
            <form onSubmit={handleUserSubmit} className={styles.userForm}>
              <div className={styles.formField}>
                <label className={styles.label}>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formButtons}>
                <button type="submit" className={styles.button}>
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingUser(false);
                    setFormData({ name: "", email: "" });
                  }}
                  className={styles.button}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
