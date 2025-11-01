import React from "react";
import { useGetMyOrdersQuery } from "../../redux/api/OrderApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router";

const UserOrder = () => {
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    if (isLoading) return <Loader />;
    if (error)
        return (
            <Message variant="danger">
                {error.data?.message || "Something went wrong"}
            </Message>
        );

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 text-white">
            <h2 className="text-3xl font-semibold mb-6 text-center">My Orders</h2>

            <div className="overflow-x-auto rounded-2xl shadow-lg bg-gray-900">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-800 uppercase text-gray-300 text-sm">
                        <tr>
                            <th className="py-3 px-4">Image</th>
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Total</th>
                            <th className="py-3 px-4">Paid</th>
                            <th className="py-3 px-4">Delivered</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order._id}
                                className="border-b border-gray-700 rounded-2xl hover:bg-gray-800 transition duration-200"
                            >
                                <td className="py-3 px-4">
                                    <img
                                        src={order.orderItems[0].image}
                                        alt={order.orderItems[0].name}
                                        className="w-16 h-16 object-cover rounded-xl border border-gray-700"
                                    />
                                </td>

                                <td className="py-3 px-4 font-mono">{order._id}</td>

                                <td className="py-3 px-4">
                                    {order.createdAt
                                        ? new Date(order.createdAt).toLocaleDateString()
                                        : "—"}
                                </td>

                                <td className="py-3 px-4 font-semibold">
                                    PKR {order.totalPrice.toFixed(2)}
                                </td>

                                <td className="py-3 px-4">
                                    {order.isPaid ? (
                                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                            Paid
                                        </span>
                                    ) : (
                                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                            Pending
                                        </span>
                                    )}
                                </td>

                                <td className="py-3 px-4">
                                    {order.isDelivered ? (
                                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                            Delivered
                                        </span>
                                    ) : (
                                        <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-medium">
                                            In Transit
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-4"><Link to={`/order/${order._id}`} className="bg-pink-400 px-4 py-1 rounded-full font-bold">More</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >
        </div >
    );
};

export default UserOrder;
