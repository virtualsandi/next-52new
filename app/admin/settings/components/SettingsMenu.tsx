"use client";

import { useEffect, useState } from "react";
import {
  User,
  Lock,
  CreditCard,
  Truck,
} from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import ChangePassword from "./ChangePassword";
import PaymentSettings from "./PaymentSettings";
import ShippingSettings from "./ShippingSettings";
import styles from "../settings.module.css";

type SettingsTab = "profile" | "password" | "payment" | "shipping";

const TABS: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "payment", label: "Payments", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
];

export default function SettingsMenu() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || user.email || "User");
        setUserRole(localStorage.getItem("role") || user.role || "");
      } catch {
        setUserName("User");
      }
    }
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.heroBadge}>Store Configuration</span>
        <h1>Settings</h1>
        <p>
          Manage your {userName ? `${userName}'s` : "store"} profile, security,
          payments, and delivery options.
        </p>
      </section>

      <div className={styles.layout}>
        <nav className={styles.nav}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.navItem} ${
                  activeTab === tab.id ? styles.navItemActive : ""
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className={styles.content}>
          {activeTab === "profile" && (
            <ProfileSettings userRole={userRole} />
          )}
          {activeTab === "password" && <ChangePassword />}
          {activeTab === "payment" && <PaymentSettings />}
          {activeTab === "shipping" && <ShippingSettings />}
        </div>
      </div>
    </div>
  );
}
