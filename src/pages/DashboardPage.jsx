import { useEffect } from "react";
import dayjs from "dayjs";

import PageHeader from "../components/common/PageHeader";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import StatusChip from "../components/common/StatusChip";
import { useAppDispatch, useAppSelector } from "../hooks/useAppHooks";
import { fetchDashboard } from "../features/dashboard/dashboardSlice";

function DashboardPage() {
  const dispatch = useAppDispatch();
  const { analytics, loading } = useAppSelector((state) => state.dashboard);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) return <Loader />;

  const cards = analytics
    ? [
        ...(user?.role === "Admin" ? [{ label: "Total Users", value: analytics.totalUsers }] : []),
        { label: "Total Projects", value: analytics.totalProjects },
        { label: "Pending Projects", value: analytics.statusCounts.Pending },
        { label: "Ending Soon", value: analytics.endingSoon.length },
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Operational visibility into team allocation, delivery movement, and upcoming deadlines."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="panel p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
            <p className="mt-3 text-4xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-6">
          <h2 className="text-lg font-semibold">Status Breakdown</h2>
          {analytics ? (
            <div className="mt-5 space-y-4">
              {Object.entries(analytics.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                  <StatusChip status={status} />
                  <span className="text-lg font-bold">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState title="No analytics yet" description="Dashboard data will appear after records are created." />
            </div>
          )}
        </div>

        <div className="panel p-6">
          <h2 className="text-lg font-semibold">Projects Ending Within 7 Days</h2>
          {analytics?.endingSoon?.length ? (
            <div className="mt-5 space-y-3">
              {analytics.endingSoon.map((project) => (
                <div
                  key={project._id}
                  className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Due {dayjs(project.endDate).format("DD MMM YYYY")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState title="Nothing urgent" description="No projects are ending within the next seven days." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
