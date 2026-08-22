import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { getProductByIdApi, getAllCategoryApi, createOrderApi } from "../../Apis/Api";
import MyRating from "../component/Rating";
import ImageGallery from "./ImageGallery";
import { addToCart } from "../store/cartSlice";
import GetNewProduct from "../Home/product/GetNewProduct";
import whatsapp from "../../assets/icons/whatsapp.png"
import TotalRating from "../component/TotalRating";
import { useSelector } from "react-redux";


const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [count, setCount] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const tax = 200;
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingOption, setShippingOption] = useState('');
  const [shippingCharge, setShippingCharge] = useState(0);
  // Step 1: State to control popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Step 2: Function to open the popup
  const openPopup = () => setIsPopupOpen(true);
  const [inlineMessage, setInlineMessage] = useState("");

  // Step 3: Function to close the popup
  const closePopup = () => setIsPopupOpen(false);
  const { cart } = useSelector((state) => state.cartReducer);


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleShippingOptionChange = (e) => {
    const selectedOption = e.target.value;
    setShippingOption(selectedOption);

    // Set shipping charge based on the option
    if (selectedOption === "inside-valley") {
      setShippingCharge(120);
    } else if (selectedOption === "outside-valley") {
      setShippingCharge(170);
    } else {
      setShippingCharge(0); // Default
    }
  };
  useEffect(() => {
    // Fetch categories and product data
    const fetchCategoriesAndProduct = async () => {
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          // Fetch categories (assuming a function to fetch categories)
          getAllCategoryApi(),
          getProductByIdApi(id),
        ]);

        if (categoryResponse.status === 200) {
          setCategories(categoryResponse.data.categories || []);
        } else {
          toast.error("Failed to fetch categories.");
        }

        if (productResponse.status === 200) {
          setProduct(productResponse.data.product);
        } else {
          toast.error("Failed to fetch product.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCategoriesAndProduct();
  }, [id]);

  const increment = () => {
    const selectedStock = availableSizes
      .find((size) => size.size === selectedSize)
      ?.colors.find((color) => color.color === selectedColor)?.quantity || 0;

    if (count < selectedStock) {
      setCount(count + 1);
    } else {
      toast.error("No more quantity available for the selected size and color.", { position: "top-right" });
    }
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  const handleAddToCart = () => {
    const selectedStock = availableSizes
      .find((size) => size.size === selectedSize)
      ?.colors.find((color) => color.color === selectedColor)?.quantity || 0;

    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color", { position: "top-right" });
      return;
    }

    if (selectedStock === 0) {
      setInlineMessage("Selected color is out of stock.");
      return;
    }

    if (count > selectedStock) {
      setInlineMessage("Quantity exceeds available stock.");
      return;
    }

    if (count === selectedStock) {
      setInlineMessage("You have selected the maximum available quantity.");
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      images: product.images,
      discountedPrice: product.discountedPrice,
      quantity: count,
      category: product.category,
      productImage: product.productImage,
      size: selectedSize,
      color: selectedColor,
    };

    dispatch(addToCart(cartItem));
    toast.success("Added to cart successfully!", { position: "top-right", autoClose: 3000 });
  };


  if (!product || !categories.length) return <div>Loading...</div>;

  const totalPrice = (product.price || 0) * count + tax;
  const availableSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const selectedStock = availableSizes
    .find((size) => size.size === selectedSize)
    ?.colors.find((color) => color.color === selectedColor)?.quantity || 0;
  // Map category IDs to category names
  const categoryMap = categories.reduce((map, { _id, name }) => {
    map[_id] = name;
    return map;
  }, {});
  const handleBuyNowClick = () => {
    const selectedStock = availableSizes
      .find((size) => size.size === selectedSize)
      ?.colors.find((color) => color.color === selectedColor)?.quantity || 0;

    if (!selectedSize) {
      toast.error("Please select a size", { position: "top-right" });
      return;
    }

    if (!selectedColor) {
      toast.error("Please select a color", { position: "top-right" });
      return;
    }

    if (selectedStock === 0) {
      toast.error("Selected color is out of stock.");
      return;
    }

    setIsModalOpen(true);
  };


  const handleCancelClick = () => {
    setIsModalOpen(false);
  };

  const handleBuyClick = async () => {
    if (!shippingOption) {
      toast.error("Please select a shipping option.", { position: "top-right" });
      return;
    }

    // Other existing validations
    if (!shippingAddress.trim()) {
      toast.error("Please enter a valid shipping address.", { position: "top-right" });
      return;
    }

    if (!phone.trim()) {
      toast.error("Please enter a valid phone number.", { position: "top-right" });
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be 10 digits and contain only numbers.", { position: "top-right" });
      return;
    }

    if (!user?.id) {
      toast.error("User is not logged in. Please log in first.");
      return;
    }

    const totalAmount = count * product.discountedPrice;
    const totalPriceWithShipping = totalAmount + shippingCharge;

    const orderData = {
      userId: user.id,
      items: {
        productId: product._id,
        name: product.name,
        sizes: selectedSize,
        colors: selectedColor,
        images: product.images,
        quantity: count,
        discountedPrice: product.discountedPrice,
      },
      phone,
      shippingAddress,
      totalAmount,
      shippingCharge,
      totalPriceWithShipping,
      status: "pending",
    };

    console.log("orderData: ", orderData);

    try {
      const response = await createOrderApi(orderData);
      toast.success(response.data.message || "Order placed successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        error.response?.data?.message || "Failed to place order. Please try again."
      );
    }
  };

  // Get category name using the category ID from the product
  const categoryName = categoryMap[product.category];

  //

  return (
    <>
      <div className="container lg:mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-10">
          <div className="font-3xl font-bold lg:hidden block px-5">{product.name}</div>
          <ImageGallery images={product.images} />
          <div className="p-5 pr-5 lg:pr-[150px]">
            {/* Display the category name here */}
            <div className="font-medium">{categoryName}</div>
            <h1 className="font-medium">{product.name}</h1>
            <TotalRating
              productId={product._id}
              averageRating={product.averageRating}
            />
            <button
              onClick={openPopup}
              className="underline hover:text-red-500">
              Rate Product
            </button>

            {/* Custom Popup */}
            {isPopupOpen && (
              <div className="popup-overlay">
                <div className="popup-box">
                  {/* Close button */}




                  <MyRating
                    productId={product._id}
                    userId={user?._id}
                    myRating={product.ratings.rating}
                  />
                </div>
              </div>
            )}            <div className="pt-5">
              <span className="text-lg text-red-600 font-bold">Rs. {product.discountedPrice}</span>
              <br />
              <span className="text-sm text-gray-500 line-through mr-2 ">Rs. {product.fakePrice}</span>
            </div>


            <p className="font-thin pb-5">{product.description}</p>
            <hr />
            <div className="text-green-400 pt-2">In Stock</div>
            <p className="font-thin pb-5">{product.color}</p>

            {/* Size Selector */}
            <label className="font-medium">Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(e.target.value);
                setSelectedColor("");
                setCount(1);
              }}
              className="border p-2 ml-2"
            >
              <option value="">Select Size</option>
              {availableSizes.map((sizeObj, index) => (
                <option key={index} value={sizeObj.size}>
                  {sizeObj.size}
                </option>
              ))}
            </select>

            {/* Color Selector */}
            {selectedSize && (
              <div className="mt-4">
                <label className="font-medium">Color:</label>
                <select
                  value={selectedColor}
                  onChange={(e) => {
                    setSelectedColor(e.target.value);
                    setCount(1);
                  }}
                  className="border p-2 ml-2"
                >
                  <option value="">Select Color</option>
                  {availableSizes
                    .find((size) => size.size === selectedSize)?.colors.map((color, idx) => (
                      <option key={idx} value={color.color}>
                        {color.color}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>Quantity:</div>
            <div className="grid grid-cols-3 gap-5 mt-3">
              <div className="flex items-center space-x-4">
                <button onClick={decrement} className="bg-gray-100 p-4 py-2 w-12">-</button>
                <span className="text-xl">{count}</span>
                <button
                  onClick={increment}
                  className={`bg-gray-100 p-4 py-2 w-12 ${count >= selectedStock ? "cursor-not-allowed opacity-50" : ""}`}
                  disabled={count >= selectedStock}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`border px-5 py-3 w-full col-span-2 hover:bg-[#AB3430] hover:text-white ${selectedStock === 0 ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={selectedStock === 0}
              >
                Add to cart
              </button>
            </div>
            {inlineMessage && (
              <div className="text-red-500 text-center mt-3">{inlineMessage}</div>
            )}
            <button
              className={`bg-[#AB3430] text-white px-5 py-3 w-full mt-5 hover:bg-[#782421] ${selectedStock === 0 ? "cursor-not-allowed opacity-50" : ""}`}
              onClick={handleBuyNowClick}
              disabled={selectedStock === 0}
            >
              Buy Now
            </button>


            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-5 rounded-md w-[90%] sm:w-[400px]">
                  <h2 className="text-xl font-bold mb-4">Enter Shipping Address</h2>

                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your address"
                  />
                  <h2 className="text-xl font-bold mb-4 ">Enter Phone Number</h2>

                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />

                  <h2 className="text-xl font-bold mb-4">Select Shipping Option</h2>
                  <select
                    value={shippingOption}
                    onChange={handleShippingOptionChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                  >
                    <option value="">Select Shipping Option</option>
                    <option value="inside-valley">Inside Kathmandu Valley (Rs. 120)</option>
                    <option value="outside-valley">Outside Kathmandu Valley (Rs. 170)</option>
                  </select>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelClick}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBuyClick}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="my-5"><hr /></div>
            <h2 className="font-medium">Get it Now</h2>
            {/* Additional product services */}
            <div className="flex gap-2 pt-2">
              <img src="https://anvogue.presslayouts.com/wp-content/uploads/2024/05/product-service-icon1.svg" alt="shiping" />
              <div>
                <h4> Shipping charge</h4>
                <h5 className="text-gray-400"> Shipping charge Rs. 120+ within the valley, Rs. 150–190 outside the valley</h5>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <img src="https://anvogue.presslayouts.com/wp-content/uploads/2024/05/product-service-icon2.svg" alt="shiping" />
              <div>
                <h4>7 - Day Returns</h4>
                <h5 className="text-gray-400">Not impressed? Get a refund. You have 7 days to break our hearts.</h5>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <img src="https://anvogue.presslayouts.com/wp-content/uploads/2024/05/product-service-icon3.svg" alt="shiping" />
              <div>
                <h4>Dedicated Support</h4>
                <h5 className="text-gray-400">Support from 8:30 AM to 10:00 PM every day</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto lg:px-10 mt-10">
          <div className="text-[#767676] text-3xl font-medium pb-5">New Product</div>
          <GetNewProduct />
        </div>
        <div className='fixed bottom-0 right-0 p-5 hover:cursor-pointer hover:grayscale-90'>
          <a aria-label="Chat on WhatsApp" href="https://wa.me/9848556062">
            <img src={whatsapp} alt="whatsapp" className='h-[60px]' />
          </a>
        </div>
      </div>
    </>
  );
};

export default ViewProduct;