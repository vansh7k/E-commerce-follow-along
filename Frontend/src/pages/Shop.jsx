import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import Toast from "../components/Toast";
import { ProductCardSkeleton } from "../components/Skeleton";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sync state with URL search params
  const categoryParam = searchParams.get("category") || "";
  const sizeParam = searchParams.get("size") ? searchParams.get("size").split(",") : [];
  const priceMaxParam = searchParams.get("priceMax") || "10000";
  const sortParam = searchParams.get("sort") || "newest";
  const pageParam = Number(searchParams.get("page")) || 1;
  const searchParam = searchParams.get("search") || "";

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    // Fetch categories list
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        // Build query string
        const params = new URLSearchParams();
        if (categoryParam) params.append("category", categoryParam);
        if (sizeParam.length > 0) params.append("size", sizeParam.join(","));
        if (priceMaxParam) params.append("priceMax", priceMaxParam);
        if (sortParam) params.append("sort", sortParam);
        if (searchParam) params.append("search", searchParam);
        params.append("page", pageParam);
        params.append("limit", 9); // 9 products per page

        const productsRes = await API.get(`/products?${params.toString()}`);
        setProducts(productsRes.data.products || []);
        setTotalPages(productsRes.data.totalPages || 1);
        setTotalProducts(productsRes.data.totalProducts || 0);

        const token = localStorage.getItem("maverick_token");
        if (token) {
          const wishlistRes = await API.get("/wishlist");
          setWishlistItems(wishlistRes.data.products || []);
        }
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredProducts();
  }, [categoryParam, sizeParam.join(","), priceMaxParam, sortParam, pageParam, searchParam]);

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Reset to page 1 on filter update
    newParams.set("page", "1");

    if (value === "" || (Array.isArray(value) && value.length === 0)) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.set(key, value.join(","));
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleCategorySelect = (slug) => {
    updateFilters("category", slug);
  };

  const handleSizeToggle = (size) => {
    const idx = sizeParam.indexOf(size);
    let newSizes = [...sizeParam];
    if (idx > -1) {
      newSizes.splice(idx, 1);
    } else {
      newSizes.push(size);
    }
    updateFilters("size", newSizes);
  };

  const handlePriceChange = (range) => {
    updateFilters("priceMax", range[1]);
  };

  const handleSortChange = (opt) => {
    updateFilters("sort", opt);
  };

  const handlePageChange = (pageNum) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pageNum);
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    updateFilters("search", e.target.value);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleWishlistUpdate = async () => {
    try {
      const wishlistRes = await API.get("/wishlist");
      setWishlistItems(wishlistRes.data.products || []);
    } catch (error) {
      console.error("Error updating wishlist count:", error);
    }
  };

  return (
    <div className="page-container" style={{ backgroundColor: "var(--void)" }}>
      <Navbar />
      <CartDrawer />
      <Toast />

      {/* Hero Header */}
      <div style={{ borderBottom: "1px solid var(--ash)", padding: "40px 24px" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--dust)" }}>SHOP ARCHIVE</span>
            <h2 style={{ fontSize: "2.5rem" }}>ALL CLOTHING</h2>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* Search Input bar */}
            <input
              type="text"
              placeholder="SEARCH ITEMS..."
              value={searchParam}
              onChange={handleSearchChange}
              className="input-brutalist"
              style={{ width: "200px", padding: "8px 12px", fontSize: "0.8rem" }}
            />
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="btn btn-ghost mobile-filter-btn"
              style={{ padding: "8px 16px", fontSize: "0.9rem" }}
            >
              FILTERS
            </button>
          </div>
        </div>
      </div>

      {/* Main shop Content split column */}
      <div className="container" style={{ padding: "40px 24px", flex: 1 }}>
        <div style={{ display: "flex", gap: "48px" }}>
          
          {/* Sidebar component */}
          <FilterSidebar
            categories={categories}
            selectedCategory={categoryParam}
            onCategorySelect={handleCategorySelect}
            selectedSizes={sizeParam}
            onSizeToggle={handleSizeToggle}
            priceRange={[0, Number(priceMaxParam)]}
            onPriceChange={handlePriceChange}
            sortOption={sortParam}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Product grid area */}
          <div style={{ flexGrow: 1 }}>
            {loading ? (
              <div className="product-grid">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{
                height: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed var(--ash)",
                color: "var(--dust)"
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: "3rem", marginBottom: "12px" }}>
                  search_off
                </span>
                <p className="font-mono text-sm">Nothing matches your search criteria.</p>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      wishlistItems={wishlistItems}
                      onWishlistUpdate={handleWishlistUpdate}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "16px",
                    marginTop: "60px",
                    fontFamily: "var(--font-mono)"
                  }}>
                    <button
                      disabled={pageParam === 1}
                      onClick={() => handlePageChange(pageParam - 1)}
                      className="btn btn-ghost"
                      style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                    >
                      PREV
                    </button>
                    <span>
                      {pageParam} / {totalPages}
                    </span>
                    <button
                      disabled={pageParam === totalPages}
                      onClick={() => handlePageChange(pageParam + 1)}
                      className="btn btn-ghost"
                      style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                    >
                      NEXT
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>

      <Footer />

      <style>{`
        .mobile-filter-btn {
          display: block;
        }
        @media (min-width: 768px) {
          .mobile-filter-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Shop;
