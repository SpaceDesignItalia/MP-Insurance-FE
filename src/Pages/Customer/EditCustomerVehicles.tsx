import EditCustomerVehiclesModel from "../../Components/Customer/Other/EditCustomerVehiclesModel";

export default function EditCustomerVehicles() {
  document.title = "Modifica veicoli | MP Insurance";

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Modifica veicoli
          </h1>
        </div>
      </header>
      <main>
        <EditCustomerVehiclesModel />
      </main>
    </div>
  );
}
