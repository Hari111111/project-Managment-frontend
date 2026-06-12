import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Download, Trash2, Upload, FileText } from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../components/common/Loader";
import PageHeader from "../components/common/PageHeader";
import StatusChip from "../components/common/StatusChip";
import { useAppDispatch, useAppSelector } from "../hooks/useAppHooks";
import {
  deleteProject,
  fetchProjectById,
  updateProject,
  updateProjectStatus,
} from "../features/projects/projectsSlice";
import { fetchUsers } from "../features/users/usersSlice";

function ProjectDetailsPage() {
  const { projectId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedProject, loading, actionLoading, error } = useAppSelector((state) => state.projects);
  const { user } = useAppSelector((state) => state.auth);
  const { items: users } = useAppSelector((state) => state.users);
  const [status, setStatus] = useState("Pending");
  const [progressNotes, setProgressNotes] = useState("");
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Pending",
    assignedUsers: [],
    attachments: [],
  });

  useEffect(() => {
    dispatch(fetchProjectById(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (user?.role === "Admin") {
      dispatch(fetchUsers());
    }
  }, [dispatch, user?.role]);

  useEffect(() => {
    if (selectedProject) {
      setStatus(selectedProject.status);
      setProgressNotes(selectedProject.progressNotes || "");
      setProjectForm({
        title: selectedProject.title,
        description: selectedProject.description,
        startDate: dayjs(selectedProject.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(selectedProject.endDate).format("YYYY-MM-DD"),
        status: selectedProject.status,
        assignedUsers: selectedProject.assignedUsers?.map((member) => member._id) || [],
        attachments: [],
      });
    }
  }, [selectedProject]);

  if (loading || !selectedProject) return <Loader />;

  const handleStatusUpdate = async (event) => {
    event.preventDefault();
    await dispatch(updateProjectStatus({ projectId, payload: { status, progressNotes } }));
    dispatch(fetchProjectById(projectId));
  };

  const canUpdateStatus =
    user?.role === "Admin" ||
    selectedProject.assignedUsers?.some((member) => member._id === user?._id);

  const handleProjectUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    Object.entries(projectForm).forEach(([key, value]) => {
      if (key === "assignedUsers") {
        formData.append(key, JSON.stringify(value));
      } else if (key !== "attachments" && key !== "status") {
        formData.append(key, value);
      }
    });

    Array.from(projectForm.attachments).forEach((file) => {
      formData.append("attachments", file);
    });

    const result = await dispatch(updateProject({ projectId, formData }));
    if (!result.error) {
      dispatch(fetchProjectById(projectId));
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteProject(projectId));
    if (!result.error) {
      navigate("/projects");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={selectedProject.title}
        subtitle={`Created by ${selectedProject.createdBy?.name || "Unknown"} on ${dayjs(selectedProject.createdAt).format("DD MMM YYYY")}`}
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-6">
          <div className="space-y-4">
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{selectedProject.description}</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">Current Status</span>
              <StatusChip status={selectedProject.status} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Timeline: {dayjs(selectedProject.startDate).format("DD MMM YYYY")} to {dayjs(selectedProject.endDate).format("DD MMM YYYY")}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Assigned: {selectedProject.assignedUsers?.map((member) => member.name).join(", ")}
            </p>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="text-lg font-semibold">Attachments</h2>
          <div className="mt-4 space-y-3">
            {selectedProject.attachments?.length ? (
              selectedProject.attachments.map((file) => (
                <a
                  key={file.filename}
                  className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-brand-700 hover:bg-slate-50 dark:border-slate-800 dark:text-brand-400 dark:hover:bg-slate-800"
                  href={`${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000"}${file.url}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  {file.originalName}
                </a>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No attachments uploaded.</p>
            )}
          </div>
        </div>
      </div>

      {canUpdateStatus ? (
        <form className="panel space-y-4 p-6" onSubmit={handleStatusUpdate}>
          <h2 className="text-lg font-semibold">Update Project Status</h2>
          <div>
            <label className="label">Status</label>
            <select className="input" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="label">Progress Notes</label>
            <textarea
              className="input min-h-32"
              value={progressNotes}
              onChange={(event) => setProgressNotes(event.target.value)}
            />
          </div>
          <button className="btn-primary" disabled={actionLoading} type="submit">
            Update Status
          </button>
        </form>
      ) : null}

      {user?.role === "Admin" ? (
        <form className="panel space-y-4 p-6" onSubmit={handleProjectUpdate}>
          <h2 className="text-lg font-semibold">Admin Project Controls</h2>
          <div>
            <label className="label">Title</label>
            <input
              className="input"
              value={projectForm.title}
              onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })}
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-32"
              value={projectForm.description}
              onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Start Date</label>
              <input
                className="input"
                type="date"
                value={projectForm.startDate}
                onChange={(event) => setProjectForm({ ...projectForm, startDate: event.target.value })}
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                className="input"
                type="date"
                value={projectForm.endDate}
                onChange={(event) => setProjectForm({ ...projectForm, endDate: event.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">Assigned Users</label>
            <select
              className="input min-h-40"
              multiple
              value={projectForm.assignedUsers}
              onChange={(event) =>
                setProjectForm({
                  ...projectForm,
                  assignedUsers: Array.from(event.target.selectedOptions, (option) => option.value),
                })
              }
            >
              {users.filter(u => u.role !== "Admin").map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Replace Attachments</label>
            <input
              className="input"
              type="file"
              multiple
              onChange={(event) => {
                if (event.target.files.length > 3) {
                  toast.error("You can only upload a maximum of 3 attachments.");
                  event.target.value = null;
                  setProjectForm({ ...projectForm, attachments: [] });
                } else {
                  setProjectForm({ ...projectForm, attachments: event.target.files });
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <button className="btn-primary" disabled={actionLoading} type="submit">
              Save Changes
            </button>
            <button className="btn-danger" onClick={handleDelete} type="button">
              Delete Project
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

export default ProjectDetailsPage;
