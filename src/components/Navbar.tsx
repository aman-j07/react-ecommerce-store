import { useEffect } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchProducts,
  loadUsersFromLocal,
  userSignIn,
  userSignOut,
} from "../redux/ecomSlice";
import { AppDispatch, RootState } from "../redux/store";

function Navbar() {
  const dispatch: AppDispatch = useDispatch();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const ecomState = useAppSelector((store) => store.ecom);
  const navigate=useNavigate();

  useEffect(() => {
    dispatch(fetchProducts());
    let user = localStorage.getItem("ecomstore-user");
    let users = localStorage.getItem("ecomstore-users");
    user !== null && dispatch(userSignIn(JSON.parse(user)));
    users !== null && dispatch(loadUsersFromLocal(JSON.parse(users)));
  }, []);

  const signOut = () => {
    let userIndex = ecomState.users.findIndex(
      (ele) => ele.email === ecomState.user.email
    );
    dispatch(userSignOut(userIndex));
    navigate('/')
    localStorage.removeItem("ecomstore-user");
  };

  useEffect(() => {
    localStorage.setItem("ecomstore-user", JSON.stringify(ecomState.user));
  }, [ecomState.user]);

  useEffect(() => {
    localStorage.setItem("ecomstore-users", JSON.stringify(ecomState.users));
  }, [ecomState.users]);

  console.log(useAppSelector((store) => store.ecom));

  return (
    <header className="header border border-bottom position-sticky top-0">
      <nav className="navbar navbar-light bg-white py-3">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-shop"></i>
            <span>OneStopShop</span>
          </Link>
          <ul className="list-unstyled d-flex align-items-center gap-3 mb-0">
            {ecomState.user.email !== "" &&
              (ecomState.user.role === "Customer" ? (
                <li>
                  <Link className="text-decoration-none text-dark position-relative" to="cart">
                  <span>Cart</span><i className="bi bi-cart ms-1 fs-5"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger">{ecomState.user.cart.length>0 && ecomState.user.cart.length}</span>
                  </Link>
                </li>
              ) : (
                <li>
                  <Link className="text-decoration-none text-dark" to="dashboard">
                    Dashboard
                  </Link>
                </li>
              ))}

            <li>
              {ecomState.user.email === "" ? (
                <Link className="text-decoration-none text-dark" to="signupin">
                  Sign In/Up
                </Link>
              ) : (
                <button
                  onClick={signOut}
                  className="btn p-0 text-decoration-none text-dark"
                >
                  SignOut<i className="bi bi-box-arrow-right ms-1 fs-5"></i>
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
