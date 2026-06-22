"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUsers(data.data);
  };
const deleteUser = async (id: string) => {
  const token = localStorage.getItem("token");

  const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (res.ok) {
    toast.success("User deleted successfully");
    setUsers((prev) => prev.filter((u) => u._id !== id));
  } else {
    toast.error(data.message || "Failed to delete user");
  }
};

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "admin":
        return { background: "#fee2e2", color: "#b91c1c" };
      case "seller":
        return { background: "#dbeafe", color: "#1d4ed8" };
      default:
        return { background: "#dcfce7", color: "#166534" };
    }
  };

  return (
    <div style={{ padding: "20px", background: "#f6f7fb", minHeight: "100vh" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Users</h1>
        <p style={{ color: "#666" }}>Manage all customers, sellers, and admins</p>
      </div>

      {/* Table Card */}
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
      }}>
        
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Action</th>
                
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  style={{
                    borderBottom: "1px solid #f1f1f1",
                    transition: "0.2s",
                  }}
                >
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>{user.phone || "-"}</td>
                  <td style={tdStyle}>{user.address || "-"}</td>

                  {/* Role Badge */}
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        ...getRoleStyle(user.role),
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
               

{/* Action */}
<td style={tdStyle}>
  <button
    onClick={() => deleteUser(user._id)}
    style={{
      background: "#ef4444",
      color: "white",
      border: "none",
      padding: "6px 10px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "12px",
    }}
  >
    Delete
  </button>
</td>
 </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

/* Styles */
const thStyle = {
  padding: "12px",
  fontSize: "13px",
  color: "#555",
  fontWeight: 600,
};

const tdStyle = {
  padding: "12px",
  fontSize: "14px",
};