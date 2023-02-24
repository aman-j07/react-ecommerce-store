import { ChangeEvent } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { deleteUser, updateStockInProducts } from "../redux/ecomSlice";
import { AppDispatch, RootState } from "../redux/store";

function Dashboard() {
  const dispatch: AppDispatch = useDispatch();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const ecomState = useAppSelector((store) => store.ecom);

  // fn to handle any change in quantity of products
  const changeQuantityHandler = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let value = e.currentTarget.value;
    // condition to ensure if the value is a number then only rquired action is dispatched to update the state
    if (value === "") {
      dispatch(updateStockInProducts({ index: index, value: 0 }));
    } else if (isNaN(parseInt(value))) {
      return;
    } else {
      dispatch(updateStockInProducts({ index: index, value: parseInt(value) }));
    }
  };

  return (
    <div className="dashboard m-4 bg-white p-4 shadow">
      {ecomState.user.role === "Admin" ? (
        <>
          <h4>Users Table</h4>
          <table className="table tab--users">
            <thead className="bg-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ecomState.users.map((ele, index) => {
                return (
                  ele.role !== "Admin" && (
                    <tr key={ele.email}>
                      <td>{ele.name}</td>
                      <td>{ele.email}</td>
                      <td>{ele.password}</td>
                      <td>{ele.role}</td>
                      <td>
                        <button
                          className="btn text-danger p-0 "
                          onClick={() => {
                            dispatch(deleteUser(index));
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h4>Products Table</h4>
          <table className="table tab--products text-center">
            <thead className="bg-light">
              <tr>
                <th>Id</th>
                <th>Image</th>
                <th>Title</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {ecomState.products.map((ele, index) => {
                return (
                  <tr key={ele.id}>
                    <td>{ele.id}</td>
                    <td>
                      <img
                        className="tab--products__prodpic"
                        src={ele.thumbnail}
                        alt={ele.title}
                      />
                    </td>
                    <td>{ele.title}</td>
                    <td>{ele.brand}</td>
                    <td>{ele.category}</td>
                    <td>{ele.price}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        maxLength={4}
                        onChange={(e) => {
                          changeQuantityHandler(e, index);
                        }}
                        value={ele.stock}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Dashboard;
