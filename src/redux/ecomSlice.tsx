import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cartProductType, storeType, userType } from "../types";

const initialState: storeType = {
  products: [],
  user: {
    name: "",
    password: "",
    role: "",
    email: "",
    cart: [],
  },
  users: [],
  loading: false,
  error: { found: false, msg: "" },
  filteredProducts: [],
  filtersUsed:[],
  filters: [
    {type:'string',name:'brand',stringValue:[
      "Apple",
      "Samsung",
      "OPPO",
      "Huawei",
      "Microsoft Surface",
      "Infinix",
      "HP Pavilion",
    ]},
    {type:'string',name:'category',stringValue:[
      "smartphones",
      "laptops",
      "fragrances",
      "skincare",
      "groceries",
      "home-decoration",
    ]},
    {type:'numeric',name:'price',numericValue: [{value:"₹0-₹500",lessThan:500,greaterThan:0},{value:"₹500-₹1000",lessThan:1000,greaterThan:500},{value:"₹1000-₹2500",lessThan:2500,greaterThan:1000},{value:"₹2500-₹5000",lessThan:5000,greaterThan:2500}]},
    {type:'numeric',name:'discountPercentage',numericValue: [{value:"1%-5%",lessThan:5,greaterThan:1},{value:"5%-10%",lessThan:10,greaterThan:5},{value:"10%-15%",lessThan:15,greaterThan:10},{value:"15%-20%",lessThan:20,greaterThan:15}]},
  ],
};

export const fetchProducts = createAsyncThunk(
  "ecomstore/fetchProducts",
  async () => {
    try {
      const res = await fetch("https://dummyjson.com/products");
      const data = await res.json();
      return data.products;
    } catch (err) {
      throw err;
    }
  }
);

export const ecomSlice = createSlice({
  name: "ecomstore",
  initialState,
  reducers: {
    loadUsersFromLocal: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<userType>) => {
      state.users.push(action.payload);
      state.user = action.payload;
    },
    userSignIn: (state, action: PayloadAction<userType>) => {
      state.user = action.payload;
    },
    userSignOut: (state, action) => {
      state.users[action.payload].cart = state.user.cart;
      state.user = {
        name: "",
        password: "",
        role: "",
        email: "",
        cart: [],
      };
    },
    addProductToCart: (state, action: PayloadAction<cartProductType>) => {
      state.user.cart.push(action.payload);
    },
    increaseQuantityInCart: (state, action: PayloadAction<number>) => {
      state.user.cart[action.payload].quantity += 1;
    },
    decreaseQuantityInCart: (state, action: PayloadAction<number>) => {
      state.user.cart[action.payload].quantity -= 1;
    },
    updateQuantityInCart: (state, action: PayloadAction<{index:number,value:number}>) => {
      state.user.cart[action.payload.index].quantity = action.payload.value;
    },
    removeProductFromCart:(state, action: PayloadAction<number>)=>{
      state.user.cart.splice(action.payload,1);
    },
    updateFilteredProducts:(state,action:PayloadAction<cartProductType[]>)=>{
      state.filteredProducts=action.payload
    },
    deleteUser:(state, action: PayloadAction<number>)=>{
      state.users.splice(action.payload,1);
    },
    updateStockInProducts: (state, action: PayloadAction<{index:number,value:number}>) => {
      state.products[action.payload.index].stock = action.payload.value;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts=action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = { found: true, msg: action.error.message! };
      });
  },
});

export const {
  loadUsersFromLocal,
  addUser,
  userSignIn,
  userSignOut,
  addProductToCart,
  increaseQuantityInCart,
  decreaseQuantityInCart,
  updateQuantityInCart,
  removeProductFromCart,
  updateFilteredProducts,
  deleteUser,
  updateStockInProducts
} = ecomSlice.actions;
export default ecomSlice.reducer;
