"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import styles from "../settings.module.css";

interface ProfileSettingsProps {
  userRole?: string;
}

export default function ProfileSettings({ userRole }: ProfileSettingsProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAuthToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to load profile");
          return;
        }

        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch {
        toast.error("Server error");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const token = getAuthToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/profile`,
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
        toast.error(data.message || "Update failed");
        return;
      }

      toast.success("Profile updated successfully");

      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          localStorage.setItem(
            "user",
            JSON.stringify({ ...user, ...form })
          );
        } catch {
          /* ignore */
        }
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const initial = form.name ? form.name.charAt(0).toUpperCase() : "U";

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2>Profile Settings</h2>
        <p>Update your personal information and contact details.</p>
      </div>

      <div className={styles.profileBanner}>
        <div className={styles.avatar}>{initial}</div>
        <div>
          <h3>{form.name || "Your Profile"}</h3>
          <p>{form.email || "—"}</p>
          {userRole && (
            <span className={styles.roleBadge}>{userRole}</span>
          )}
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            className={styles.formControl}
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.formControl}
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            className={styles.formControl}
            placeholder="+977 98XXXXXXXX"
            value={form.phone}
            onChange={handleChange}
          />
          <span className={styles.formHint}>
            Used for order updates and customer support.
          </span>
        </div>

        <button
          type="button"
          className={styles.btnPrimary}
          onClick={handleSave}
          disabled={loading}
        >
          <Save size={16} />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </>
  );
}
