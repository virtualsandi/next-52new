"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import styles from "./orders.module.css";

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

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#fef3c7", color: "#92400e" },
  processing: { bg: "#dbeafe", color: "#1d4ed8" },
  shipped: { bg: "#ede9fe", color: "#6d28d9" },
  delivered: { bg: "#d1fae5", color: "#065f46" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
  confirmed: { bg: "#e0f2fe", color: "#0369a1" },
};

const FILTERS = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const fetchOrders = async (searchValue = "") => {
    try {
      setLoading(true);
      const token = getAuthToken();

      let url = `${process.env.NEXT_PUBLIC_API_URL}/order/admin/orders`;
      const params = new URLSearchParams();
      if (searchValue) params.append("search", searchValue);
      url += params.toString() ? `?${params.toString()}` : "";

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === "pending").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.total || 0), 0);
    return { total: orders.length, pending, delivered, revenue };
  }, [orders]);

  const formatCurrency = (n: number) =>
    `Npr. ${Math.round(n).toLocaleString()}`;

  const getStatusStyle = (status: string) =>
    STATUS_STYLES[status] || { bg: "#f1f5f9", color: "#475569" };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.heroBadge}>Order Management</span>
        <h1>Orders</h1>
        <p>Track, filter, and manage all customer orders from your store.</p>
      </section>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Orders</p>
          <p className={styles.statValue}>{stats.total}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Pending</p>
          <p className={styles.statValue}>{stats.pending}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Delivered</p>
          <p className={styles.statValue}>{stats.delivered}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Revenue</p>
          <p className={styles.statValue} style={{ fontSize: "1.1rem" }}>
            {formatCurrency(stats.revenue)}
          </p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filterTabs}>
          {FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`${styles.filterTab} ${
                filter === status ? styles.filterTabActive : ""
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className={styles.searchRow}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search order code or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchOrders(search);
            }}
          />
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => fetchOrders(search)}
          >
            <Search size={16} />
            Search
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => {
              setSearch("");
              fetchOrders("");
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <p className={styles.loadingState}>Loading orders...</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const st = getStatusStyle(order.status);
                  return (
                    <tr key={order._id}>
                      <td className={styles.orderCode}>{order.orderCode}</td>
                      <td>{order.buyer?.name || "—"}</td>
                      <td>{order.buyer?.email || "—"}</td>
                      <td>{order.details?.length ?? 0}</td>
                      <td className={styles.totalCell}>
                        {formatCurrency(order.total || 0)}
                      </td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{ background: st.bg, color: st.color }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/orders/${order._id}`}
                          className={styles.viewLink}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className={styles.emptyState}>
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
