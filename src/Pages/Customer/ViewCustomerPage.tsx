import ViewCustomerModel from "../../Components/Customer/Other/ViewCustomerModel";

export default function ViewCustomerPage() {
  document.title = "Dettagli cliente | MP Insurance";
  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Dettagli cliente
          </h1>
        </div>
      </header>
      <main>
        <ViewCustomerModel />
      </main>
    </div>
  );
}
