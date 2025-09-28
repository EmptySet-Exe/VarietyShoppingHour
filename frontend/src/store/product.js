import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],

  fetchProducts: async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();
      if (data.success) set({ products: data.data });
    } catch (err) {
      console.error("Fetch products failed:", err);
    }
  },

  createProduct: async (product) => {
    const res = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return res.json();
  },

  updateProduct: async (id, product) => {
    const res = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return res.json();
  },

  deleteProduct: async (id) => {
    const res = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
}));
