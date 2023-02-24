import { ChangeEvent, useMemo, useRef } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  increaseQuantityInCart,
  decreaseQuantityInCart,
  removeProductFromCart,
  updateQuantityInCart,
  orderPlaced,
} from "../redux/ecomSlice";
import emptyCart from "../assets/emptycart.png";
import ReactToPrint from "react-to-print";

function Cart() {
  const dispatch: AppDispatch = useDispatch();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const ecomState = useAppSelector((store) => store.ecom);
  const refPrintArea = useRef<HTMLDivElement>(null);

  // useMemo hook used to calculate sum of all the products in cart
  const subtotal = useMemo(
    () =>
      ecomState.user.cart.reduce(
        (total, ele) => total + ele.quantity * ele.price,
        0
      ),
    [ecomState.user.cart]
  );

  // fn to change any product's quantity in cart
  const updateQuantity = (change: string, index: number) => {
    if (change === "increase") {
      if (
        ecomState.user.cart[index].stock > ecomState.user.cart[index].quantity
      ) {
        if (ecomState.user.cart[index].quantity < 10) {
          dispatch(increaseQuantityInCart(index));
        } else {
          alert("Maximum 10 pieces of product can be added in cart at a time");
        }
      }
      else{
        alert(`No more stock available for this product`);
      }
    } else if (change === "decrease") {
      if (ecomState.user.cart[index].quantity > 1) {
        dispatch(decreaseQuantityInCart(index));
      } else {
        dispatch(removeProductFromCart(index));
      }
    }
  };

  // fn to handle any change in quantity of cart products
  const changeQuantityHandler = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let value = e.currentTarget.value;
    if (value === "") {
      dispatch(updateQuantityInCart({ index: index, value: 1 }));
    } else if (parseInt(value) <= 10) {
      dispatch(updateQuantityInCart({ index: index, value: parseInt(value) }));
    } else if (isNaN(parseInt(value))) {
      return;
    } else {
      alert("Maximum quantity per order for a product is 10");
    }
  };

  // fn to update quantities in stock after order is placed
  const afterOrderPlaced=()=>{
    let products:any[]=JSON.parse(JSON.stringify(ecomState.products));
    ecomState.user.cart.forEach(cartItem=>{
      let index=products.findIndex(prodItem=>cartItem.id===prodItem.id)
      products[index].stock-=cartItem.quantity;
    })
    dispatch(orderPlaced(products));
  }

  return (
    <>
      <section className="cart d-flex flex-wrap justify-content-center bg-white my-2 shadow-sm pb-2">
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
                        <span className="fw-bold">₹{ele.price}</span>
                        <span className="text-seconday text-decoration-line-through shorttxt">
                          ₹
                          {(
                            (ele.price * 100) /
                            (100 - ele.discountPercentage)
                          ).toFixed()}
                        </span>
                        <span className="shorttxt text-danger">
                          ({ele.discountPercentage.toFixed()}% OFF)
                        </span>
                      </div>
                      <button
                        className="btn btn-sm px-0 text-danger"
                        onClick={() => {
                          dispatch(removeProductFromCart(index));
                        }}
                      >
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
              <ReactToPrint
                trigger={() => (
                  <button className="cart__ctabtn">PLACE ORDER</button>
                )}
                content={() => refPrintArea.current}
                onAfterPrint={afterOrderPlaced}
              />
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
      <div ref={refPrintArea} className="p-2 printbill">
        <div className="bg-white p-4">
          <header className="d-flex justify-content-between border-2 border-dark border-bottom">
            <h4>
              <i className="bi bi-shop"></i>
              <span>OneStopShop</span>
            </h4>
            <ul className="list-unstyled">
              <li className="d-flex gap-1">
                <span className="fw-bold">Phone</span>:
                <span className="shorttxt">######</span>
              </li>
              <li className="d-flex gap-1">
                <span className="fw-bold">Address</span>:
                <span className="shorttxt">
                  lorem ipsum, Lorem ipsum, <br />
                  dolor sit.
                </span>
              </li>
            </ul>
          </header>
          <table className="table p-2 my-4">
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Brand</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {ecomState.user.cart.map((ele) => {
                return (
                  <tr key={ele.id}>
                    <td>{ele.id}</td>
                    <td>{ele.title}</td>
                    <td>{ele.brand}</td>
                    <td>{ele.description}</td>
                    <td>₹{ele.price}</td>
                    <td>{ele.quantity}</td>
                    <td>₹{ele.quantity * ele.price}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={7} className="fw-bold text-end fs-6">
                  Shipping Charges: ₹99
                </td>
              </tr>
              <tr>
                <td colSpan={7} className="fw-bold text-end fs-4">
                  Total: ₹{subtotal + 99}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Cart;
