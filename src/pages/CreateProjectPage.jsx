import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "../hooks/useAppHooks";
import { createProject } from "../features/projects/projectsSlice";
import { fetchUsers } from "../features/users/usersSlice";

const initialState = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "Pending",
  assignedUsers: [],
  attachments: [],
};

function CreateProjectPage() {
  const [form, setForm] = useState(initialState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: users } = useAppSelector((state) => state.users);
  const { actionLoading, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "assignedUsers") {
        formData.append(key, JSON.stringify(value));
      } else if (key !== "attachments") {
        formData.append(key, value);
      }
    });

    Array.from(form.attachments).forEach((file) => {
      formData.append("attachments", file);
    });

    const result = await dispatch(createProject(formData));
    if (!result.error) navigate("/projects");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Project" subtitle="Define scope, assign team members, and add supporting files." />

      <form className="panel space-y-5 p-6" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            className="input min-h-32"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Start Date</label>
            <input
              className="input"
              type="date"
              value={form.startDate}
              onChange={(event) => setForm({ ...form, startDate: event.target.value })}
            />
          </div>
          <div>
            <label className="label">End Date</label>
            <input
              className="input"
              type="date"
              value={form.endDate}
              onChange={(event) => setForm({ ...form, endDate: event.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="Pending">Pending</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="label">Assigned Users</label>
          <select
            className="input min-h-40"
            multiple
            value={form.assignedUsers}
            onChange={(event) =>
              setForm({
                ...form,
                assignedUsers: Array.from(event.target.selectedOptions, (option) => option.value),
              })
            }
          >
            {users.filter(u => u.role !== "Admin").map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Hold Ctrl or Cmd to select multiple users.</p>
        </div>

        <div>
          <label className="label">Attachments</label>
          <input
            className="input"
            type="file"
            multiple
            onChange={(event) => {
              if (event.target.files.length > 3) {
                toast.error("You can only upload a maximum of 3 attachments.");
                event.target.value = null;
                setForm({ ...form, attachments: [] });
              } else {
                setForm({ ...form, attachments: event.target.files });
              }
            }}
          />
        </div>

        <button className="btn-primary" disabled={actionLoading} type="submit">
          Save Project
        </button>
      </form>
    </div>
  );
}

export default CreateProjectPage;
