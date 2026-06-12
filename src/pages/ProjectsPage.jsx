import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import StatusChip from "../components/common/StatusChip";
import QuickStatusUpdate from "../components/common/QuickStatusUpdate";
import EditProjectModal from "../components/common/EditProjectModal";
import { useAppDispatch, useAppSelector } from "../hooks/useAppHooks";
import { fetchProjects, deleteProject } from "../features/projects/projectsSlice";

function ProjectsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading } = useAppSelector((state) => state.projects);
  const { user } = useAppSelector((state) => state.auth);
  const [filters, setFilters] = useState({ query: "", status: "" });
  const [statusUpdateId, setStatusUpdateId] = useState(null);
  const [editProject, setEditProject] = useState(null);

  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const result = await dispatch(deleteProject(projectId));
      if (!result.error) {
        toast.success("Project deleted successfully");
      } else {
        toast.error(result.payload || "Failed to delete project");
      }
    }
  };

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const filteredProjects = useMemo(
    () =>
      items.filter((project) => {
        const query = filters.query.toLowerCase();
        const matchesQuery =
          project.title.toLowerCase().includes(query) || project.description.toLowerCase().includes(query);
        const matchesStatus = filters.status ? project.status === filters.status : true;
        return matchesQuery && matchesStatus;
      }),
    [items, filters]
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle="Track assignments, delivery windows, attachments, and project execution."
        action={
          user?.role === "Admin" ? (
            <RouterLink className="btn-primary" to="/projects/create">
              Create Project
            </RouterLink>
          ) : null
        }
      />

      <div className="panel p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div>
            <label className="label">Search projects</label>
            <input
              className="input"
              value={filters.query}
              onChange={(event) => setFilters({ ...filters, query: event.target.value })}
              placeholder="Search by title or description"
            />
          </div>
          <div>
            <label className="label">Filter by status</label>
            <select
              className="input"
              value={filters.status}
              onChange={(event) => setFilters({ ...filters, status: event.target.value })}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProjects.length ? (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/70">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Start</th>
                  <th className="px-5 py-4">End</th>
                  <th className="px-5 py-4">Assigned Users</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProjects.map((project) => (
                  <tr key={project._id} className="align-top">
                    <td className="px-5 py-4">
                      <RouterLink className="font-semibold text-brand-700 dark:text-brand-400" to={`/projects/${project._id}`}>
                        {project.title}
                      </RouterLink>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusChip status={project.status} />
                    </td>
                    <td className="px-5 py-4 text-sm">{dayjs(project.startDate).format("DD MMM YYYY")}</td>
                    <td className="px-5 py-4 text-sm">{dayjs(project.endDate).format("DD MMM YYYY")}</td>
                    <td className="px-5 py-4 text-sm">
                      {project.assignedUsers?.length ? project.assignedUsers.map((member) => member.name).join(", ") : "None"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="btn-secondary px-3 py-2 text-xs"
                          onClick={() => navigate(`/projects/${project._id}`)}
                          type="button"
                        >
                          View
                        </button>
                        {(user?.role === "Admin" || project.assignedUsers?.some((u) => u._id === user?._id)) && (
                          <button
                            className="btn-secondary px-3 py-2 text-xs"
                            onClick={() => setStatusUpdateId(project._id)}
                            type="button"
                          >
                            Update Status
                          </button>
                        )}
                        {user?.role === "Admin" && (
                          <>
                            <button
                              className="btn-secondary px-3 py-2 text-xs"
                              onClick={() => setEditProject(project)}
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              className="btn-danger px-3 py-2 text-xs"
                              onClick={() => handleDelete(project._id)}
                              type="button"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No projects found" description="Try adjusting the filters or create the first project." />
      )}

      {statusUpdateId && (
        <QuickStatusUpdate
          projectId={statusUpdateId}
          currentStatus={filteredProjects.find((p) => p._id === statusUpdateId)?.status || "Pending"}
          onClose={() => setStatusUpdateId(null)}
        />
      )}

      {editProject && (
        <EditProjectModal
          project={editProject}
          onClose={() => setEditProject(null)}
        />
      )}
    </div>
  );
}

export default ProjectsPage;
