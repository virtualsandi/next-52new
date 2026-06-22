"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Package, Save } from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import styles from "../settings.module.css";

export default function ShippingSettings() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    deliveryCharge: 0,
    freeShippingLimit: 0,
    enableShipping: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = getAuthToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/shipping-settings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();

        if (res.ok && data) {
          setForm({
            deliveryCharge: data.deliveryCharge ?? 0,
            freeShippingLimit: data.freeShippingLimit ?? 0,
            enableShipping: data.enableShipping ?? true,
          });
        }
      } catch {
        toast.error("Failed to load shipping settings");
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: Number(value),
    });
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const token = getAuthToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/shipping-settings`,
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

      toast.success("Shipping settings updated");
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2>Shipping & Delivery</h2>
        <p>Configure delivery charges and free shipping rules for your store.</p>
      </div>

      <div className={styles.optionList}>
        <div
          className={`${styles.optionCard} ${
            form.enableShipping ? styles.optionCardActive : ""
          }`}
        >
          <div className={styles.optionInfo}>
            <div className={styles.optionIcon}>
              <Package size={20} />
            </div>
            <div>
              <h4>Enable Shipping</h4>
              <p>Allow customers to place orders with home delivery</p>
            </div>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={form.enableShipping}
              onChange={() =>
                setForm((prev) => ({
                  ...prev,
                  enableShipping: !prev.enableShipping,
                }))
              }
            />
            <span className={styles.toggleSlider} />
          </label>
        </div>
      </div>

      <div
        className={`${styles.shippingFields} ${
          !form.enableShipping ? styles.shippingFieldsDisabled : ""
        }`}
      >
        <div className={styles.formGroup}>
          <label htmlFor="deliveryCharge">Delivery Charge (Npr.)</label>
          <input
            id="deliveryCharge"
            type="number"
            name="deliveryCharge"
            className={styles.formControl}
            placeholder="0"
            min="0"
            value={form.deliveryCharge}
            onChange={handleChange}
          />
          <span className={styles.formHint}>
            Standard delivery fee added to each order.
          </span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="freeShippingLimit">Free Shipping Above (Npr.)</label>
          <input
            id="freeShippingLimit"
            type="number"
            name="freeShippingLimit"
            className={styles.formControl}
            placeholder="0"
            min="0"
            value={form.freeShippingLimit}
            onChange={handleChange}
          />
          <span className={styles.formHint}>
            Orders above this amount get free delivery. Set 0 to disable.
          </span>
        </div>
      </div>

      <button
        type="button"
        className={styles.btnPrimary}
        onClick={handleSave}
        disabled={loading}
      >
        <Save size={16} />
        {loading ? "Saving..." : "Save Shipping Settings"}
      </button>
    </>
  );
}
