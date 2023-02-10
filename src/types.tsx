// separate types used for storing users data
export type userType = {
  name: string;
  password: string;
  role: "Customer" | "Admin" | "Manager" | "";
  email: string;
  cart: cartProductType[];
};

export type productType={
  brand:string
  category:string
  description:string
  discountPercentage:number
  id:number
  images:string[]
  price:number
  rating:number
  stock:number
  thumbnail:string
  title:string
}

export type cartProductType={
  brand:string
  category:string
  description:string
  discountPercentage:number
  id:number
  images:string[]
  price:number
  rating:number
  stock:number
  thumbnail:string
  title:string
  quantity:number
}

export type storeType = {
  products: productType[];
  user: userType;
  //   two types combined to store all the data of user in store
  users: userType[];
  loading:boolean
  error:{found:boolean,msg:string}
};

export type refSignInpsType = {
  name: HTMLInputElement | null;
  email: HTMLInputElement | null;
  password: HTMLInputElement | null;
};
