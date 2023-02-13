// separate types used for storing users data
export type userType = {
  name: string;
  password: string;
  role: string;
  email: string;
  cart: cartProductType[];
};

export type productType = {
  brand: string;
  category: string;
  description: string;
  discountPercentage: number;
  id: number;
  images: string[];
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  title: string;
};

export type cartProductType = {
  brand: string;
  category: string;
  description: string;
  discountPercentage: number;
  id: number;
  images: string[];
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  title: string;
  quantity: number;
};

export type filterKeysType='brand' | 'category' | 'price' | 'discountPercentage';

export type storeType = {
  products: any[];
  user: userType;
  //   two types combined to store all the data of user in store
  users: userType[];
  loading: boolean;
  error: { found: boolean; msg: string };
  filtersUsed: {type:string,property:string,equalsTo:string,lessThan:number,greaterThan:number}[];
  filteredProducts: productType[];
  filters: {type:string,name:filterKeysType,stringValue?:string[],numericValue?:{value:string,lessThan:number,greaterThan:number}[]}[];
};

export type refSignInpsType = {
  name: HTMLInputElement | null;
  email: HTMLInputElement | null;
  password: HTMLInputElement | null;
  userType:{Customer:HTMLInputElement | null,Admin:HTMLInputElement | null,Manager:HTMLInputElement | null,}
};
