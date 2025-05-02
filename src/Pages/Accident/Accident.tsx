import AccidentTable from "../../Components/Accident/Tables/AccidentTable";
import { useTheme } from "../../contexts/ThemeContext";

export default function Accident() {
  document.title = "Incidenti | MP Insurance";
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-black" : "bg-slate-50"}`}>
      <header className={`${isDarkMode ? "bg-black" : "bg-slate-50"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Incidenti
            </h1>
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
