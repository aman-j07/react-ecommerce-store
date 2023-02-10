import React, {useRef, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser, userSignIn } from "../redux/ecomSlice";
import { RootState } from "../redux/store";
import { refSignInpsType,userType } from "../types";

function SignUpIn() {
  const [state, setState] = useState({
    btnValue: "signUp",
    formErrors: { name: "", email: "", password: "" },
  });
  const [msg,setMsg]=useState({ type: "", value: "" })

  const refSignInps = useRef<refSignInpsType>({
    name: null,
    email: null,
    password: null,
  });

  const dispatch = useDispatch();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const ecomState = useAppSelector((store) => store.ecom);
  const navigate = useNavigate();

  const signUp = (e: React.FormEvent<HTMLFormElement>) => {
    let objErrors={name:'',email:'',password:''}
    let email=refSignInps.current.email!.value
    let userExists=ecomState.users.find((ele)=>ele.email===email)
    if(userExists!==undefined){
      setMsg({type:'danger',value:'User already exists! Sign In.'});
      return
    }
    // ternary conditions are used for reseting error values in objErrors object for each input
    objErrors.name = refSignInps.current.name!.value.match(
      /^[A-Za-z]+([\ A-Za-z]+)*/
    )
      ? ""
      : "Enter a valid name.";
    state.formErrors.email = refSignInps.current.email!.value.match(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    )
      ? ""
      : "Enter a valid email id";
    objErrors.password = refSignInps.current.password!.value.match(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
    )
      ? ""
      : "Password must contain minimum 8 characters with minimum 1 lowercase,uppercase,number and a special character.";
    // every method is used to check for any non-empty values in objError object
    let noErrorExists = Object.values(objErrors).every((ele) => ele === "");
    if (noErrorExists) {
      let user: userType = {
        name: refSignInps.current.name!.value,
        email: refSignInps.current.email!.value,
        password: refSignInps.current.password!.value,
        role: "Customer",
        cart: [],
      };
      dispatch(addUser(user));
      setMsg({ type: "success", value: "Sign Up successful!" });
      // localStorage.setItem("ecomstore-user", JSON.stringify(user));
      localStorage.setItem('ecomstore-users',JSON.stringify([...ecomState.users,user]))
      e.currentTarget.reset();
      navigate('/')
    }
    setState({ ...state, formErrors:objErrors });
  };

  const signIn = (e: React.FormEvent<HTMLFormElement>) => {
    let email = refSignInps.current.email!.value;
    let password=refSignInps.current.password!.value;
    let found = ecomState.users.find((ele) => ele.email === email);
    if (found !== undefined) {
      if(found.password===password){
        setMsg({value:'Sign In successful',type:'success'})
        // localStorage.setItem("ecomstore-user", JSON.stringify(found));
        dispatch(userSignIn(found))
      navigate('/')
      }
      else{
        setMsg({value:'Password did not match!',type:'danger'})
      }
    } else {
      setMsg({value:'User Not found!',type:'danger'})
    }
  };

  return (
    <div className="signupin mx-auto card p-4 my-4 border-0">
      {msg.value!==''&&<span className={`alert alert-${msg.type} shorttxt`} role="alert">{msg.value}</span>}
      <h4 className="card-title">
        {state.btnValue === "signUp" ? "Sign Up" : "Sign In"}
      </h4>
      <form
        className="mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          state.btnValue === "signUp" ? signUp(e) : signIn(e);
        }}
      >
        {state.btnValue === "signUp" && (
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              ref={(ele) => (refSignInps.current.name = ele)}
              type="text"
              className="form-control"
              required
            />
            <span className="text-danger shorttxt">
              {state.formErrors.name}
            </span>
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            ref={(ele) => (refSignInps.current.email = ele)}
            type="email"
            className="form-control"
            required
          />
          <span className="text-danger shorttxt">{state.formErrors.email}</span>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            ref={(ele) => (refSignInps.current.password = ele)}
            type="password"
            className="form-control"
            required
          />
          <span className="text-danger shorttxt lh-sm d-block">
            {state.formErrors.password}
          </span>
        </div>
        <button className="btn btn-primary w-100" type="submit">
          {state.btnValue === "signUp" ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <span className="d-flex align-items-center mt-3">
        {state.btnValue === "signUp" ? "Already have an account?" : "New user?"}
        <button
          className="border-0 bg-transparent btn-link py-0 px-1"
          onClick={() => {
            state.btnValue === "signUp"
              ? setState({ ...state, btnValue: "signIn" })
              : setState({ ...state, btnValue: "signUp" });
          }}
        >
          {state.btnValue === "signUp" ? "Sign In" : "Sign Up"}
        </button>
      </span>
    </div>
  );
}

export default SignUpIn;
