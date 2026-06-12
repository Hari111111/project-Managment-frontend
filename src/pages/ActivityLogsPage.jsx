import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import PageHeader from "../components/common/PageHeader";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { useAppDispatch, useAppSelector } from "../hooks/useAppHooks";
import { fetchActivityLogs } from "../features/activity/activitySlice";

dayjs.extend(relativeTime);

const ACTION_COLORS = {
  CREATE_USER: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  UPDATE_USER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  DELETE_USER: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  CREATE_PROJECT: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  UPDATE_PROJECT: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  DELETE_PROJECT: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  UPDATE_PROJECT_STATUS: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

function ActivityLogsPage() {
  const dispatch = useAppDispatch();
  const { logs, pagination, loading } = useAppSelector((state) => state.activity);
  const [filters, setFilters] = useState({ q: "", action: "", entityType: "", page: 1 });

  useEffect(() => {
    dispatch(fetchActivityLogs(filters));
  }, [dispatch, filters]);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  if (loading && logs.length === 0) return <Loader />;

  const actions = logs.map((log) => log.action).filter((action, idx, arr) => arr.indexOf(action) === idx);
  const entityTypes = logs.map((log) => log.entityType).filter((type, idx, arr) => arr.indexOf(type) === idx);

  return (
    <div className="space-y-6">
      <PageHeader title="Activity Logs" subtitle="Track all system activities and changes." />

      {/* Filters */}
      <div className="panel space-y-4 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_200px_200px]">
          <div>
            <label className="label">Search activity</label>
            <input
              className="input"
              placeholder="Search by action, entity, or metadata..."
              value={filters.q}
              onChange={(event) => setFilters({ ...filters, q: event.target.value, page: 1 })}
            />
          </div>
          <div>
            <label className="label">Action</label>
            <select
              className="input"
              value={filters.action}
              onChange={(event) => setFilters({ ...filters, action: event.target.value, page: 1 })}
            >
              <option value="">All</option>
              {actions.map((action) => (
                <option key={action} value={action}>
                  {action.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Entity Type</label>
            <select
              className="input"
              value={filters.entityType}
              onChange={(event) => setFilters({ ...filters, entityType: event.target.value, page: 1 })}
            >
              <option value="">All</option>
              {entityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      {logs.length ? (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/70">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="px-5 py-4">Actor</th>
                  <th className="px-5 py-4">Action</th>
                  <th className="px-5 py-4">Entity</th>
                  <th className="px-5 py-4">Details</th>
                  <th className="px-5 py-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log._id} className="align-top">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{log.actor?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{log.actor?.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${ACTION_COLORS[log.action] || "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"}`}>
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{log.entityType}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{log.entityId}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        {log.metadata?.title && (
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-semibold">Title:</span> {log.metadata.title}
                          </p>
                        )}
                        {log.metadata?.email && (
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-semibold">Email:</span> {log.metadata.email}
                          </p>
                        )}
                        {log.metadata?.status && (
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-semibold">Status:</span> {log.metadata.status}
                          </p>
                        )}
                        {log.metadata?.role && (
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-semibold">Role:</span> {log.metadata.role}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {dayjs(log.createdAt).fromNow() === "a few seconds ago" ? "Just now" : dayjs(log.createdAt).fromNow()}
                      <p className="text-xs">{dayjs(log.createdAt).format("DD MMM YYYY HH:mm")}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} activities
              </p>
              <div className="flex gap-2">
                <button
                  className="btn-secondary px-3 py-2 text-sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  type="button"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }).map((_, idx) => (
                    <button
                      key={idx + 1}
                      className={`rounded px-3 py-2 text-sm font-medium transition ${
                        pagination.page === idx + 1
                          ? "bg-brand-600 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => handlePageChange(idx + 1)}
                      type="button"
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button
                  className="btn-secondary px-3 py-2 text-sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState title="No activity logs found" description="No system activities yet." />
      )}
    </div>
  );
}

export default ActivityLogsPage;
