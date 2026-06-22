"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Banknote, Smartphone, Wallet, Save } from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import styles from "../settings.module.css";

const PAYMENT_OPTIONS = [
  {
    key: "esewa" as const,
    label: "eSewa",
    description: "Accept payments via eSewa digital wallet",
    icon: Smartphone,
  },
  {
    key: "cod" as const,
    label: "Cash on Delivery",
    description: "Let customers pay when their order arrives",
    icon: Banknote,
  },
  {
    key: "khalti" as const,
    label: "Khalti",
    description: "Accept payments through Khalti wallet",
    icon: Wallet,
  },
];

export default function PaymentSettings() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    esewa: true,
    cod: true,
    khalti: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = getAuthToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/payment-settings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();

        if (res.ok && data) {
          setForm({
            esewa: data.esewa ?? true,
            cod: data.cod ?? true,
            khalti: data.khalti ?? false,
          });
        }
      } catch {
        toast.error("Failed to load payment settings");
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (key: keyof typeof form) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const token = getAuthToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/payment-settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to save settings");
        return;
      }

      toast.success("Payment settings updated");
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const activeCount = Object.values(form).filter(Boolean).length;

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2>Payment Methods</h2>
        <p>
          Choose which payment options customers see at checkout.{" "}
          {activeCount} method{activeCount !== 1 ? "s" : ""} enabled.
        </p>
      </div>

      <div className={styles.optionList}>
        {PAYMENT_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = form[option.key];
          return (
            <div
              key={option.key}
              className={`${styles.optionCard} ${
                isActive ? styles.optionCardActive : ""
              }`}
            >
              <div className={styles.optionInfo}>
                <div className={styles.optionIcon}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4>{option.label}</h4>
                  <p>{option.description}</p>
                </div>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => handleToggle(option.key)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.btnPrimary}
        onClick={handleSave}
        disabled={loading}
      >
        <Save size={16} />
        {loading ? "Saving..." : "Save Payment Settings"}
      </button>
    </>
  );
}
