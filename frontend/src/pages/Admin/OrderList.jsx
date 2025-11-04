import React, { useState } from "react";
import { useGetOrdersQuery } from "../../redux/api/OrderApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [sort] = useState({});
    const [search, setSearch] = useState("");

    const { data, isLoading, error } = useGetOrdersQuery({
        page,
        pageSize,
        sort: JSON.stringify(sort),
        search,
    });

    const orders = data?.orders || [];
    console.log("🚀 ~ OrderList ~ data?.orders :", data?.orders)
    const totalPages = data?.pages || 1;

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    if (isLoading) return <Loader />;
    if (error)
        return (
            <Message variant="danger">
                {error.data?.message || "Something went wrong"}
            </Message>
        );

    return (
        <div className="max-w-6xl mx-auto py-6 px-4 text-white">
            <AdminMenu />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h2 className="text-3xl font-semibold text-center sm:text-left">
                    All Orders
                </h2>

                {/* 🔍 Search Bar */}
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Search by name, payment, total..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full rounded-full px-5 py-2 bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none placeholder-gray-400 text-sm"
                    />
                    <svg
                        className="w-5 h-5 absolute right-4 top-2.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                        />
                    </svg>
                </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-2xl shadow-lg bg-gray-900">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-800 text-sm uppercase text-gray-400">
                        <tr>
                            <th className="py-3 px-4">Items</th>
                            <th className="py-3 px-4">Id</th>
                            <th className="py-3 px-4">User</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Total</th>
                            <th className="py-3 px-4">Paid</th>
                            <th className="py-3 px-4">Delivered</th>
                            <th className="py-3 px-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="py-6 text-center text-gray-400 font-medium"
                                >
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((item) => (
                                <tr
                                    key={item._id}
                                    className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
                                >
                                    <td className="py-3 px-4">
                                        <img
                                            src={item.orderItems[0]?.image}
                                            alt={item.orderItems[0]?.name}
                                            className="w-16 h-16 object-cover rounded-xl border border-gray-700"
                                        />
                                    </td>
                                    <td className="py-3 px-4 font-mono">{item._id}</td>
                                    <td className="py-3 px-4">{item.user?.username}</td>
                                    <td className="py-3 px-4">
                                        {item.createdAt
                                            ? new Date(item.createdAt).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td className="py-3 px-4 font-semibold">
                                        PKR {item.totalPrice.toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4">
                                        {item.isPaid ? (
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
                                        {item.isDelivered ? (
                                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                                Delivered
                                            </span>
                                        ) : (
                                            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-medium">
                                                In Transit
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <Link
                                            to={`/order/${item._id}`}
                                            className="bg-pink-500 hover:bg-pink-600 px-4 py-1 rounded-full font-semibold text-white transition-all duration-200"
                                        >
                                            More
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 🔄 Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-sm font-medium disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-400">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-sm font-medium disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default OrderList;
