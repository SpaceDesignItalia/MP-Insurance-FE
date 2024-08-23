import AddPolicyModel from "../../Components/Dashboard/Other/AddPolicyModel";

export default function AddPolicyPage() {
  document.title = "Aggiungi polizza | MP Insurance";

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Aggiungi polizza
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto flex flex-col gap-5 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <AddPolicyModel />
        </div>
      </main>
    </div>
  );
}