import React, { ChangeEvent, useMemo } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  increaseQuantityInCart,
  decreaseQuantityInCart,
  removeProductFromCart,
  updateQuantityInCart,
} from "../redux/ecomSlice";
import emptyCart from "../assets/emptycart.png";

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

  const updateQuantity = (change: string, index: number) => {
    if (change === "increase") {
      if (ecomState.user.cart[index].quantity < 10) {
        dispatch(increaseQuantityInCart(index));
      } else {
        alert("Maximum quantity per order for a product is 10");
      }
    } else if (change === "decrease") {
      if (ecomState.user.cart[index].quantity > 1) {
        dispatch(decreaseQuantityInCart(index));
      } else {
        dispatch(removeProductFromCart(index));
      }
    }
  };

  const changeQuantityHandler = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let value = e.currentTarget.value;
    if (value === "") {
      dispatch(updateQuantityInCart({ index: index, value: 1 }));
    }
    else if (parseInt(value) <= 10) {
      dispatch(updateQuantityInCart({ index: index, value: parseInt(value) }));
    }
    else if(isNaN(parseInt(value))){
      return
    }
     else {
      alert("Maximum quantity per order for a product is 10");
    }
  };

  return (
    <section className="cart d-flex justify-content-center bg-white my-2 shadow-sm">
      {ecomState.user.cart.length > 0 ? (
        <>
          <div className="cart__products border-end p-2">
            {ecomState.user.cart.map((ele, index) => {
              return (
                <div
                  key={ele.title}
                  className="cart__product d-flex p-2 gap-3 border my-2 rounded-2"
                >
                  <img
                    className="cart__productpic "
                    src={ele.thumbnail}
                    alt={ele.title}
                  />
                  <div className="cart__productdetails d-flex flex-column align-items-start py-2">
                    <h6>{ele.title}</h6>
                    <span className="shorttxt">{ele.brand}</span>
                    <span className="d-flex align-items-center">
                      <span className="shorttxt">Quantity:</span>
                      <span className="d-flex border rounded-2">
                        <button
                          className="border-0"
                          onClick={() => {
                            updateQuantity("decrease", index);
                          }}
                        >
                          -
                        </button>
                        <input
                          className="cart__productdetails__quantitybox shorttxt border-0 text-center"
                          value={ele.quantity}
                          type="text"
                          maxLength={2}
                          onChange={(e) => {
                            changeQuantityHandler(e, index);
                          }}
                        />
                        <button
                          className="border-0"
                          onClick={() => {
                            updateQuantity("increase", index);
                          }}
                        >
                          +
                        </button>
                      </span>
                    </span>
                    <div className="d-flex gap-1 align-items-center">
                    <span className="fw-bold">₹{ele.price}</span><span className="text-seconday text-decoration-line-through shorttxt">₹{(ele.price+((ele.discountPercentage*ele.price)/100)).toFixed()}</span><span className="shorttxt text-danger">({ele.discountPercentage.toFixed()}% OFF)</span>
                  </div>
                    <button className="btn btn-sm px-0 text-danger" onClick={()=>{dispatch(removeProductFromCart(index))}}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cart__pricedetails d-flex flex-column pt-4 ps-4">
            <h6>PRICE DETAILS :({ecomState.user.cart.length} items)</h6>
            <div className="d-flex justify-content-between shorttxt my-1">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="d-flex justify-content-between shorttxt my-1">
              <span>Delivery Fee</span>
              <span>₹99</span>
            </div>
            <div className="d-flex justify-content-between shorttxt mt-1 mb-3 pt-2 border-1 border-top fw-bold">
              <span>Total Amount</span>
              <span>₹{subtotal + 99}</span>
            </div>
            <button className="cart__ctabtn">PLACE ORDER</button>
          </div>
        </>
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img
            className="cart__emptypic mb-2"
            src={emptyCart}
            alt="empty cart pic"
          />
          <span className="fs-4 text-secondary">Your cart is empty :(</span>
          <span className="text-secondary">Go add some products!!</span>
        </div>
      )}
    </section>
  );
}

export default Cart;
