import DashboardCards from "../../Components/Dashboard/Other/DashboardCards";
import PolicyTable from "../../Components/Dashboard/Tables/PolicyTable";
import { DocumentCheckIcon } from "@heroicons/react/24/outline";

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
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-black">
                  Performance Mensile
                </h2>
              </div>
              <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                <p className="text-slate-600 font-medium">
                  Grafico Performance
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-black">
                  Attività Recenti
                </h2>
                <button className="text-sm text-slate-700 hover:text-black font-medium transition-colors duration-200">
                  Vedi tutte
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-slate-200">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center ring-2 ring-emerald-100">
                      <DocumentCheckIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">
                      Nuova polizza stipulata
                    </p>
                    <p className="text-sm text-slate-600">Auto - Mario Rossi</p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-sm text-slate-500">2h fa</p>
                  </div>
                </div>
                {/* Altri elementi attività... */}
              </div>
            </div>
          </div>

          {/* Tabella Polizze */}
          <PolicyTable />
        </div>
      </main>
    </div>
  );
}
