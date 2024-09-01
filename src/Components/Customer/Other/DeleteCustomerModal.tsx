import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import axios from "axios";

interface CustomerProps {
  clientId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface DeleteCustomerModalProps {
  isOpen: boolean;
  isClosed: () => void;
  CustomerData: CustomerProps;
}

export default function DeleteCustomerModal({
  isOpen,
  isClosed,
  CustomerData,
}: DeleteCustomerModalProps) {
  function handleDeleteCustomer() {
    axios
      .delete("/customer/DELETE/DeleteCustomer", {
        params: { clientId: CustomerData.clientId },
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
              Si conferma di eliminare il cliente: {CustomerData.firstName}{" "}
              {CustomerData.lastName}
            </ModalHeader>
            <ModalBody>
              <div className="mt-6 border-t border-gray-100">
                <p className="text-sm font-medium leading-6 text-gray-900">
                  <span className="text-red-400 font-bold">Attenzione:</span> Si
                  desidera confermare che l'operazione di eliminazione di un
                  cliente è definitiva e non può essere annullata. Una volta
                  confermata l'eliminazione, tutti i dati associati al cliente
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
                  onClick={handleDeleteCustomer}
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
