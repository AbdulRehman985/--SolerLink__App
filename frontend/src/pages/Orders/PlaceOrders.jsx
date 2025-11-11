import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ProgressSteps from "../../components/ProgressSteps";
import { clearCartItems } from "../../redux/features/Cart/CartSlice";
import Message from "../../components/Message";
import { useCreateOrderMutation } from "../../redux/api/OrderApiSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const PlaceOrders = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [createOrder, { error, isLoading }] = useCreateOrderMutation();

  console.log({
    orderItems: cart.cartItem,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
  });
  const placeOrdersHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItem,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress.address, navigate]);

  return (
    <>
      <ProgressSteps step1 step2 step3 />
      <div className="container  mx-auto">
        {cart.cartItem.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto mt-4 ml-24">
            <table className="w-full border-collapse text-white">
              <thead>
                <tr>
                  <td className="px-1 py-2 text-left align-top">image</td>
                  <td className="px-1 py-2 text-left">Product</td>
                  <td className="px-1 py-2 text-left">Quantity</td>
                  <td className="px-1 py-2 text-left">Price</td>
                  <td className="px-1 py-2 text-left">Total</td>
                </tr>
              </thead>
              <tbody>
                {cart.cartItem.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td className="p-2">
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">{item.price}</td>
                    <td className="p-2">
                      PKR {(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 mr-12 text-white">
              <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
              <div className="flex justify-between flex-wrap p-8 bg-[#181818] rounded-2xl">
                <ul className="text-lg">
                  <li>
                    <span className="font-semibold mb-4">Items:</span>$
                    {cart.itemsPrice}
                  </li>
                  <li>
                    <span className="font-semibold mb-4">Shipping Price:</span>$
                    {cart.shippingPrice}
                  </li>
                  <li>
                    <span className="font-semibold mb-4">taxPrice:</span>$
                    {cart.taxPrice}
                  </li>
                  <li>
                    <span className="font-semibold mb-4">Total:</span>$
                    {cart.totalPrice}
                  </li>
                </ul>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
                  <p>
                    <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                    {cart.shippingAddress.city},{" "}
                    {cart.shippingAddress.postalCode}{" "}
                    {cart.shippingAddress.country}
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Payment Method
                  </h2>
                  <strong>Payment Method:</strong> {cart.paymentMethod}
                </div>
              </div>
              <button
                className="text-white bg-pink-500 py-2 px-4 rounded-full text-lg font-bold w-full mt-4"
                onClick={placeOrdersHandler}
                disabled={cart.cartItem === 0}
              >
                Order place
              </button>
              {isLoading && <Loader />}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlaceOrders;
