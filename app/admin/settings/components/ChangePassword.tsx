"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import styles from "../settings.module.css";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: form.oldPassword,
            newPassword: form.newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Password change failed");
        return;
      }

      toast.success("Password changed successfully");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2>Change Password</h2>
        <p>Keep your account secure with a strong password.</p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="oldPassword">Current Password</label>
          <input
            id="oldPassword"
            type="password"
            name="oldPassword"
            className={styles.formControl}
            placeholder="Enter current password"
            value={form.oldPassword}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            className={styles.formControl}
            placeholder="At least 6 characters"
            value={form.newPassword}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            className={styles.formControl}
            placeholder="Re-enter new password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <span className={styles.formHint}>
            Use a mix of letters, numbers, and symbols for better security.
          </span>
        </div>

        <button
          type="button"
          className={styles.btnPrimary}
          onClick={handleSubmit}
          disabled={loading}
        >
          <ShieldCheck size={16} />
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </>
  );
}
