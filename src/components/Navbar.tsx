import { useEffect } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts, loadUsersFromLocal, userSignIn,userSignOut } from "../redux/ecomSlice";
import { AppDispatch, RootState } from "../redux/store";

function Navbar() {
  const dispatch:AppDispatch=useDispatch()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const ecomState = useAppSelector((store) => store.ecom);

  useEffect(() => {
    dispatch(fetchProducts());
    let user=localStorage.getItem('ecomstore-user')
    let users=localStorage.getItem('ecomstore-users')
    user!==null && dispatch(userSignIn(JSON.parse(user)))
    users!==null && dispatch(loadUsersFromLocal(JSON.parse(users)))
  }, []);

  const signOut=()=>{
    let userIndex=ecomState.users.findIndex(ele=>ele.email===ecomState.user.email)
    dispatch(userSignOut(userIndex))
    localStorage.removeItem('ecomstore-user')
  }

  useEffect(()=>{
    localStorage.setItem('ecomstore-user',JSON.stringify(ecomState.user));
  },[ecomState.user])

  console.log(useAppSelector(store=>store.ecom));

  return (
    <header className="shadow">
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-shop"></i>
            <span>OneStopShop</span>
          </Link>
            <ul className="list-style-none">
              <li>
                {(ecomState.user.role === "Customer") ? (
                  <Link className="text-decoration-none" to="cart">
                    Cart
                  </Link>
                ) : (
                  <Link to="dashboard">Dashboard</Link>
                )}
              </li>
              <li>
                {ecomState.user.email==='' ? (
                  <Link to="signupin">Sign In</Link>
                ) : (
                  <button onClick={signOut} className="btn btn-link">SignOut</button>
                )}
              </li>
            </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;