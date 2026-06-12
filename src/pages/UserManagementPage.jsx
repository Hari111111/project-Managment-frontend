import { useEffect, useState } from "react";

import PageHeader from "../components/common/PageHeader";
import Loader from "../components/common/Loader";
import { useAppDispatch, useAppSelector } from "../hooks/useAppHooks";
import { createUser, deleteUser, fetchUsers, updateUser, clearUserError } from "../features/users/usersSlice";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "User",
  isActive: true,
};

function UserManagementPage() {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const dispatch = useAppDispatch();
  const { items, loading, actionLoading, error } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(clearUserError());
    dispatch(fetchUsers());
    return () => {
      dispatch(clearUserError());
    };
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let result;
    if (editingId) {
      result = await dispatch(updateUser({ userId: editingId, payload: form }));
    } else {
      result = await dispatch(createUser(form));
    }

    if (!result.error) {
      setForm(initialForm);
      setEditingId("");
      toast.success(editingId ? "User updated successfully" : "User created successfully");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      isActive: user.isActive,
    });
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const result = await dispatch(deleteUser(userId));
      if (!result.error) {
        toast.success("User deleted successfully");
      } else {
        toast.error(result.payload || "Failed to delete user");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" subtitle="Create accounts, change roles, and control access to the system." />

      <form className="panel space-y-4 p-6" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="label">{editingId ? "New Password (optional)" : "Password"}</label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </div>
          <div>
            <label className="label">Role</label>
            <input
              className="input bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              value="User"
              disabled
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={String(form.isActive)}
              onChange={(event) => setForm({ ...form, isActive: event.target.value === "true" })}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary" disabled={actionLoading} type="submit">
            {editingId ? "Update User" : "Create User"}
          </button>
          {editingId && (
            <button
              className="btn-secondary"
              type="button"
              onClick={() => {
                setForm(initialForm);
                setEditingId("");
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/70">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((user) => (
                <tr key={user._id}>
                  <td className="px-5 py-4 font-semibold">{user.name}</td>
                  <td className="px-5 py-4 text-sm">{user.email}</td>
                  <td className="px-5 py-4 text-sm">{user.role}</td>
                  <td className="px-5 py-4 text-sm">{user.isActive ? "Active" : "Inactive"}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="btn-secondary" onClick={() => handleEdit(user)} type="button">
                        Edit
                      </button>
                      <button className="btn-danger" onClick={() => handleDeleteUser(user._id)} type="button">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserManagementPage;
