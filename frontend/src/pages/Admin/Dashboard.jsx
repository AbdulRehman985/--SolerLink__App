import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/userApiSlice";
import {
    useGetTotalOrdersQuery,
    useGetTotalSalesByDateQuery,
    useGetTotalSalesQuery,
} from "../../redux/api/OrderApiSlice";

import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
    const { data: sales, isLoading } = useGetTotalSalesQuery();
    console.log("🚀 ~ AdminDashboard ~ sales:", sales)
    const { data: customers } = useGetUsersQuery();
    const { data: orders } = useGetTotalOrdersQuery();
    const { data: salesDetail } = useGetTotalSalesByDateQuery();
    console.log("🚀 ~ AdminDashboard ~ salesDetail:", salesDetail)

    const [state, setState] = useState({
        options: {
            chart: { type: "line", toolbar: { show: false } },
            tooltip: { theme: "dark" },
            colors: ["#F59E0B"], // amber highlight
            dataLabels: { enabled: false },
            stroke: { curve: "smooth", width: 3 },
            grid: { borderColor: "#1f2937", strokeDashArray: 4 },
            xaxis: {
                categories: [],
                labels: { style: { colors: "#d1d5db" } },
            },
            yaxis: {
                labels: { style: { colors: "#d1d5db" } },
            },
        },
        series: [{ name: "Sales", data: [] }],
    });

    useEffect(() => {
        if (salesDetail) {
            const formattedSalesDate = salesDetail.map((item) => ({
                x: item._id,
                y: item.totalSales,
            }));

            setState((prev) => ({
                ...prev,
                options: {
                    ...prev.options,
                    xaxis: { categories: formattedSalesDate.map((i) => i.x) },
                },
                series: [{ name: "Sales", data: formattedSalesDate.map((i) => i.y) }],
            }));
        }
    }, [salesDetail]);

    return (
        <>
            <AdminMenu />

            <section className="min-h-screen text-white px-6 py-10 md:px-12 lg:px-20">
                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {/* Sales */}
                    <div className="bg-[#181818]/80 backdrop-blur-lg rounded-2xl p-6 border border-[#2a2a2a] hover:border-amber-500 transition-all hover:shadow-[0_0_20px_#F59E0B60]">
                        <div className="flex items-center space-x-4">
                            <div className="bg-amber-500/20 p-4 rounded-full">💰</div>
                            <div>
                                <p className="text-gray-400">Total Orders amount </p>
                                <h2 className="text-2xl font-bold text-amber-400">
                                    {isLoading ? <Loader /> : `PKR${sales?.totalSales?.toFixed(2)}`}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Customers */}
                    <div className="bg-[#181818]/80 backdrop-blur-lg rounded-2xl p-6 border border-[#2a2a2a] hover:border-amber-500 transition-all hover:shadow-[0_0_20px_#F59E0B60]">
                        <div className="flex items-center space-x-4">
                            <div className="bg-amber-500/20 p-4 rounded-full">👥</div>
                            <div>
                                <p className="text-gray-400">Customers</p>
                                <h2 className="text-2xl font-bold text-amber-400">
                                    {customers ? customers?.users.length : <Loader />}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="bg-[#181818]/80 backdrop-blur-lg rounded-2xl p-6 border border-[#2a2a2a] hover:border-amber-500 transition-all hover:shadow-[0_0_20px_#F59E0B60]">
                        <div className="flex items-center space-x-4">
                            <div className="bg-amber-500/20 p-4 rounded-full">📦</div>
                            <div>
                                <p className="text-gray-400">Total Orders</p>
                                <h2 className="text-2xl font-bold text-amber-400">
                                    {orders ? orders.totalOrders : <Loader />}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-[#181818]/80 backdrop-blur-lg rounded-2xl border border-[#2a2a2a] p-8 shadow-lg hover:shadow-[0_0_25px_#F59E0B40] transition-all">
                    <h3 className="text-xl font-semibold mb-4 text-amber-400">
                        Sales Overview
                    </h3>
                    <Chart options={state.options} series={state.series} type="bar" height="350" />
                </div>

                {/* Orders List */}
                <div className="mt-16">
                    <OrderList />
                </div>
            </section>
        </>
    );
};

export default AdminDashboard;
