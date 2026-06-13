"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        formData
      );

      // Save token
      localStorage.setItem(
        "token",
        response.data.token
      );

      alert("Login Successful");

      router.push("/dashboard");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.leftSection}>
          <h1>Let's Start New Journey</h1>
          <p>
            Welcome back, operator.
Secure login required to access your account modules:
 orders | wishlist | profile
          </p>
        </div>

        <div className={styles.rightSection}>
          <h2>Sign In</h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.loginBtn}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className={styles.bottomText}>
            Don't have an account?{" "}
            <Link
              href="/register"
              className={styles.registerLink}
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
