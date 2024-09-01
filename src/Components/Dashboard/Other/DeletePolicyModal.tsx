import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import axios from "axios";

interface Policy {
  policyId: number;
  fullName: string;
  email: string;
  typeId: string;
  duration: number;
  amount: string;
  startDate: Date;
  endDate: Date;
  licensePlate: string;
  status: string;
  insuranceType: string;
  paymentStatus: string;
  types: string[];
}

interface DeletePolicyModalProps {
  isOpen: boolean;
  isClosed: () => void;
  PolicyData: Policy;
}

export default function DeletePolicyModal({
  isOpen,
  isClosed,
  PolicyData,
}: DeletePolicyModalProps) {
  function handleDeletePolicy() {
    console.log(PolicyData.policyId);
    axios
      .delete("/policy/DELETE/DeletePolicy", {
        params: { policyId: PolicyData.policyId },
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
              Si conferma di eliminare la polizza di {PolicyData.fullName}
            </ModalHeader>
            <ModalBody>
              <div className="mt-6 border-t border-gray-100">
                <p className="text-sm font-medium leading-6 text-gray-900">
                  <span className="text-red-400 font-bold">Attenzione:</span> Si
                  desidera confermare che l'operazione di eliminazione di una
                  polizza è definitiva e non può essere annullata. Una volta
                  confermata l'eliminazione, tutti i dati associati alla polizza
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
                  onClick={handleDeletePolicy}
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
