"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./add-product.module.css";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth";

export default function AddProductPage() {
  const router = useRouter();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    discount: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.description) {
      toast.error("Name, price, and description are required");
      return;
    }

    const price = Number(product.price);
    const discount = Number(product.discount || 0);

    const afterDiscount = price - (price * discount) / 100;

    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("slug", generateSlug(product.name));
    formData.append("price", String(price));
    formData.append("discount", String(discount));
    formData.append("afterDiscount", String(afterDiscount));
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("stock", product.stock);

    images.forEach((img) => {
      formData.append("images", img);
    });

    const token = getAuthToken();
    if (!token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add product");
        return;
      }

      toast.success("Product added successfully!");

      setProduct({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        discount: "",
      });

      setImages([]);
      setPreview([]);
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className={styles.container}>
          <h1>Add Product</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input name="name" placeholder="Name" value={product.name} onChange={handleChange} />
            <input name="price" placeholder="Price" value={product.price} onChange={handleChange} />
            <input name="discount" placeholder="Discount %" value={product.discount} onChange={handleChange} />
            <select name="category" value={product.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input name="stock" placeholder="Stock" value={product.stock} onChange={handleChange} />

            <textarea
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={handleChange}
            />

            {/* IMAGE UPLOAD */}
            <input type="file" multiple accept="image/*" onChange={handleImageChange} />

            {/* PREVIEW */}
            <label className={styles.uploadBtn}>
              Select Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>

            <button type="submit">Add Product</button>
          </form>
    </div>
  );
}