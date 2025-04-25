import AccidentTable from "../../Components/Accident/Tables/AccidentTable";

export default function Accident() {
  document.title = "Incidenti | MP Insurance";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black">Incidenti</h1>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <AccidentTable />
        </div>
      </main>
    </div>
  );
}

