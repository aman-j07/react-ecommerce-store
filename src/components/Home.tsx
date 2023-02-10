import { useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { addProductToCart, increaseQuantityInCart } from "../redux/ecomSlice";
import { AppDispatch, RootState } from "../redux/store";

function Home() {
  const dispatch: AppDispatch = useDispatch();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const ecomState = useAppSelector((store) => store.ecom);
  // const [filteredProducts,setFilteredProducts]=useState([])
  console.log(ecomState);

  const addToCart = (id: number) => {
    let found=false;
    ecomState.user.cart.forEach((ele,i)=>{
      if(ele.id===id){
        found=true;
        dispatch(increaseQuantityInCart(i))
      }
    })
    if(!found){
      let productIndex = ecomState.products.findIndex((ele) => ele.id === id);
      if(productIndex!==-1){
      let product={...ecomState.products[productIndex],quantity:1}
      dispatch(addProductToCart(product))
    }
    }
  };

  const filterProducts=()=>{
    
  }

  return (
    <main>
      <section>
        <ul>

        </ul>
      </section>
      <section className="products">
        {ecomState.products.map((ele) => {
          return (
            <div key={ele.id} className="product border rounded-2 ">
              <img
                className="product__pic"
                src={ele.thumbnail}
                alt={ele.title}
              />
              <div className="product__details card-body">
                <h6 className="product__details__title">{ele.title}</h6>
                <p className="product__details__price shorttxt">
                  ₹{ele.price} {ele.rating}
                </p>
                <button
                  onClick={() => addToCart(ele.id)}
                  className="btn btn-primary"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default Home;
