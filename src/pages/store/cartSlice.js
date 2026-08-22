import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [], // Retrieve saved cart from localStorage
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { id, quantity } = action.payload;
            const existingItem = state.cart.find((item) => item.id === id);
      
            if (existingItem) {
/*************  ✨ Codeium Command ⭐  *************/
        /**
         * Adds a new item to the cart or updates the quantity if the item already exists
         * @param {Object} action.payload - item to add, expected to have properties {id, name, price, quantity, category, productImage}
         */
/******  778e5e2a-131d-4dfa-8308-09dbf8d7a0f2  *******/              // If the item already exists in the cart, update its quantity
              existingItem.quantity += quantity;
            } else {
              // Otherwise, add it to the cart
              state.cart.push(action.payload);
            }
        },
        increaseQuantity: (state, action) => {
            const { itemId } = action.payload;
            const item = state.cart.find((item) => item.id === itemId);
            if (item) {
              item.quantity += 1;
            }
          },
          decreaseQuantity: (state, action) => {
            const { itemId } = action.payload;
            const item = state.cart.find((item) => item.id === itemId);
            if (item && item.quantity > 1) { // Change item.quantity > 0 to item.quantity > 1
              item.quantity -= 1;
            }
          },
          
        removeFromCart: (state, action) => {
            const {itemId} = action.payload;
            state.cart = state.cart.filter((item) => item.id !== itemId);
        },
        clearCart: (state) => {
          state.cart = [];
        },
    },
});

export const { addToCart, removeFromCart,increaseQuantity,decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; // Make sure to export the default reducer correctly
