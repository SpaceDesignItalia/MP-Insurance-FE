import AddPolicyModel from "../../Components/Dashboard/Other/AddPolicyModel";
import { Icon } from "@iconify/react";

export default function AddPolicyPage() {
  document.title = "Aggiungi polizza | MP Insurance";

  return (
    <div className="py-10">
      <header className="mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Icon
              icon="solar:shield-keyhole-bold"
              className="text-primary"
              width={32}
            />
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                Aggiungi polizza
              </h1>
              <p className="mt-2 text-gray-600">
                Inserisci i dettagli per creare una nuova polizza assicurativa
              </p>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <AddPolicyModel />
          </div>
        </div>
      </main>
    </div>
  );
}
