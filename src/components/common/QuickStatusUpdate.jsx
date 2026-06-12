import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppHooks";
import { updateProjectStatus, fetchProjects } from "../../features/projects/projectsSlice";

function QuickStatusUpdate({ projectId, currentStatus, onClose }) {
  const dispatch = useAppDispatch();
  const { actionLoading } = useAppSelector((state) => state.projects);
  const [status, setStatus] = useState(currentStatus);
  const [progressNotes, setProgressNotes] = useState("");

  const handleUpdate = async () => {
    await dispatch(updateProjectStatus({ projectId, payload: { status, progressNotes } }));
    await dispatch(fetchProjects());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-slate-900">
        <h3 className="mb-4 text-lg font-semibold">Update Project Status</h3>

        <div className="space-y-4">
          <div>
            <label className="label">New Status</label>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="label">Progress Notes (Optional)</label>
            <textarea
              className="input min-h-24"
              value={progressNotes}
              onChange={(e) => setProgressNotes(e.target.value)}
              placeholder="Add any notes about the status update..."
            />
          </div>

          <div className="flex gap-3">
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
              onClick={handleUpdate}
              disabled={actionLoading}
              type="button"
            >
              {actionLoading ? "Updating..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickStatusUpdate;
