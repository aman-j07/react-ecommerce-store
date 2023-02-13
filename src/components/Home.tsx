import { ChangeEvent } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  increaseQuantityInCart,
  updateFilteredProducts,
} from "../redux/ecomSlice";
import { AppDispatch, RootState } from "../redux/store";
import { filterKeysType } from "../types";

let filterObj: {
  brand: string[];
  category: string[];
  price: { minimum: number; maximum: number }[];
  discountPercentage: { minimum: number; maximum: number }[];
} = { brand: [], category: [], price: [], discountPercentage: [] };
let filteredProducts: any[] = [];
function Home() {
  const dispatch: AppDispatch = useDispatch();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const ecomState = useAppSelector((store) => store.ecom);
  console.log(ecomState);
  // filterArr=ecomState.filtersUsed;

  const addToCart = (id: number) => {
    let found = false;
    ecomState.user.cart.forEach((ele, i) => {
      if (ele.id === id) {
        found = true;
        dispatch(increaseQuantityInCart(i));
      }
    });
    if (!found) {
      let productIndex = ecomState.products.findIndex((ele) => ele.id === id);
      if (productIndex !== -1) {
        let product = { ...ecomState.products[productIndex], quantity: 1 };
        dispatch(addProductToCart(product));
      }
    }
  };

  const filterProducts = (
    e: ChangeEvent<HTMLInputElement>,
    filterType: string,
    filterName: filterKeysType,
    filterValue: string,
    lessThan: number = 0,
    greaterThan: number = 0
  ) => {
    let isChecked = e.currentTarget.checked;
    if (isChecked) {
      if (filterName === "brand" || filterName === "category") {
        filterObj[filterName].push(filterValue);
      } else if (
        filterName === "price" ||
        filterName === "discountPercentage"
      ) {
        filterObj[filterName].push({ minimum: greaterThan, maximum: lessThan });
      }
    } else {
      let deleteIndex = -1;
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
    console.log(filterObj);

    filteredProducts = [];

    // ecomState.products.forEach(ele=>{
    //   let matched=false;
    //   let counter=0;
    //   Object.keys(filterObj).forEach((key)=>{
    //     let filterArr=filterObj[key];
    //     filterArr.forEach((filter:any)=>{
    //       if(filter.type==='string'){
    //         if(ele[filter.property]===filter.equalsTo){
    //           matched=true;
    //         }
    //       }
    //       else if(filter.type==='numeric'){
    //         if(ele[filter.property]<filter.lessThan && ele[filter.property]>=filter.greaterThan){
    //           matched=true;
    //         }
    //       }
    //     })
    //     if(matched){
    //       counter++;
    //     }
    //   })
    //   console.log(counter)
    //   if(counter===4){
    //     filteredProducts.push(ele)
    //   }
    // })
    console.log(filterObj);
    console.log(filteredProducts);
  };

  const search = (e: ChangeEvent<HTMLInputElement>) => {
    let searched = e.currentTarget.value;
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
    let value = e.currentTarget.value;
    let property = value.slice(0, value.indexOf("-"));
    let sortOrder = value.slice(value.indexOf("-") + 1);
    let results = [...ecomState.products];
    if (sortOrder === "ascending") {
      results.sort((a, b) => a[property] - b[property]);
    } else if (sortOrder === "descending") {
      results.sort((a, b) => b[property] - a[property]);
    }
    dispatch(updateFilteredProducts(results))
  };

  return (
    <main className="home d-flex">
      <section className="home__filters bg-white p-4">
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
                            filterProducts(e, ele.type, ele.name, listItem);
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
                              ele.type,
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
      </section>
      <section className="productsarea flex-grow-1 px-3">
        <div className="productsarea__searchsort my-4 d-flex gap-2 align-items-center">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 p-2"
              placeholder="Search for products, brands and more."
              onChange={(e) => search(e)}
            />
          </div>
          <select
            className="form-select rounded-0"
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
        </div>
        <section className="products my-2">
          {ecomState.filteredProducts.map((ele) => {
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
      </section>
    </main>
  );
}

export default Home;
