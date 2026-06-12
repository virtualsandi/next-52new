
   "use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // simulate API call
      await new Promise((res) => setTimeout(res, 1200));

      console.log(formData);

      router.push("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 transition-all duration-300 hover:shadow-2xl"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6">
          Login to continue
        </p>

        {/* Success message */}
        {searchParams.get("registered") && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-3 text-sm">
            Registration successful! Please login.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="relative mb-4">
          <input
            name="email"
            type="email"
            onChange={handleChange}
            className="peer w-full p-3 border rounded-lg outline-none focus:border-blue-500 bg-transparent"
            placeholder=" "
          />
          <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm bg-white px-1">
            Email Address
          </label>
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            className="peer w-full p-3 border rounded-lg outline-none focus:border-blue-500 bg-transparent"
            placeholder=" "
          />
          <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm bg-white px-1">
            Password
          </label>

          <span
            className="absolute right-3 top-3 text-sm text-blue-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white p-3 rounded-lg font-medium flex items-center justify-center"
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            "Login"
          )}
        </button>

        {/* Footer */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer font-medium"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
