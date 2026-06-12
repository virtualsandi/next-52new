"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "customer",
  });

  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // handle file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("role", form.role);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // redirect to login
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Name */}
        <input
          name="name"
          placeholder="Enter your name"
          className="w-full p-2 border mb-2"
          onChange={handleChange}
        />

        {/* Email */}
        <input
          name="email"
          placeholder="Enter your email"
          className="w-full p-2 border mb-2"
          onChange={handleChange}
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Enter password"
          className="w-full p-2 border mb-2"
          onChange={handleChange}
        />

        {/* Confirm Password */}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          className="w-full p-2 border mb-2"
          onChange={handleChange}
        />

        {/* Phone */}
        <input
          name="phone"
          placeholder="Enter phone number"
          className="w-full p-2 border mb-2"
          onChange={handleChange}
        />

        {/* Address */}
        <input
          name="address"
          placeholder="Enter address"
          className="w-full p-2 border mb-2"
          onChange={handleChange}
        />

        {/* Role */}
        <select
          name="role"
          className="w-full p-2 border mb-2"
          onChange={handleChange}
        >
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>

        {/* Image */}
        <input
          type="file"
          className="w-full p-2 border mb-2"
          onChange={handleFileChange}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Registering..." : "Submit"}
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={() =>
            setForm({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              phone: "",
              address: "",
              role: "customer",
            })
          }
          className="w-full mt-2 bg-gray-300 p-2 rounded"
        >
          Reset
        </button>

        {/* Login Link */}
        <p className="text-center mt-3 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login Here
          </span>
        </p>
      </form>
    </div>
  );
}