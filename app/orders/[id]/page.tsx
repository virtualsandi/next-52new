"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import styles from "../orders.module.css";

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

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#fef3c7", color: "#92400e" },
  confirmed: { bg: "#e0f2fe", color: "#0369a1" },
  processing: { bg: "#dbeafe", color: "#1d4ed8" },
  shipped: { bg: "#ede9fe", color: "#6d28d9" },
  delivered: { bg: "#d1fae5", color: "#065f46" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOrder = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/admin/orders/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        setOrder(data.data);
        setStatus(data.data.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const updateStatus = async () => {
    try {
      setSaving(true);
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
        toast.success("Order status updated");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (n: number) =>
    `Npr. ${Math.round(n).toLocaleString()}`;

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loadingState}>Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.page}>
        <p className={styles.emptyState}>Order not found</p>
        <Link href="/orders" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to orders
        </Link>
      </div>
    );
  }

  const st = STATUS_STYLES[order.status] || {
    bg: "#f1f5f9",
    color: "#475569",
  };

  return (
    <div className={styles.page}>
      <Link href="/orders" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <section className={styles.hero}>
        <span className={styles.heroBadge}>Order #{order.orderCode}</span>
        <h1>Order Details</h1>
        <p>
          <span
            className={styles.statusBadge}
            style={{ background: st.bg, color: st.color }}
          >
            {order.status}
          </span>
          {" · "}
          {formatCurrency(order.total)}
        </p>
      </section>

      <div className={styles.detailGrid}>
        <div className={styles.card}>
          <h3>Customer Information</h3>
          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Name</span>
              <span className={styles.infoValue}>{order.buyer?.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{order.buyer?.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Phone</span>
              <span className={styles.infoValue}>
                {order.buyer?.phone || "N/A"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Order Total</span>
              <span className={styles.infoValue}>
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3>Update Status</h3>
          <select
            className={styles.statusSelect}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={updateStatus}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? "Saving..." : "Update Status"}
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableCardHeader}>
          <h3>Order Items</h3>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.details.map((item, index) => (
                <tr key={index}>
                  <td>{item.product?.name || "Product"}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td className={styles.totalCell}>
                    {formatCurrency(item.price * item.quantity)}
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
