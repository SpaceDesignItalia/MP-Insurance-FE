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
}

interface RenewSixPolicyModalProps {
  isOpen: boolean;
  isClosed: () => void;
  PolicyData: Policy;
}

export default function RenewSixPolicyModal({
  isOpen,
  isClosed,
  PolicyData,
}: RenewSixPolicyModalProps) {
  function handleRenewSixPolicy() {
    console.log(PolicyData.policyId);
    axios
      .put("/policy/UPDATE/RenewSixPolicy", {
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
              Si conferma di rinnovare per altri 6 mesi la polizza di{" "}
              {PolicyData.fullName}
            </ModalHeader>
            <ModalBody>
              <div className="mt-6 border-t border-gray-100">
                <p className="text-sm font-medium leading-6 text-gray-900">
                  <span className="text-warning font-bold">Attenzione:</span> Si
                  desidera confermare che l'operazione di rinnovo di una polizza
                  è definitiva e non può essere annullata. Una volta confermato
                  il rinnovo, tutti i dati associati alla polizza verranno
                  aggiornati in modo permanente. Sei assolutamente sicuro di
                  voler procedere con il rinnovo?
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex justify-end">
                <Button
                  color="warning"
                  variant="light"
                  onClick={handleRenewSixPolicy}
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
