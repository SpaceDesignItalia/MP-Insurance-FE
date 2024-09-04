import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import axios from "axios";

interface VehicleDataProps {
  vehicleId: number;
  brand: string;
  model: string;
  licensePlate: string;
  typeId: number;
}

interface DeleteVehicleModalProps {
  isOpen: boolean;
  isClosed: () => void;
  VehicleData: VehicleDataProps;
}

export default function DeleteehicleModal({
  isOpen,
  isClosed,
  VehicleData,
}: DeleteVehicleModalProps) {
  function handleDeleteVehicle() {
    axios
      .delete("/Vehicle/DELETE/DeleteVehicle", {
        params: { selectedVehicleId: VehicleData.vehicleId },
        withCredentials: true,
      })
      .then(() => {
        location.reload();
      });
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={isClosed}
      size="2xl"
      scrollBehavior="inside"
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {(isClosed) => (
          <>
            <ModalHeader>
              Si conferma di eliminare il veicolo: {VehicleData.brand}{" "}
              {VehicleData.model}
            </ModalHeader>
            <ModalBody>
              <div className="mt-6 border-t border-gray-100">
                <p className="text-sm font-medium leading-6 text-gray-900">
                  <span className="text-red-400 font-bold">Attenzione:</span> Si
                  desidera confermare che l'operazione di eliminazione di un
                  veicolo è definitiva e non può essere annullata. Una volta
                  confermata l'eliminazione, tutti i dati associati al veicolo
                  verranno rimossi in modo permanente e non sarà possibile
                  recuperarli. Si prega di procedere con cautela e assicurarsi
                  di aver considerato tutte le implicazioni di questa azione.
                  Sei assolutamente sicuro di voler procedere con
                  l'eliminazione?
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex justify-end">
                <Button
                  color="danger"
                  variant="light"
                  onClick={handleDeleteVehicle}
                  radius="sm"
                >
                  Conferma
                </Button>
                <Button
                  color="default"
                  variant="light"
                  onClick={isClosed}
                  radius="sm"
                >
                  Chiudi
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
