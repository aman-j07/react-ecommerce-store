import { ChangeEvent, useRef } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  increaseQuantityInCart,
  updateFilteredProducts,
  updateFiltersUsed,
} from "../redux/ecomSlice";
import { AppDispatch, RootState } from "../redux/store";
import { filterKeysType, filtersUsedType } from "../types";
import noResultsFound from "../assets/no-results-found.jpg";
import loader from "../assets/loading.gif";

function Home() {
  const dispatch: AppDispatch = useDispatch();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const ecomState = useAppSelector((store) => store.ecom);
  const refObj = useRef<{ filters: null | HTMLElement }>({ filters: null });

  // fn for adding a product to cart
  const addToCart = (id: number) => {
    // condition to check whether the user is signed in or not
    if (ecomState.user.email === "") {
      alert("Sign In to add products to cart");
    } else {
      let found = false;
      // looping through the cart products of user to check whether the product he wants to add is already in his cart
      ecomState.user.cart.forEach((ele, i) => {
        // condition for product added is already prsesnt nin his cart
        if (ele.id === id) {
          found = true;
          // condition to check whether the product is available in stock
          if (ele.quantity < ele.stock) {
            // allowing maximum 10 quantity of any product to be added to cart
            if (ele.quantity < 10) {
              dispatch(increaseQuantityInCart(i));
            } else {
              alert("Maximum quantity per order for a product is 10");
            }
          } else {
            alert(`Current stock of this product is ${ele.stock}`);
          }
        }
      });
      // condition to add a product to cart when it is not found in cart
      if (!found) {
        let productIndex = ecomState.products.findIndex((ele) => ele.id === id);
        if (productIndex !== -1) {
          let product = { ...ecomState.products[productIndex], quantity: 1 };
          dispatch(addProductToCart(product));
        }
      }
    }
  };

  // fn to filter products according to different aspects
  const filterProducts = (
    e: ChangeEvent<HTMLInputElement>,
    filterName: filterKeysType,
    filterValue: string,
    lessThan: number = 0,
    greaterThan: number = 0
  ) => {
    // making a deep copy of filterobject from redux store
    let filterObj: filtersUsedType = JSON.parse(
      JSON.stringify(ecomState.filtersUsed)
    );

    // checking whether the input checkbox is cheked or not 
    let isChecked = e.currentTarget.checked;
    if (isChecked) {
      // if filter value is of string type then it is pushed in respective key of filters object in redux store 
      if (filterName === "brand" || filterName === "category") {
        filterObj[filterName].push(filterValue);
      } else if (
        // if filter value is of integer type then an object containing minimum and maximum value is pushed in respective key of filters object in redux store
        filterName === "price" ||
        filterName === "discountPercentage"
      ) {
        filterObj[filterName].push({ minimum: greaterThan, maximum: lessThan });
      }
    } else {
      // this scope handles unchecking of a filter
      let deleteIndex = -1;
      // finding index of purticular filter within the filter object
      if (filterName === "brand" || filterName === "category") {
        deleteIndex = filterObj[filterName].indexOf(filterValue);
      } else if (
        filterName === "price" ||
        filterName === "discountPercentage"
      ) {
        deleteIndex = filterObj[filterName].findIndex(
          (ele: any) => ele.minimum === greaterThan && ele.maximum === lessThan
        );
      }
      deleteIndex >= 0 && filterObj[filterName].splice(deleteIndex, 1);
    }

    dispatch(updateFiltersUsed(filterObj));

    // using filter method to get the required products according to the filters selected
    let filteredProducts = ecomState.products.filter((ele) => {
      return (
        (filterObj.brand.length === 0 || filterObj.brand.includes(ele.brand)) &&
        (filterObj.category.length === 0 ||
          filterObj.category.includes(ele.category)) &&
        (filterObj.price.find(
          (item) => item.minimum < ele.price && item.maximum > ele.price
        ) ||
          filterObj.price.length === 0) &&
        (filterObj.discountPercentage.find(
          (item) =>
            item.minimum < ele.discountPercentage &&
            item.maximum > ele.discountPercentage
        ) ||
          filterObj.discountPercentage.length === 0)
      );
    });
    dispatch(updateFilteredProducts(filteredProducts));
  };

  // fn to handle searching of products
  const search = (e: ChangeEvent<HTMLInputElement>) => {
    let searched = e.currentTarget.value;
    // using filter method to match brand,category or title with searched value
    let results = ecomState.products.filter((ele) => {
      return (
        ele.brand.toLowerCase().search(searched.toLowerCase()) !== -1 ||
        ele.category.toLowerCase().search(searched.toLowerCase()) !== -1 ||
        ele.title.toLowerCase().search(searched.toLowerCase()) !== -1
      );
    });
    dispatch(updateFilteredProducts(results));
  };

  const sort = (e: ChangeEvent<HTMLSelectElement>) => {
    // using value of selected option to identify the order-(ascending or descending) and the aspect-(price,discount or rating)
    let value = e.currentTarget.value;
    let property = value.slice(0, value.indexOf("-"));
    let sortOrder = value.slice(value.indexOf("-") + 1);
    let results = [...ecomState.products];
    if (sortOrder === "ascending") {
      results.sort((a, b) => a[property] - b[property]);
    } else if (sortOrder === "descending") {
      results.sort((a, b) => b[property] - a[property]);
    }
    dispatch(updateFilteredProducts(results));
  };

  return (
    <main className="home d-flex align-items-start position-relative">
      <aside
        ref={(ele) => (refObj.current!.filters = ele)}
        className="home__filters bg-white p-4 "
      >
        <h4 className="fw-light">FILTERS</h4>
        {ecomState.filters.map((ele) => {
          return (
            <ul className="home__filterlists" key={ele.name}>
              <li className="text-uppercase fw-bold">{ele.name}</li>
              {ele.type === "string"
                ? ele.stringValue!.map((listItem) => {
                    return (
                      <li key={listItem}>
                        <input
                          className="mx-2"
                          onChange={(e) => {
                            filterProducts(e, ele.name, listItem);
                          }}
                          type="checkbox"
                        />
                        {listItem}
                      </li>
                    );
                  })
                : ele.numericValue!.map((listItem) => {
                    return (
                      <li key={listItem.value}>
                        <input
                          className="mx-2"
                          onChange={(e) => {
                            filterProducts(
                              e,
                              ele.name,
                              "",
                              listItem.lessThan,
                              listItem.greaterThan
                            );
                          }}
                          type="checkbox"
                        />
                        {listItem.value}
                      </li>
                    );
                  })}
            </ul>
          );
        })}
      </aside>
      <section className="productsarea flex-grow-1 px-3">
        <div className="productsarea__features my-1 my-sm-4 d-flex flex-sm-row flex-column gap-2">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white border-end-0 rounded-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 p-2 rounded-0"
              placeholder="Search for products, brands and more."
              onChange={(e) => search(e)}
            />
          </div>
          <div className="d-flex gap-2 flex-grow-1">
            <select
              className="form-select rounded-0 py-2 shadow-sm"
              onChange={(e) => {
                sort(e);
              }}
            >
              <option hidden>Sort By</option>
              <option value="price-descending">Price:High to Low</option>
              <option value="price-ascending">Price:Low to High</option>
              <option value="rating-descending">Rating:High to Low</option>
              <option value="rating-ascending">Rating:Low to High</option>
              <option value="discountPercentage-descending">
                Discount:High to Low
              </option>
              <option value="discountPercentage-ascending">
                Discount:Low to High
              </option>
            </select>
            <button
              className="bg-white d-sm-none border shadow-sm rounded-0 d-flex gap-2 align-items-center px-2"
              onClick={() => {
                refObj.current.filters!.classList.toggle(
                  "home__filters--hidden"
                );
              }}
            >
              Filters <i className="bi bi-funnel-fill"></i>
            </button>
          </div>
        </div>
        {ecomState.loading ? (
          <span className="fs-4 d-flex justify-content-center gap-1">
            <span>Loading</span>
            <img className="loader" src={loader} alt="loading gif" />
          </span>
        ) : ecomState.filteredProducts.length > 0 ? (
          <section className="products my-2">
            {ecomState.filteredProducts.map((ele) => {
              return (
                <div
                  key={ele.id}
                  className="product d-flex flex-column align-items-center border rounded-2 "
                >
                  <img
                    className="product__pic"
                    src={ele.thumbnail}
                    alt={ele.title}
                  />
                  <span className="product__rating shorttxt fw-bold bg-white px-1 rounded-1">
                    {ele.rating}
                    <i className="bi bi-star-fill ms-1"></i>
                  </span>
                  <div className="product__details card-body w-100 d-flex gap-2 flex-column justify-content-between">
                    <h6 className="product__details__title my-1">
                      {ele.title}
                    </h6>
                    <span className="shorttxt">by {ele.brand}</span>
                    <div className="product__details__price d-flex gap-1 align-items-center">
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
                    {ele.stock > 0 ? (
                      <button
                        onClick={() => addToCart(ele.id)}
                        className="product__btncta border-0 py-2 shorttxt"
                      >
                        ADD TO CART
                      </button>
                    ) : (
                      <button className="btn-warning text-white fw-bold border-0 py-2 shorttxt">
                        OUT OF STOCK
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          <div className="bg-white text-center vh-100">
            <img className="my-4" src={noResultsFound} alt="no results pic" />
            <h4>Sorry! No results found :(</h4>
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
