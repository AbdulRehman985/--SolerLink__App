import React from 'react'
import { useGetOrdersQuery } from '../../redux/api/OrderApiSlice'
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Link } from 'react-router';
import AdminMenu from './AdminMenu';

const OrderList = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();
    console.log(orders)

    if (isLoading) return <Loader />;
    if (error)
        return (
            <Message variant="danger">
                {error.data?.message || "Something went wrong"}
            </Message>
        );

    return (
        <div className='max-w-5xl mx-auto py-6 px-4 text-white'>
            <AdminMenu />
            <h2 className='text-3xl font-semibold mb-6 text-center'>All Orders</h2>
            <div className='overflow-x-auto rounded-2xl shadow-lg bg-gray-900'>
                <table className='min-w-full text-sm text-left border-collapse'>
                    <thead className='bg-gray-800 text-sm uppercase text-gray-400'>
                        <tr>
                            <th className='py-3 px-4'>Items</th>
                            <th className='py-3 px-4'>Id</th>
                            <th className='py-3 px-4'>User</th>
                            <th className='py-3 px-4'>date</th>
                            <th className='py-3 px-4'>Total</th>
                            <th className='py-3 px-4'>Paid</th>
                            <th className='py-3 px-4'>Delivered</th>
                            <th className='py-3 px-4'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((item) => (
                            <tr key={item._id} className='border-b border-gray-700 hover:bg-gray-800 transition duration-200'>
                                <td className='py-3 px-4'>
                                    <img src={item.orderItems[0].image} alt={item.orderItems[0].name} className='w-16 h-16 object-cover rounded-xl border border-gray-700' />
                                </td>
                                <td className="py-3 px-4 font-mono">{item._id}</td>
                                <td className="py-3 px-4">{item.user.username}</td>

                                <td className="py-3 px-4">
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleDateString()
                                        : "—"}
                                </td>

                                <td className="py-3 px-4 font-semibold">
                                    PKR{item.totalPrice.toFixed(2)}
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
                                <td className="py-3 px-4"><Link to={`/order/${item._id}`} className="bg-pink-400 px-4 py-1 rounded-full font-bold">More</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderList
