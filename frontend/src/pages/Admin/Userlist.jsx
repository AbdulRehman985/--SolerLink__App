import { useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaUserShield,
  FaStore,
} from "react-icons/fa";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";

const AdminUserList = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);


  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [sort] = useState({});
  const [search, setSearch] = useState("");


  const [editMode, setEditMode] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");


  const { data, isLoading, error, refetch } = useGetUsersQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Delete failed");
      }
    }
  };


  const toggleEdit = (user) => {
    setEditMode(user._id);
    setEditableUserName(user.username);
    setEditableUserEmail(user.email);
  };

  const updateHandler = async (id) => {
    try {
      const updatedUser = await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      }).unwrap();

      if (userInfo._id === updatedUser._id) {
        dispatch(setCredentials(updatedUser));
      }

      toast.success("User updated successfully");
      setEditMode(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Something went wrong"}
      </Message>
    );

  const totalPages = data?.totalPages || 1;
  const users = data?.users || [];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 text-white">
      <AdminMenu />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-3xl font-semibold text-center sm:text-left">
          Manage Users
        </h2>


        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by username or email..."
            className="w-full rounded-full px-5 py-2 bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none placeholder-gray-400 text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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

      <div className="overflow-x-auto rounded-2xl shadow-lg bg-gray-900">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-800 text-sm uppercase text-gray-400">
            <tr>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-6 text-center text-gray-400 font-medium"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
                >

                  <td className="py-3 px-4">
                    {editMode === user._id ? (
                      <input
                        type="text"
                        className="bg-gray-700 p-1 rounded w-full"
                        value={editableUserName}
                        onChange={(e) => setEditableUserName(e.target.value)}
                      />
                    ) : (
                      user.username
                    )}
                  </td>


                  <td className="py-3 px-4">
                    {editMode === user._id ? (
                      <input
                        type="email"
                        className="bg-gray-700 p-1 rounded w-full"
                        value={editableUserEmail}
                        onChange={(e) => setEditableUserEmail(e.target.value)}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {user.role === "admin" ? (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <FaUserShield className="inline" /> Admin
                      </span>
                    ) : user.role === "shopkeeper" ? (
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <FaStore className="inline" /> Shopkeeper
                      </span>
                    ) : (
                      <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        User
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {editMode === user._id ? (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="text-green-400 hover:text-green-300"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => setEditMode(null)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => toggleEdit(user)}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


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

export default AdminUserList;
