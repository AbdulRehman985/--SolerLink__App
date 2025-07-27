import { Product_URL, Upload_URL } from "../features/constants";
import { apiSlice } from "./apiSlice";
export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword = "" } = {}) => ({
        url: `${Product_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (productId) => `${Product_URL}/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    allProducts: builder.query({
      query: () => `${Product_URL}/allproducts`,
      providesTags: ["Product"],
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${Product_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${Product_URL}`,
        method: "POST",
        credentials: "include",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${Upload_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${Product_URL}/${productId}`,
        method: "PUT",
        credentials: "include",
        body: formData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),
    gettopProduct: builder.query({
      query: () => ({
        url: `${Product_URL}/top`,
      }),
    }),
    createReview: builder.mutation({
      query: ({ ProductId, rating, comment }) => ({
        url: `${Product_URL}/${ProductId}/reviews`,
        method: "POST",
        credentials: "include",
        body: { rating, comment },
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${Product_URL}/${productId}`,
        credentials: "include",
        method: "DELETE",
      }),
      invalidatesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),
  }),
});
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAllProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useGettopProductQuery,
  useCreateReviewMutation,
} = productApiSlice;
