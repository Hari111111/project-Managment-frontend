import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import AvatarUpload from "../components/common/AvatarUpload";
import PageHeader from "../components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "../hooks/useAppHooks";
import { updateProfile, clearUserError } from "../features/users/usersSlice";

function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { actionLoading, error } = useAppSelector((state) => state.users);
  const [form, setForm] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
    mobile: user?.mobile || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);

  useEffect(() => {
    dispatch(clearUserError());
    return () => {
      dispatch(clearUserError());
    };
  }, [dispatch]);

  // Sync form when user profile data updates
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        avatar: user.avatar || "",
        mobile: user.mobile || "",
      });
      setSelectedFile(null);
    }
  }, [user]);

  // Handle local file preview object URL lifetime
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setFilePreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setFilePreviewUrl(null);
    }
  }, [selectedFile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("mobile", form.mobile);

    // Add avatar file if selected, otherwise add URL
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    } else if (form.avatar) {
      formData.append("avatar", form.avatar);
    }

    const result = await dispatch(updateProfile(formData));
    if (!result.error) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(result.payload || "Failed to update profile");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" subtitle="Update your own profile information here." />

      {/* Profile Preview Card */}
      <div className="panel p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3">
            {filePreviewUrl || form.avatar ? (
              <img
                alt="Profile"
                className="h-32 w-32 rounded-full border-4 border-brand-600 object-cover"
                src={filePreviewUrl || (form.avatar.startsWith("http") ? form.avatar : `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000"}${form.avatar}`)}
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-brand-600 bg-brand-100 text-5xl font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                {form.name?.[0] || "?"}
              </div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">Current Profile Picture</p>
          </div>
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{form.name || "No Name Set"}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{user?.email}</p>
            {form.mobile && (
              <p className="text-sm text-slate-600 dark:text-slate-300">📱 {form.mobile}</p>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form className="panel space-y-4 p-6" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold">Edit Profile</h2>
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        ) : null}
        <div>
          <label className="label">Full Name</label>
          <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </div>
        <div>
          <label className="label">Mobile Number</label>
          <input
            className="input"
            placeholder="+1 (555) 123-4567"
            type="tel"
            value={form.mobile}
            onChange={(event) => setForm({ ...form, mobile: event.target.value })}
          />
        </div>
        <AvatarUpload
          value={form.avatar}
          onChange={(avatar) => setForm({ ...form, avatar })}
          onFileChange={setSelectedFile}
        />
        <button className="btn-primary" disabled={actionLoading} type="submit">
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
