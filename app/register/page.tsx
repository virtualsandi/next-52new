"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./register.module.css";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "customer",
  });

  const [image, setImage] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      role: "customer",
    });

    setImage(null);
  };

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  // Required field validation
  if (
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.password.trim() ||
    !formData.confirmPassword.trim() ||
    !formData.phone.trim() ||
    !formData.address.trim()
  ) {
    toast.error("All fields are required");
    return;
  }

  // Image validation
  if (!image) {
    toast.error("Please upload an image");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.email)) {
    toast.error("Please enter a valid email address");
    return;
  }
// 2. Password strength
if (formData.password.length < 8) {
  toast.error(
    "Password must be at least 8 characters long"
  );
  return;
}

if (!/[A-Z]/.test(formData.password)) {
  toast.error(
    "Password must contain at least one uppercase letter"
  );
  return;
}

if (!/[a-z]/.test(formData.password)) {
  toast.error(
    "Password must contain at least one lowercase letter"
  );
  return;
}

if (!/[0-9]/.test(formData.password)) {
  toast.error(
    "Password must contain at least one number"
  );
  return;
}

if (!/[!@#$%^&*(),.?\":{}|<>]/.test(formData.password)) {
  toast.error(
    "Password must contain at least one special character"
  );
  return;
}
  // Password match validation
  if (formData.password !== formData.confirmPassword) {
    toast.error(
      "Password and Confirm Password should be same"
    );
    return;
  }

  try {
    setLoading(true);

    const payload = new FormData();

    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("phone", formData.phone);
    payload.append("address", formData.address);
    payload.append("role", formData.role);

    if (image) {
      payload.append("image", image);
    }

    const response = await axios.post(
      "http://localhost:9000/api/v1/auth/register",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success(
      response.data.message ||
        "Registration Successful"
    );

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  } catch (error: any) {
    console.error(error);

    const message =
      error?.response?.data?.message || "";

    if (
      message.toLowerCase().includes("email")
    ) {
      toast.error(
        "Email already exists. Please use another email."
      );
    } else {
      toast.error(
        message || "Registration Failed"
      );
    }
  } finally {
    setLoading(false);
  }

};
const isFormValid =
  formData.name.trim() &&
  formData.email.trim() &&
  formData.password.trim() &&
  formData.confirmPassword.trim() &&
  formData.phone.trim() &&
  formData.address.trim() &&
  image;

  return (
    <div className={styles.container}>
      <div className={styles.registerCard}>
        <div className={styles.leftSection}>
          <h1>ShopEase</h1>

          <h2>Start Your Shopping Journey</h2>

          <p>
            Create your account and unlock exclusive
            deals, faster checkout, wishlist management,
            and order tracking.
          </p>

          <div className={styles.features}>
            <div>✓ Secure Payments</div>
            <div>✓ Fast Delivery</div>
            <div>✓ Easy Returns</div>
            <div>✓ Special Discounts</div>
          </div>
        </div>

        <div className={styles.rightSection}>
          <h2>Register Page</h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="admin2019@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Re-Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Address</label>
              <textarea
                name="address"
                rows={3}
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">
                  Customer
                </option>
                <option value="seller">
                  Seller
                </option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) =>
                  setImage(
                    e.target.files?.[0] || null
                  )
                }
              />
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.resetBtn}
                disabled={loading }
              >
                Reset
              </button>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit"}
              </button>
            </div>

            <p className={styles.loginText}>
              Already have an account?
              <Link
                href="/login"
                className={styles.loginLink}
              >
                Login Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
