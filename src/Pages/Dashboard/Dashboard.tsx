import DashboardCards from "../../Components/Dashboard/Other/DashboardCards";
import DataGraph from "../../Components/Dashboard/Other/DataGraph";
import RecentActivites from "../../Components/Dashboard/Other/RecentActivites";
import PolicyTable from "../../Components/Dashboard/Tables/PolicyTable";

export default function Dashboard() {
  document.title = "Dashboard | MP Insurance";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          {/* Statistiche Rapide */}
          <div className="w-full">
            <DashboardCards />
          </div>

          {/* Grafico e Attività Recenti */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <DataGraph />

            <RecentActivites />
          </div>

          {/* Tabella Polizze */}
          <PolicyTable />
        </div>
      </main>
    </div>
  );
}
