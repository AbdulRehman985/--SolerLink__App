import { Category_URL } from "../features/constants";
import { apiSlice } from "./apiSlice";

export const CategoryAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: Category_URL,
        method: "POST",
        credentials: "include",
        body: newCategory,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ categoryID, updateCategory }) => ({
        url: `${Category_URL}/${categoryID}`,
        method: "PUT",
        credentials: "include",
        body: updateCategory,
      }),
    }),
    deleteCategory: builder.mutation({
      query: ({ categoryID }) => ({
        url: `${Category_URL}/${categoryID}`,
        credentials: "include",
        method: "DELETE",
      }),
    }),
    fetchCategories: builder.query({
      query: () => ({
        url: `${Category_URL}/categories`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
  }),
  overrideExisting: true,
});
export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} = CategoryAPISlice;
