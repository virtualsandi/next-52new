"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAuthToken } from "@/lib/auth";

interface Order {
  _id: string;
  orderCode: string;
  buyer: {
    name: string;
    email: string;
  };
  details: { quantity: number }[];
  total: number;
  status: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ---------------- FETCH ORDERS ----------------
  const fetchOrders = async (searchValue = "") => {
    try {
      setLoading(true);

      const token = getAuthToken();

      let url = `${process.env.NEXT_PUBLIC_API_URL}/order/admin/orders`;

      const params = new URLSearchParams();

      if (searchValue) params.append("search", searchValue);

      url += params.toString() ? `?${params.toString()}` : "";

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ---------------- FILTER ----------------
  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  // ---------------- STATUS COLOR ----------------
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "processing":
        return "#3b82f6";
      case "shipped":
        return "#8b5cf6";
      case "delivered":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div style={{ padding: 24, background: "#f6f7fb", minHeight: "100vh" }}>
      
      {/* ---------------- HEADER ---------------- */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Orders</h1>
        <p style={{ color: "#666" }}>Manage all customer orders</p>
      </div>

      {/* ---------------- FILTER BUTTONS ---------------- */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15, flexWrap: "wrap" }}>
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                border: "1px solid #ddd",
                background: filter === status ? "#111827" : "#fff",
                color: filter === status ? "#fff" : "#333",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* ---------------- SEARCH BAR ---------------- */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search order code or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: 6,
            width: 280,
          }}
        />

        <button
          onClick={() => fetchOrders(search)}
          style={{
            padding: "8px 12px",
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Search
        </button>

        <button
          onClick={() => {
            setSearch("");
            fetchOrders("");
          }}
          style={{
            padding: "8px 12px",
            background: "#e5e7eb",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      {/* ---------------- LOADING ---------------- */}
      {loading && <p style={{ padding: 10 }}>Loading orders...</p>}

      {/* ---------------- TABLE ---------------- */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
              <th>Order Code</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                <td style={{ padding: 10 }}>{order.orderCode}</td>
                <td>{order.buyer?.name}</td>
                <td>{order.buyer?.email}</td>
                <td>{order.details?.length}</td>
                <td>₹{order.total}</td>

                <td>
                  <span
                    style={{
                      background: getStatusColor(order.status),
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                    }}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  <Link
                    href={`/admin/orders/${order._id}`}
                    style={{
                      padding: "6px 10px",
                      background: "#111827",
                      color: "#fff",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}