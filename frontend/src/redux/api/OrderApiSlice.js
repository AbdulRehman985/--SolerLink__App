import { Order_URL } from "../features/constants";
import { apiSlice } from "./apiSlice";

export const OrderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create order
    createOrder: builder.mutation({
      query: (order) => ({
        url: Order_URL,
        method: "POST",
        body: order,
        credentials: "include",
      }),
    }),

    // Get order details
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${Order_URL}/${id}`,
      }),
    }),

    // Get all orders (Admin)
    getOrders: builder.query({
      query: () => ({
        url: Order_URL,
      }),
    }),

    // Pay for an order
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${Order_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    // Get logged-in user's orders
    getMyOrders: builder.query({
      query: () => ({
        url: `${Order_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    // Deliver order (Admin only)
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${Order_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    // Get total orders (Admin dashboard)
    getTotalOrders: builder.query({
      query: () => ({
        url: `${Order_URL}/total-orders`,
      }),
    }),

    // Get total sales
    getTotalSales: builder.query({
      query: () => ({
        url: `${Order_URL}/total-sales`,
      }),
    }),

    // Get sales by date
    getTotalSalesByDate: builder.query({
      query: () => ({
        url: `${Order_URL}/total-sales-by-date`,
      }),
    }),
  }),
});

// Export hooks (kept in order of definition)
export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetOrdersQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
} = OrderApiSlice;
