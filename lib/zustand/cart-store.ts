import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartProductItem {
  id: string; // unique item id (e.g. `${productId}-${size}-${color}`)
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
  vendorId?: string;
  storeName?: string;
  stock?: number;
}

interface CartStoreState {
  items: CartProductItem[];
  addItem: (item: Omit<CartProductItem, "id" | "quantity"> & { quantity?: number; id?: string }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const uniqueId = item.id || `${item.productId}-${item.size || "default"}-${item.color || "default"}`;
        const existingIndex = get().items.findIndex((i) => i.id === uniqueId);
        const addQty = item.quantity || 1;

        if (existingIndex > -1) {
          const updatedItems = [...get().items];
          updatedItems[existingIndex].quantity += addQty;
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...get().items,
              {
                ...item,
                id: uniqueId,
                quantity: addQty,
              },
            ],
          });
        }
      },

      removeItem: (itemId) => {
        set({
          items: get().items.filter((i) => i.id !== itemId && i.productId !== itemId),
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId || i.productId === itemId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      subtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "marketplace_cart_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
