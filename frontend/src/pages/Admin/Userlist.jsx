import { useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Userlist = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useDispatch();
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const cancelEdit = () => {
    setEditableUserId(null);
    setEditableUserName("");
    setEditableUserEmail("");
  };

  const updateHandler = async (id) => {
    try {
      const updatedUser = await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      }).unwrap();
      dispatch(setCredentials(updatedUser));
      toast.success("User updated successfully");
      cancelEdit();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  if (isLoading) return <Loader />;

  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error.message}
      </Message>
    );

  return (
    <div className="w-full max-w-5xl mx-auto overflow-x-auto rounded-2xl shadow-2xl border border-gray-700 bg-gray-950 p-6">
      <AdminMenu />
      <table className="w-full table-auto text-sm text-left">
        <thead className="bg-gray-800 text-gray-300 text-sm uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3 text-center">Admin</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800 text-white">
          {users?.map((user) => (
            <tr
              key={user._id}
              className="hover:bg-gray-850 transition-all duration-200"
            >
              <td className="px-4 py-3 max-w-[180px] truncate">{user._id}</td>

              <td className="px-4 py-3">
                {editableUserId === user._id ? (
                  <input
                    type="text"
                    value={editableUserName}
                    onChange={(e) => setEditableUserName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
                  />
                ) : (
                  user.username
                )}
              </td>

              <td className="px-4 py-3">
                {editableUserId === user._id ? (
                  <input
                    type="email"
                    value={editableUserEmail}
                    onChange={(e) => setEditableUserEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
                  />
                ) : (
                  user.email
                )}
              </td>

              <td className="px-4 py-3 text-center">
                {user.isAdmin ? (
                  <FaCheck className="text-green-500 text-lg" />
                ) : (
                  <FaTimes className="text-red-500 text-lg" />
                )}
              </td>

              <td className="px-4 py-3 text-center space-x-2">
                {editableUserId === user._id ? (
                  <>
                    <button
                      onClick={() => updateHandler(user._id)}
                      className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="inline-flex items-center justify-center px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        toggleEdit(user._id, user.username, user.email)
                      }
                      className="inline-flex items-center justify-center px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition"
                    >
                      <FaEdit />
                    </button>
                    {!user.isAdmin && (
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="inline-flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Userlist;
