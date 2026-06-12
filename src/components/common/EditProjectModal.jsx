import { useEffect, useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppHooks";
import { updateProject, fetchProjects } from "../../features/projects/projectsSlice";
import { fetchUsers } from "../../features/users/usersSlice";
import MultiUserSelect from "./MultiUserSelect";

function EditProjectModal({ project, onClose }) {
  const dispatch = useAppDispatch();
  const { actionLoading } = useAppSelector((state) => state.projects);
  const { items: users } = useAppSelector((state) => state.users);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Pending",
    assignedUsers: [],
    attachments: [],
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title,
        description: project.description,
        startDate: dayjs(project.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(project.endDate).format("YYYY-MM-DD"),
        status: project.status,
        assignedUsers: project.assignedUsers?.map((member) => member._id || member) || [],
        attachments: [],
      });
    }
  }, [project]);

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

    const result = await dispatch(updateProject({ projectId: project._id, formData }));
    if (!result.error) {
      toast.success("Project updated successfully");
      dispatch(fetchProjects());
      onClose();
    } else {
      toast.error(result.payload || "Failed to update project");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 border-b pb-2 dark:border-slate-800">
          <h3 className="text-lg font-semibold">Edit Project</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              className="input"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-24"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
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
                required
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                className="input"
                type="date"
                value={form.endDate}
                onChange={(event) => setForm({ ...form, endDate: event.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="label">Assigned Users</label>
            <MultiUserSelect
              users={users.filter((u) => u.role !== "Admin")}
              selectedUsers={form.assignedUsers}
              onChange={(selectedIds) =>
                setForm({
                  ...form,
                  assignedUsers: selectedIds,
                })
              }
            />
          </div>

          <div>
            <label className="label">Replace Attachments (Max 3)</label>
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

          <div className="flex gap-3 pt-2">
            <button
              className="btn-secondary flex-1"
              onClick={onClose}
              disabled={actionLoading}
              type="button"
            >
              Cancel
            </button>
            <button
              className="btn-primary flex-1"
              disabled={actionLoading}
              type="submit"
            >
              {actionLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProjectModal;
