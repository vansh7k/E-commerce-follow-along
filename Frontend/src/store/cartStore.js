import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { product, size, color, qty }
      isCartOpen: false,

      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

      addItem: (product, size, color, qty = 1) => {
        const currentItems = get().items;
        
        // Match by product ID and size (and color if provided)
        const existingItemIndex = currentItems.findIndex(
          (item) =>
            item.product._id === product._id &&
            item.size === size &&
            item.color === color
        );

        let newItems;
        if (existingItemIndex > -1) {
          // Item exists, update quantity
          newItems = [...currentItems];
          newItems[existingItemIndex].qty += qty;
        } else {
          // Add as new item
          newItems = [...currentItems, { product, size, color, qty }];
        }

        set({
          items: newItems,
          isCartOpen: true // Auto trigger CartDrawer slide-in
        });
      },

      removeItem: (productId, size) => {
        const currentItems = get().items;
        const newItems = currentItems.filter(
          (item) => !(item.product._id === productId && item.size === size)
        );
        set({ items: newItems });
      },

      updateQty: (productId, size, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, size);
          return;
        }
        const currentItems = get().items;
        const newItems = currentItems.map((item) => {
          if (item.product._id === productId && item.size === size) {
            return { ...item, qty };
          }
          return item;
        });
        set({ items: newItems });
      },

      clearCart: () => set({ items: [] }),

      // Calculated stats
      getCount: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0);
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
      }
    }),
    {
      name: "maverick-cart", // Key name in localStorage
    }
  )
);
