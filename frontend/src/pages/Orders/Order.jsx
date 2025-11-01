import React from "react";
import { Link, useParams } from "react-router";
import { useDeliverOrderMutation, useGetOrderDetailsQuery } from "../../redux/api/OrderApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useSelector } from "react-redux";

const Order = () => {
    const { id: orderId } = useParams();
    const { userInfo } = useSelector((state) => state.auth);
    const { data: order, error, isLoading } = useGetOrderDetailsQuery(orderId);
    const [payOrder, { isLoading: LoadingDeliver }] = useDeliverOrderMutation();
    console.log(order)
    if (isLoading) return <Loader />;
    if (error) return <Message variant="danger">{error.data?.message || "Something went wrong"}</Message>;
    const dilverdHandler = async () => {
        try {
            await payOrder(orderId).unwrap();

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="min-h-screen bg-gray-950 text-white py-10 px-6 md:px-16 flex flex-col md:flex-row gap-8">
            {/* Left: Order Items */}
            <div className="md:w-2/3">
                <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Order Items</h2>

                    {order.orderItems.length === 0 ? (
                        <Message>Order is empty</Message>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-700 rounded-lg">
                                <thead className="bg-gray-800 text-gray-200">
                                    <tr>
                                        <th className="p-3 text-left">Image</th>
                                        <th className="p-3 text-left">Product</th>
                                        <th className="p-3 text-center">Qty</th>
                                        <th className="p-3 text-center">Price</th>
                                        <th className="p-3 text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.orderItems.map((item, index) => (
                                        <tr
                                            key={item._id}
                                            className={index % 2 === 0 ? "bg-gray-800/40" : "bg-gray-900/30"}
                                        >
                                            <td className="p-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                                />
                                            </td>
                                            <td className="p-3">
                                                {console.log(item._id)}
                                                <Link to={`/product/${item.product}`}
                                                    className="hover:text-pink-500 transition">
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td className="p-3 text-center">{item.qty}</td>
                                            <td className="p-3 text-center">PKR {item.price}</td>
                                            <td className="p-3 text-center font-semibold text-pink-400">
                                                PKR {(item.qty * item.price).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Order Summary */}
            <div className="md:w-1/3">
                <div className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-6">
                    <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Shipping Details</h2>
                    <p className="mb-3"><strong className="text-pink-500">Order:</strong> {order._id}</p>
                    <p className="mb-3"><strong className="text-pink-500">Name:</strong> {order.user.username}</p>
                    <p className="mb-3"><strong className="text-pink-500">Email:</strong> {order.user.email}</p>
                    <p className="mb-3">
                        <strong className="text-pink-500">Address:</strong>{" "}
                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
                    </p>
                    <p className="mb-4"><strong className="text-pink-500">Payment:</strong> {order.paymentMethod}</p>

                    {order.isPaid ? (
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm font-medium">
                            ✅ Paid on {new Date(order.paidAt).toLocaleDateString()}
                        </span>
                    ) : (
                        <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-sm font-medium">
                            ❌ Not Paid
                        </span>
                    )}
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Order Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Items</span>
                            <span>PKR {order.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>PKR {order.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>PKR {order.taxPrice}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t border-gray-700 pt-3">
                            <span>Total</span>
                            <span className="text-pink-400">PKR {order.totalPrice}</span>
                        </div>
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (<button onClick={dilverdHandler} className="bg-pink-500 w-full mt-2 py-2 rounded-2xl font-bold cursor-pointer">Mark as Delivered</button>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;
