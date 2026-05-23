import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { DataTable } from "@/components/DataTable";
import { getKpis, getTableData } from "@/lib/data";
import { type TableItem } from "@/lib/data/mock";

export default async function DashboardPage() {
  const [kpis, tableData] = await Promise.all([getKpis(), getTableData()]);

  const columns: { key: keyof TableItem; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "lastActive", label: "Last Active" },
  ];

  return (
    <div className="container mx-auto px-4 pb-12">
      <PageHeader
        title="Dashboard"
        description="Monitor your application performance and manage users."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Dashboard" },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            description={kpi.description}
            trend={kpi.trend}
            trendValue={kpi.trendValue}
          />
        ))}
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-xl font-semibold">User Management</h2>
        <DataTable columns={columns} data={tableData} />
      </div>
    </div>
  );
}
