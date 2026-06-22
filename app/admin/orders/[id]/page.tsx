"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAuthToken } from "@/lib/auth";

interface Order {
  _id: string;
  orderCode: string;
  status: string;
  total: number;
  buyer: {
    name: string;
    email: string;
    phone?: string;
  };
  details: {
    product: {
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }[];
}

export default function OrderDetailsPage() {
  const { id } = useParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH ORDER ----------------
  const fetchOrder = async () => {
    try {
      const token = getAuthToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/admin/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOrder(data.data);
        setStatus(data.data.status);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  // ---------------- UPDATE STATUS ----------------
  const updateStatus = async () => {
    try {
      const token = getAuthToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/admin/orders/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOrder(data.data);
        alert("Order status updated");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading order...</p>;
  }

  if (!order) {
    return <p style={{ padding: 20 }}>Order not found</p>;
  }

  return (
    <div style={{ padding: 24, background: "#f6f7fb", minHeight: "100vh" }}>
      
      {/* ---------------- HEADER ---------------- */}
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>Order Details</h2>

      {/* ---------------- ORDER INFO ---------------- */}
      <div
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 10,
          marginTop: 15,
        }}
      >
        <p><b>Order Code:</b> {order.orderCode}</p>
        <p><b>Customer:</b> {order.buyer?.name}</p>
        <p><b>Email:</b> {order.buyer?.email}</p>
        <p><b>Phone:</b> {order.buyer?.phone || "N/A"}</p>
        <p><b>Total:</b> ₹{order.total}</p>
        <p><b>Status:</b> {order.status}</p>
      </div>

      {/* ---------------- PRODUCTS ---------------- */}
      <div
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <h3>Products</h3>

        <table style={{ width: "100%", marginTop: 10 }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {order.details.map((item, index) => (
              <tr key={index}>
                <td>{item.product?.name}</td>
                <td>₹{item.price}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- STATUS UPDATE ---------------- */}
      <div
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <h3>Update Status</h3>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: 8,
            marginTop: 10,
            width: "200px",
          }}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <br />

        <button
          onClick={updateStatus}
          style={{
            marginTop: 10,
            padding: "8px 12px",
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Update Status
        </button>
      </div>
    </div>
  );
}