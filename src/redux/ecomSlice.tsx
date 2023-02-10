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
  loading:false,
  error:{found:false,msg:''}
};

export const fetchProducts = createAsyncThunk(
  "ecomstore/fetchProducts",
  async () => {
    try{
      const res=await fetch("https://dummyjson.com/products")
      const data=await res.json()
      return data.products;
    }
    catch(err){
      throw err
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
    userSignOut: (state,action) => {
      state.users[action.payload].cart=state.user.cart;
      state.user = {
        name: "",
        password: "",
        role: "",
        email: "",
        cart: [],
      };
    },
    addProductToCart:(state,action:PayloadAction<cartProductType>)=>{
      state.user.cart.push(action.payload)
    },
    increaseQuantityInCart:(state,action:PayloadAction<number>)=>{
      state.user.cart[action.payload].quantity+=1
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading=true
    })
    .addCase(fetchProducts.fulfilled,(state,action)=>{
      state.loading=false
      state.products=action.payload
    })
    .addCase(fetchProducts.rejected,(state,action)=>{
      state.loading=false
      state.error={found:true,msg:action.error.message!}
    })
  },
});

export const { loadUsersFromLocal, addUser, userSignIn, userSignOut,addProductToCart,increaseQuantityInCart } =
  ecomSlice.actions;
export default ecomSlice.reducer;
