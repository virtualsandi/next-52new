"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  PlusCircle, 
  ShoppingBag, 
  Users, 
  UserPlus, 
  MessageSquare, 
  Settings, 
  Home, 
  LogOut, 
  Menu, 
  X,
  User,
  ShoppingBag as BrowseIcon
} from "lucide-react";
import { clearAuthToken } from "@/lib/auth";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserEmail(user.email || user.username || "User");
      } catch (e) {
        setUserEmail("User");
      }
    }
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      clearAuthToken();
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  const isAdminOrSeller = role === "admin" || role === "seller";

  const adminNavItems = [
    { label: "Dashboard Overview", path: "/dashboard", icon: LayoutDashboard },
    { label: "Add Product", path: "/products/add", icon: PlusCircle },
    { label: "Manage Orders", path: "/orders", icon: ShoppingBag },
    { label: "View Users", path: "/admin/orders/user", icon: Users },
    { label: "Create Users", path: "/admin/orders/user/create", icon: UserPlus },
    { label: "Customer Chat", path: "/admin/chat", icon: MessageSquare },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const customerNavItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Browse Products", path: "/product", icon: BrowseIcon },
    { label: "Support Chat", path: "/chat", icon: MessageSquare },
    { label: "My Orders", path: "/my-orders", icon: ShoppingBag },
    { label: "My Profile", path: "/profile", icon: User },
  ];

  const navItems = isAdminOrSeller ? adminNavItems : customerNavItems;

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className={styles.mobileHeader}>
        <span className={styles.logoText}>E-Commerce Store</span>
        <button onClick={toggleMobileSidebar} className={styles.menuToggleBtn} aria-label="Toggle menu">
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ""} ${className}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🛍️</span>
            <span className={styles.logoText}>E-Commerce Store</span>
          </div>
          <button onClick={toggleMobileSidebar} className={styles.closeBtn} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* User profile section */}
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
            <span className={styles.statusDot}></span>
          </div>
          <div className={styles.userInfo}>
            <p className={styles.username}>{userEmail || "Welcome"}</p>
            <span className={styles.roleBadge}>{role || "Customer"}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          <ul className={styles.navList}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.path ||
                (item.path !== "/dashboard" && pathname.startsWith(`${item.path}/`));
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path} 
                    className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Icon size={20} className={styles.navIcon} />
                    <span className={styles.navLabel}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.storeLink}>
            <Home size={18} />
            <span>Visit Storefront</span>
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div className={styles.backdrop} onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  );
}
