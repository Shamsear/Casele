import { AdminKPISkeleton, AdminTableSkeleton } from "@/components/admin/admin-skeletons";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Placeholder */}
      <div className="space-y-2 animate-pulse">
        <div className="h-8 w-64 rounded-xl bg-neutral-200" />
        <div className="h-4 w-96 rounded-lg bg-neutral-100" />
      </div>

      {/* KPI Cards Placeholder */}
      <AdminKPISkeleton />

      {/* Table Placeholder */}
      <div className="space-y-3">
        <div className="h-5 w-40 rounded-lg bg-neutral-200 animate-pulse" />
        <AdminTableSkeleton rows={4} cols={5} />
      </div>
    </div>
  );
}
