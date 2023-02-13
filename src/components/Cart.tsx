import { useMemo } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  increaseQuantityInCart,
  decreaseQuantityInCart,
} from "../redux/ecomSlice";

function Cart() {
  const dispatch: AppDispatch = useDispatch();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const ecomState = useAppSelector((store) => store.ecom);

  const subtotal = useMemo(
    () =>
      ecomState.user.cart.reduce(
        (total, ele) => total + ele.quantity * ele.price,
        0
      ),
    [ecomState.user.cart]
  );

  const updateQuantity=(change:string,index:number)=>{
    if(change==='increase'){
    
    dispatch(increaseQuantityInCart(index));
    }
    else if(change==='decrease' && ecomState.user.cart[index].quantity>1){
    dispatch(decreaseQuantityInCart(index));
    }
  }

  return (
    <main>
      <section className="cart d-flex">
        <div className="cart__products">
          {ecomState.user.cart.map((ele, index) => {
            return (
              <div className="cart__product d-flex p-2 gap-2">
                <img
                  className="cart__productpic "
                  src={ele.thumbnail}
                  alt={ele.title}
                />
                <div className="cart__productdetails d-flex flex-column py-2">
                  <h6>{ele.title}</h6>
                  <span className="shorttxt">{ele.brand}</span>
                  <span className="d-flex align-items-center">
                    <span className="shorttxt">Quantity:</span>
                    <span className="d-flex border rounded-2">
                      <button
                        className="border-0"
                        onClick={() => {
                         updateQuantity('decrease',index)
                        }}
                      >
                        -
                      </button>
                      <input
                        className="cart__productdetails__quantitybox shorttxt border-0 text-center"
                        value={ele.quantity}
                        type="text"
                        maxLength={2}
                      />
                      <button
                        className="border-0"
                        onClick={() => {
                          updateQuantity('increase',index)
                        }}
                      >
                        +
                      </button>
                    </span>
                  </span>
                  <span className="shorttxt">
                    ₹{ele.price}{" "}
                    <span className="text-danger vshorttxt">
                      ₹{((ele.discountPercentage * ele.price) / 100).toFixed(2)}{" "}
                      OFF
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="d-flex flex-column">
          <h6>PRICE DETAILS :({ecomState.user.cart.length} items)</h6>
          <span>Subtotal:{subtotal}</span>
          <span>Delivery Fee:₹99</span>
          <span>Total Amount:₹{subtotal + 99}</span>
        </div>
      </section>
    </main>
  );
}

export default Cart;
