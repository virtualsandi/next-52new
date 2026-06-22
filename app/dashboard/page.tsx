"use client";

import Link from "next/link";
import styles from "./dashboard.module.css";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth";
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  Clock,
  PlusCircle,
  Users,
  Store,
  LayoutGrid,
  BarChart3,
  TrendingUp,
  DollarSign,
  Percent,
} from "lucide-react";

type DashboardView = "shop" | "manage" | "analytics";

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeView, setActiveView] = useState<DashboardView>("shop");

  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    discount: "",
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const isAdminOrSeller = role === "admin" || role === "seller";

  const fetchData = async () => {
    try {
      const token = getAuthToken();
      const requests: Promise<Response>[] = [
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`),
      ];

      if (token) {
        requests.push(
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/admin/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );
      }

      const [prodRes, catRes, orderRes] = await Promise.all(requests);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.data || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.data || []);
      }
      if (orderRes?.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData.data || []);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setRole(localStorage.getItem("role"));
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete product");
      }

      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
      console.error(err);
    }
  };

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || "",
      price: product.price ? String(product.price) : "",
      category: product.category?._id || product.category || "",
      stock: product.stock !== undefined ? String(product.stock) : "0",
      description: product.description || "",
      discount: product.discount !== undefined ? String(product.discount) : "0",
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.price || !editForm.description) {
      toast.error("Name, price, and description are required");
      return;
    }

    try {
      setSubmittingEdit(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const payload = {
        name: editForm.name,
        price: Number(editForm.price),
        category: editForm.category || null,
        stock: Number(editForm.stock || 0),
        description: editForm.description,
        discount: Number(editForm.discount || 0),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${editingProduct.slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      toast.success("Product updated successfully");
      setEditingProduct(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update product");
      console.error(err);
    } finally {
      setSubmittingEdit(false);
    }
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (prod) =>
            prod.category?._id === selectedCategory ||
            prod.category === selectedCategory
        );

  const lowStockCount = products.filter(
    (p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 5
  ).length;
  const outOfStockCount = products.filter((p) => (p.stock ?? 0) <= 0).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const getDisplayPrice = (prod: any) => {
    if (prod.afterDiscount) return prod.afterDiscount;
    if (prod.discount > 0) {
      return Math.round(prod.price * (1 - prod.discount / 100));
    }
    return prod.price;
  };

  const getStockBadgeClass = (stock: number) => {
    if (stock <= 0) return `${styles.badge} ${styles.badgeDanger}`;
    if (stock < 5) return `${styles.badge} ${styles.badgeWarning}`;
    return `${styles.badge} ${styles.badgeSuccess}`;
  };

  const getStockLabel = (stock: number) => {
    if (stock <= 0) return "Out of Stock";
    if (stock < 5) return `Low Stock (${stock})`;
    return `In Stock (${stock})`;
  };

  const getProductImage = (prod: any) =>
    prod.images?.length > 0
      ? `${process.env.NEXT_PUBLIC_ASSETS_URL}${prod.images[0]}`
      : "/no-image.png";

  const analytics = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== "cancelled");
    const deliveredOrders = orders.filter((o) => o.status === "delivered");
    const totalRevenue = activeOrders.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    );
    const deliveredRevenue = deliveredOrders.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    );
    const avgOrderValue = activeOrders.length
      ? totalRevenue / activeOrders.length
      : 0;

    const statusBreakdown = ORDER_STATUSES.map((status) => ({
      status,
      count: orders.filter((o) => o.status === status).length,
      color: STATUS_COLORS[status],
    }));
    const maxStatusCount = Math.max(
      ...statusBreakdown.map((s) => s.count),
      1
    );

    const categoryStats = categories
      .map((cat) => ({
        name: cat.name,
        count: products.filter(
          (p) =>
            p.category?._id === cat._id || p.category === cat._id
        ).length,
      }))
      .sort((a, b) => b.count - a.count);
    const maxCategoryCount = Math.max(
      ...categoryStats.map((c) => c.count),
      1
    );

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - i));
      day.setHours(0, 0, 0, 0);
      return day;
    });

    const salesByDay = last7Days.map((day) => {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      const dayOrders = orders.filter((o) => {
        if (!o.createdAt) return false;
        const created = new Date(o.createdAt);
        return created >= day && created < nextDay;
      });
      return {
        label: day.toLocaleDateString("en-US", { weekday: "short" }),
        count: dayOrders.length,
        revenue: dayOrders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + (o.total || 0), 0),
      };
    });
    const maxDayCount = Math.max(...salesByDay.map((d) => d.count), 1);

    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const inventoryValue = products.reduce(
      (sum, p) => sum + (p.price || 0) * (p.stock || 0),
      0
    );
    const onSaleCount = products.filter((p) => (p.discount || 0) > 0).length;
    const avgPrice = products.length
      ? products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length
      : 0;
    const inStockCount = products.filter((p) => (p.stock ?? 0) > 0).length;

    const recentOrders = [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);

    const fulfillmentRate = activeOrders.length
      ? Math.round((deliveredOrders.length / activeOrders.length) * 100)
      : 0;

    return {
      activeOrders,
      totalRevenue,
      deliveredRevenue,
      avgOrderValue,
      statusBreakdown,
      maxStatusCount,
      categoryStats,
      maxCategoryCount,
      salesByDay,
      maxDayCount,
      totalStock,
      inventoryValue,
      onSaleCount,
      avgPrice,
      inStockCount,
      recentOrders,
      fulfillmentRate,
    };
  }, [orders, products, categories]);

  const formatCurrency = (amount: number) =>
    `Npr. ${Math.round(amount).toLocaleString()}`;

  return (
    <div className={styles.dashboard}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>E-Commerce Store</span>
          <h1>
            {isAdminOrSeller
              ? "Your store dashboard"
              : "Welcome to your store"}
          </h1>
          <p>
            {isAdminOrSeller
              ? "Browse products like a customer or switch to manage inventory, orders, and more."
              : "Discover the latest products, deals, and categories — all in one place."}
          </p>
          <div className={styles.heroActions}>
            <Link href="/product" className={styles.heroBtnPrimary}>
              Browse All Products
            </Link>
            {isAdminOrSeller && (
              <button
                type="button"
                onClick={() => setActiveView("manage")}
                className={styles.heroBtnSecondary}
              >
                Open Backend Panel
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {loading ? (
          <p className={styles.loadingText}>Loading dashboard...</p>
        ) : (
          <>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.statIconTeal}`}>
                <Package size={22} />
              </div>
              <div>
                <p className={styles.statLabel}>Products</p>
                <p className={styles.statValue}>{products.length}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
                <LayoutGrid size={22} />
              </div>
              <div>
                <p className={styles.statLabel}>Categories</p>
                <p className={styles.statValue}>{categories.length}</p>
              </div>
            </div>

            {isAdminOrSeller && (
              <>
                <div className={styles.statCard}>
                  <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <p className={styles.statLabel}>Total Orders</p>
                    <p className={styles.statValue}>{orders.length}</p>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={`${styles.statIcon} ${styles.statIconAmber}`}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <p className={styles.statLabel}>Pending Orders</p>
                    <p className={styles.statValue}>{pendingOrders}</p>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={`${styles.statIcon} ${styles.statIconRed}`}>
                    <AlertTriangle size={22} />
                  </div>
                  <div>
                    <p className={styles.statLabel}>Low / Out of Stock</p>
                    <p className={styles.statValue}>
                      {lowStockCount + outOfStockCount}
                    </p>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* View Tabs */}
      <div className={styles.viewTabs}>
        <button
          type="button"
          onClick={() => setActiveView("shop")}
          className={`${styles.viewTab} ${
            activeView === "shop" ? styles.viewTabActive : ""
          }`}
        >
          <Store size={18} />
          Shop
        </button>
        {isAdminOrSeller && (
          <button
            type="button"
            onClick={() => setActiveView("manage")}
            className={`${styles.viewTab} ${
              activeView === "manage" ? styles.viewTabActive : ""
            }`}
          >
            <LayoutGrid size={18} />
            Backend
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveView("analytics")}
          className={`${styles.viewTab} ${
            activeView === "analytics" ? styles.viewTabActive : ""
          }`}
        >
          <BarChart3 size={18} />
          Analytics
        </button>
      </div>

      {/* Category Filters */}
      {!loading && activeView !== "analytics" && (
        <div className={styles.categoryTabs}>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`${styles.tabButton} ${
              selectedCategory === "all" ? styles.tabButtonActive : ""
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => setSelectedCategory(cat._id)}
              className={`${styles.tabButton} ${
                selectedCategory === cat._id ? styles.tabButtonActive : ""
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Shop View — Ecommerce product grid */}
      {activeView === "shop" && !loading && (
        <section className={styles.shopSection}>
          <div className={styles.sectionHeader}>
            <h2>Featured Products</h2>
            <Link href="/product" className={styles.viewAllLink}>
              View all →
            </Link>
          </div>

          {filteredProducts.length === 0 ? (
            <p className={styles.emptyState}>No products found in this category.</p>
          ) : (
            <div className={styles.productGrid}>
              {filteredProducts.map((prod) => (
                <article key={prod._id} className={styles.productCard}>
                  <Link
                    href={`/product/${prod.slug}`}
                    className={styles.productCardImageWrap}
                  >
                    <img
                      src={getProductImage(prod)}
                      alt={prod.name}
                      className={styles.productCardImage}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/no-image.png";
                      }}
                    />
                    {prod.discount > 0 && (
                      <span className={styles.discountTag}>
                        {prod.discount}% OFF
                      </span>
                    )}
                  </Link>

                  <div className={styles.productCardBody}>
                    {prod.category?.name && (
                      <span className={styles.productCategory}>
                        {prod.category.name}
                      </span>
                    )}
                    <Link
                      href={`/product/${prod.slug}`}
                      className={styles.productCardTitle}
                    >
                      {prod.name}
                    </Link>

                    <div className={styles.productCardPriceRow}>
                      <div>
                        <span className={styles.productCardPrice}>
                          Npr. {getDisplayPrice(prod)?.toLocaleString()}
                        </span>
                        {prod.discount > 0 && (
                          <span className={styles.productCardOldPrice}>
                            Npr. {prod.price?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span
                        className={getStockBadgeClass(prod.stock || 0)}
                      >
                        {(prod.stock ?? 0) > 0 ? "In Stock" : "Sold Out"}
                      </span>
                    </div>

                    <Link
                      href={`/product/${prod.slug}`}
                      className={styles.addToCartBtn}
                    >
                      <ShoppingBag size={16} />
                      View Product
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Backend View — Admin inventory management */}
      {activeView === "manage" && isAdminOrSeller && !loading && (
        <>
          <div className={styles.quickActions}>
            <Link href="/products/add" className={styles.quickActionCard}>
              <PlusCircle size={24} />
              <span>Add Product</span>
            </Link>
            <Link href="/orders" className={styles.quickActionCard}>
              <ShoppingBag size={24} />
              <span>Manage Orders</span>
            </Link>
            {role === "admin" && (
              <Link
                href="/admin/orders/user"
                className={styles.quickActionCard}
              >
                <Users size={24} />
                <span>View Users</span>
              </Link>
            )}
          </div>

          <div className={styles.productsSection}>
            <h2>Product Inventory</h2>
            <p className={styles.sectionSubtitle}>
              Edit, update stock, and remove products from your catalog.
            </p>

            <div className={styles.tableContainer}>
              {filteredProducts.length === 0 ? (
                <p className={styles.emptyState}>
                  No products found for this category.
                </p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Discount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((prod) => (
                      <tr key={prod._id}>
                        <td>
                          <div className={styles.productCell}>
                            <img
                              src={getProductImage(prod)}
                              alt={prod.name}
                              className={styles.productImg}
                              crossOrigin="anonymous"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/no-image.png";
                              }}
                            />
                            <span className={styles.productName}>
                              {prod.name}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`${styles.badge} ${styles.badgeInfo}`}
                          >
                            {prod.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td>Npr. {prod.price?.toLocaleString()}</td>
                        <td>
                          <span
                            className={getStockBadgeClass(prod.stock || 0)}
                          >
                            {getStockLabel(prod.stock || 0)}
                          </span>
                        </td>
                        <td>{prod.discount ? `${prod.discount}%` : "-"}</td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              type="button"
                              onClick={() => handleEditClick(prod)}
                              className={styles.btnEdit}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(prod.slug)}
                              className={styles.btnDelete}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {/* Analytics View */}
      {activeView === "analytics" && !loading && (
        <section className={styles.analyticsSection}>
          <div className={styles.sectionHeader}>
            <h2>
              {isAdminOrSeller ? "Store Analytics" : "Store Insights"}
            </h2>
            <p className={styles.analyticsSubtitle}>
              {isAdminOrSeller
                ? "Revenue, orders, inventory, and catalog performance at a glance."
                : "Overview of what's available in the store right now."}
            </p>
          </div>

          <div className={styles.analyticsKpiGrid}>
            {isAdminOrSeller && (
              <>
                <div className={styles.kpiCard}>
                  <div className={`${styles.kpiIcon} ${styles.statIconGreen}`}>
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className={styles.kpiLabel}>Total Revenue</p>
                    <p className={styles.kpiValue}>
                      {formatCurrency(analytics.totalRevenue)}
                    </p>
                    <p className={styles.kpiHint}>
                      Excludes cancelled orders
                    </p>
                  </div>
                </div>
                <div className={styles.kpiCard}>
                  <div className={`${styles.kpiIcon} ${styles.statIconTeal}`}>
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className={styles.kpiLabel}>Delivered Revenue</p>
                    <p className={styles.kpiValue}>
                      {formatCurrency(analytics.deliveredRevenue)}
                    </p>
                    <p className={styles.kpiHint}>
                      {analytics.fulfillmentRate}% fulfillment rate
                    </p>
                  </div>
                </div>
                <div className={styles.kpiCard}>
                  <div className={`${styles.kpiIcon} ${styles.statIconPurple}`}>
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className={styles.kpiLabel}>Avg. Order Value</p>
                    <p className={styles.kpiValue}>
                      {formatCurrency(analytics.avgOrderValue)}
                    </p>
                    <p className={styles.kpiHint}>
                      {analytics.activeOrders.length} active orders
                    </p>
                  </div>
                </div>
              </>
            )}
            <div className={styles.kpiCard}>
              <div className={`${styles.kpiIcon} ${styles.statIconBlue}`}>
                <Package size={20} />
              </div>
              <div>
                <p className={styles.kpiLabel}>Inventory Value</p>
                <p className={styles.kpiValue}>
                  {formatCurrency(analytics.inventoryValue)}
                </p>
                <p className={styles.kpiHint}>
                  {analytics.totalStock} units in stock
                </p>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div className={`${styles.kpiIcon} ${styles.statIconAmber}`}>
                <Percent size={20} />
              </div>
              <div>
                <p className={styles.kpiLabel}>Products on Sale</p>
                <p className={styles.kpiValue}>{analytics.onSaleCount}</p>
                <p className={styles.kpiHint}>
                  Avg. price {formatCurrency(analytics.avgPrice)}
                </p>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div className={`${styles.kpiIcon} ${styles.statIconTeal}`}>
                <LayoutGrid size={20} />
              </div>
              <div>
                <p className={styles.kpiLabel}>In Stock</p>
                <p className={styles.kpiValue}>
                  {analytics.inStockCount} / {products.length}
                </p>
                <p className={styles.kpiHint}>
                  {outOfStockCount} out of stock
                </p>
              </div>
            </div>
          </div>

          <div className={styles.analyticsGrid}>
            {isAdminOrSeller && (
              <>
                <div className={styles.analyticsCard}>
                  <h3>Orders — Last 7 Days</h3>
                  <div className={styles.barChart}>
                    {analytics.salesByDay.map((day) => (
                      <div key={day.label} className={styles.barChartItem}>
                        <div className={styles.barChartBarWrap}>
                          <div
                            className={styles.barChartBar}
                            style={{
                              height: `${(day.count / analytics.maxDayCount) * 100}%`,
                            }}
                            title={`${day.count} orders`}
                          />
                        </div>
                        <span className={styles.barChartLabel}>{day.label}</span>
                        <span className={styles.barChartValue}>{day.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.analyticsCard}>
                  <h3>Order Status Breakdown</h3>
                  <div className={styles.breakdownList}>
                    {analytics.statusBreakdown.map((item) => (
                      <div key={item.status} className={styles.breakdownRow}>
                        <div className={styles.breakdownMeta}>
                          <span
                            className={styles.breakdownDot}
                            style={{ background: item.color }}
                          />
                          <span className={styles.breakdownName}>
                            {item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                          </span>
                          <span className={styles.breakdownCount}>
                            {item.count}
                          </span>
                        </div>
                        <div className={styles.progressTrack}>
                          <div
                            className={styles.progressFill}
                            style={{
                              width: `${(item.count / analytics.maxStatusCount) * 100}%`,
                              background: item.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className={styles.analyticsCard}>
              <h3>Products by Category</h3>
              {analytics.categoryStats.length === 0 ? (
                <p className={styles.emptyState}>No category data yet.</p>
              ) : (
                <div className={styles.breakdownList}>
                  {analytics.categoryStats.map((cat) => (
                    <div key={cat.name} className={styles.breakdownRow}>
                      <div className={styles.breakdownMeta}>
                        <span className={styles.breakdownName}>{cat.name}</span>
                        <span className={styles.breakdownCount}>
                          {cat.count}
                        </span>
                      </div>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${(cat.count / analytics.maxCategoryCount) * 100}%`,
                            background: "#14b8a6",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.analyticsCard}>
              <h3>Stock Health</h3>
              <div className={styles.stockHealthGrid}>
                <div className={styles.stockHealthItem}>
                  <span className={styles.stockHealthValue}>
                    {analytics.inStockCount}
                  </span>
                  <span className={styles.stockHealthLabel}>In Stock</span>
                </div>
                <div className={styles.stockHealthItem}>
                  <span
                    className={`${styles.stockHealthValue} ${styles.stockHealthWarning}`}
                  >
                    {lowStockCount}
                  </span>
                  <span className={styles.stockHealthLabel}>Low Stock</span>
                </div>
                <div className={styles.stockHealthItem}>
                  <span
                    className={`${styles.stockHealthValue} ${styles.stockHealthDanger}`}
                  >
                    {outOfStockCount}
                  </span>
                  <span className={styles.stockHealthLabel}>Out of Stock</span>
                </div>
              </div>
              <div className={styles.stockHealthBar}>
                <div
                  className={styles.stockHealthSegment}
                  style={{
                    width: `${products.length ? (analytics.inStockCount / products.length) * 100 : 0}%`,
                    background: "#10b981",
                  }}
                />
                <div
                  className={styles.stockHealthSegment}
                  style={{
                    width: `${products.length ? (lowStockCount / products.length) * 100 : 0}%`,
                    background: "#f59e0b",
                  }}
                />
                <div
                  className={styles.stockHealthSegment}
                  style={{
                    width: `${products.length ? (outOfStockCount / products.length) * 100 : 0}%`,
                    background: "#ef4444",
                  }}
                />
              </div>
            </div>
          </div>

          {isAdminOrSeller && analytics.recentOrders.length > 0 && (
            <div className={styles.analyticsCard}>
              <div className={styles.sectionHeader}>
                <h3>Recent Orders</h3>
                <Link href="/orders" className={styles.viewAllLink}>
                  View all →
                </Link>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.orderCode}</td>
                        <td>{order.buyer?.name || "—"}</td>
                        <td>{formatCurrency(order.total || 0)}</td>
                        <td>
                          <span
                            className={styles.badge}
                            style={{
                              background: `${STATUS_COLORS[order.status] || "#6b7280"}22`,
                              color: STATUS_COLORS[order.status] || "#6b7280",
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Product</h2>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className={styles.closeBtn}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                    <label>Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className={styles.formControl}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Price (Npr.)</label>
                    <input
                      type="number"
                      name="price"
                      value={editForm.price}
                      onChange={handleEditChange}
                      className={styles.formControl}
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className={styles.formControl}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Stock Level</label>
                    <input
                      type="number"
                      name="stock"
                      value={editForm.stock}
                      onChange={handleEditChange}
                      className={styles.formControl}
                      min="0"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={editForm.discount}
                      onChange={handleEditChange}
                      className={styles.formControl}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className={styles.formControl}
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className={styles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className={styles.btnPrimary}
                >
                  {submittingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
