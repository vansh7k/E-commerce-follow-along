import React, { useState, useEffect } from "react";
import API from "../../api";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import Toast from "../../components/Toast";
import { useToastStore } from "../../store/toastStore";

const Products = () => {
  const addToast = useToastStore((state) => state.addToast);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form toggle states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form Field States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState(null); // FileList

  // Dynamic variants array: { size, color, stock, sku }
  const [variants, setVariants] = useState([{ size: "S", color: "", stock: 10, sku: "" }]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products?limit=100"); // Fetch all products for admin
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      addToast("Failed to load products list", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data || []);
      if (res.data.length > 0) setCategoryId(res.data[0]._id);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: "S", color: "", stock: 0, sku: "" }]);
  };

  const handleRemoveVariant = (idx) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleVariantChange = (idx, field, val) => {
    const updated = [...variants];
    updated[idx][field] = val;
    setVariants(updated);
  };

  const handleOpenAddForm = () => {
    setEditId(null);
    setName("");
    setDescription("");
    setPrice("");
    setComparePrice("");
    if (categories.length > 0) setCategoryId(categories[0]._id);
    setTags("");
    setSku("");
    setStock("");
    setPublished(true);
    setFeatured(false);
    setImages(null);
    setVariants([{ size: "S", color: "", stock: 10, sku: "" }]);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (prod) => {
    setEditId(prod._id);
    setName(prod.name || "");
    setDescription(prod.description || "");
    setPrice(prod.price || "");
    setComparePrice(prod.comparePrice || "");
    setCategoryId(prod.category?._id || prod.category || "");
    setTags(prod.tags ? prod.tags.join(", ") : "");
    setSku(prod.sku || "");
    setStock(prod.stock || "");
    setPublished(prod.published !== false);
    setFeatured(prod.featured === true);
    setVariants(prod.variants && prod.variants.length > 0 ? prod.variants : [{ size: "S", color: "", stock: 0, sku: "" }]);
    setImages(null);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);
      addToast("PRODUCT DELETED SUCCESSFULLY", "success");
      fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err);
      addToast("Failed to delete product.", "error");
    }
  };

  const handleTogglePublished = async (prod) => {
    try {
      await API.put(`/products/${prod._id}`, {
        published: !prod.published
      });
      addToast(`PRODUCT ${!prod.published ? "PUBLISHED" : "UNPUBLISHED"}`, "success");
      fetchProducts();
    } catch (err) {
      console.error("Toggle published error:", err);
      addToast("Failed to update status", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !categoryId) {
      addToast("NAME, DESCRIPTION, PRICE AND CATEGORY ARE REQUIRED", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("comparePrice", comparePrice);
    formData.append("categoryId", categoryId);
    formData.append("tags", tags);
    formData.append("sku", sku);
    formData.append("stock", stock || 0);
    formData.append("published", published);
    formData.append("featured", featured);
    formData.append("variants", JSON.stringify(variants));

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    try {
      if (editId) {
        await API.put(`/products/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        addToast("PRODUCT UPDATED SUCCESSFULLY", "success");
      } else {
        await API.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        addToast("PRODUCT CREATED SUCCESSFULLY", "success");
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Save product failed:", err);
      addToast("Failed to save product.", "error");
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="page-container" style={{ backgroundColor: "var(--void)" }}>
      <Navbar />
      <Toast />

      <div style={{ display: "flex", flex: 1 }}>
        <AdminSidebar />

        <div style={{ flex: 1, padding: "40px" }} className="admin-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <h1 style={{ fontSize: "2.5rem", margin: 0 }}>PRODUCTS ARCHIVE</h1>
            <button onClick={handleOpenAddForm} className="btn btn-primary">
              + ADD PRODUCT
            </button>
          </div>

          {loading ? (
            <div className="font-mono text-sm" style={{ color: "var(--dust)" }}>RETRIEVING INVENTORIES...</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--ash)", textAlign: "left", color: "var(--dust)" }}>
                    <th style={{ padding: "12px" }}>IMAGE</th>
                    <th style={{ padding: "12px" }}>NAME</th>
                    <th style={{ padding: "12px" }}>SKU</th>
                    <th style={{ padding: "12px" }}>PRICE</th>
                    <th style={{ padding: "12px" }}>STOCK</th>
                    <th style={{ padding: "12px" }}>PUBLISHED</th>
                    <th style={{ padding: "12px" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod._id} style={{ borderBottom: "1px solid var(--ash)" }}>
                      <td style={{ padding: "12px" }}>
                        <img
                          src={prod.images && prod.images[0] ? `http://localhost:7000${prod.images[0]}` : "https://placehold.co/40x50/2A2A2A/E8E2D9?text=M"}
                          alt={prod.name}
                          style={{ width: "40px", height: "50px", objectFit: "cover", border: "1px solid var(--ash)" }}
                          onError={(e) => {
                            e.target.src = "https://placehold.co/40x50/2A2A2A/E8E2D9?text=M";
                          }}
                        />
                      </td>
                      <td style={{ padding: "12px", fontWeight: "bold" }}>{prod.name}</td>
                      <td style={{ padding: "12px" }}>{prod.sku || "N/A"}</td>
                      <td style={{ padding: "12px", color: "var(--ember)" }}>{formatPrice(prod.price)}</td>
                      <td style={{ padding: "12px" }}>{prod.stock}</td>
                      <td style={{ padding: "12px" }}>
                        <button
                          onClick={() => handleTogglePublished(prod)}
                          style={{
                            cursor: "pointer",
                            color: prod.published ? "var(--ember)" : "var(--dust)",
                            fontWeight: "bold"
                          }}
                        >
                          {prod.published ? "YES" : "NO"}
                        </button>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <button
                            onClick={() => handleOpenEditForm(prod)}
                            style={{ color: "var(--bone)", textDecoration: "underline", cursor: "pointer" }}
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id)}
                            style={{ color: "#ff3333", textDecoration: "underline", cursor: "pointer" }}
                          >
                            DELETE
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Form Overlay Modal */}
          {isFormOpen && (
            <div style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.85)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}>
              <div style={{
                width: "100%",
                maxWidth: "700px",
                backgroundColor: "var(--void)",
                border: "1px solid var(--dust)",
                padding: "36px",
                maxHeight: "90vh",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "24px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "1.8rem" }}>{editId ? "EDIT PRODUCT" : "ADD NEW PRODUCT"}</h2>
                  <button onClick={() => setIsFormOpen(false)} className="material-symbols-outlined" style={{ cursor: "pointer" }}>
                    close
                  </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--dust)" }}>NAME</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="input-brutalist"
                        style={{ marginTop: "4px" }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--dust)" }}>CATEGORY</span>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="input-brutalist"
                        style={{ marginTop: "4px" }}
                      >
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--dust)" }}>DESCRIPTION</span>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="input-brutalist"
                      rows="3"
                      style={{ marginTop: "4px", resize: "none" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--dust)" }}>PRICE (INR)</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="input-brutalist"
                        style={{ marginTop: "4px" }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--dust)" }}>COMPARE PRICE (INR)</span>
                      <input
                        type="number"
                        value={comparePrice}
                        onChange={(e) => setComparePrice(e.target.value)}
                        className="input-brutalist"
                        style={{ marginTop: "4px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--dust)" }}>SKU</span>
                      <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="input-brutalist"
                        style={{ marginTop: "4px" }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--dust)" }}>BASE STOCK</span>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="input-brutalist"
                        style={{ marginTop: "4px" }}
                      />
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--dust)" }}>TAGS (COMMA SEPARATED)</span>
                    <input
                      type="text"
                      placeholder="e.g. outerwear, heavyweight, warm"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="input-brutalist"
                      style={{ marginTop: "4px" }}
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--dust)" }}>IMAGE UPLOAD</span>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setImages(e.target.files)}
                      className="input-brutalist"
                      style={{ marginTop: "4px" }}
                    />
                  </div>

                  {/* Sizing variants panel */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)", color: "var(--dust)" }}>SIZING VARIANTS</span>
                      <button type="button" onClick={handleAddVariant} style={{ color: "var(--ember)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", cursor: "pointer" }}>
                        + ADD VARIANT ROW
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {variants.map((v, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <select
                            value={v.size}
                            onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                            className="input-brutalist"
                            style={{ width: "70px", padding: "6px" }}
                          >
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                          </select>
                          <input
                            type="text"
                            placeholder="COLOR"
                            value={v.color}
                            onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                            className="input-brutalist"
                            style={{ padding: "6px", flexGrow: 1 }}
                          />
                          <input
                            type="number"
                            placeholder="STOCK"
                            value={v.stock}
                            onChange={(e) => handleVariantChange(idx, "stock", Number(e.target.value))}
                            className="input-brutalist"
                            style={{ width: "80px", padding: "6px" }}
                          />
                          <button type="button" onClick={() => handleRemoveVariant(idx)} className="material-symbols-outlined" style={{ color: "var(--dust)", cursor: "pointer" }}>
                            delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        id="published-check"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        style={{ width: "16px", height: "16px", accentColor: "var(--ember)" }}
                      />
                      <label htmlFor="published-check" style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", cursor: "pointer" }}>
                        PUBLISH
                      </label>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        id="featured-check"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        style={{ width: "16px", height: "16px", accentColor: "var(--ember)" }}
                      />
                      <label htmlFor="featured-check" style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", cursor: "pointer" }}>
                        FEATURED DROPS
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px", marginTop: "10px" }}>
                    SAVE PRODUCT
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Products;
