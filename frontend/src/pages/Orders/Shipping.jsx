import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProgressSteps from "../../components/ProgressSteps";
import { saveShippingAddress } from "../../redux/features/Cart/CartSlice";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/placeorder");
  };
  return (
    <div className="container mx-auto">
      <ProgressSteps step1 step2 />
      <div className=" flex justify-around items-center flex-wrap">
        <form className="w-[35rem]" onSubmit={submitHandler}>
          <h1 className="text-2xl font-extrabold mb-4 text-white">Shipping</h1>
          <div className="mb-2">
            <label className="block text-white mb-2"> Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded text-white"
              placeholder="Enter Address"
            />
          </div>
          <div className="mb-2">
            <label className="block text-white mb-2">Postal Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostCode(e.target.value)}
              className="w-full p-2 border rounded text-white"
              placeholder="Enter Postal code"
            />
          </div>
          <div className="mb-2">
            <label className="block text-white mb-2">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 border rounded text-white"
              placeholder="Enter City"
            />
          </div>
          <div className="mb-2">
            <label className="block text-white mb-2">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 border rounded text-white"
              placeholder="Enter Country name"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-500">Select Method</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-pink-500 "
                  name="paymentMethod"
                  value="easyPaisa"
                />
                <span className="ml-2 mb-1 text-white">
                  EasyPaisa or Credit Card
                </span>
              </label>
            </div>
          </div>
          <button className="bg-pink-500 w-full text-white rounded-2xl py-2 font-bold cursor-pointer">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
