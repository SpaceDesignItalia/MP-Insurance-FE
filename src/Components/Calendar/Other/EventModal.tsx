import React from "react";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

interface Policy {
  policyId: string;
  endDate: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  licensePlate: string;
  brand: string;
  model: string;
  amount: number;
  companyName: string;
}

interface EventModalProps {
  isOpen: boolean;
  event: Policy | null;
  onClose: () => void;
}

export default function EventModal({
  isOpen,
  event,
  onClose,
}: EventModalProps) {
  if (!isOpen) return null; // Assicurati che il modal non venga renderizzato se non è aperto

  if (!event) return null; // Assicurati che l'evento sia definito

  return (
    <Modal isOpen={isOpen} onClose={onClose} aria-labelledby="modal-title">
      <ModalContent>
        <ModalHeader>
          Assicurazione di {event.firstName} {event.lastName}
        </ModalHeader>
        <ModalBody>
          <div>
            <p>
              <strong>Phone Number:</strong> {event.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {event.email}
            </p>
            <p>
              <strong>License Plate:</strong> {event.licensePlate}
            </p>
            <p>
              <strong>Car Brand:</strong> {event.brand}
            </p>
            <p>
              <strong>Car Model:</strong> {event.model}
            </p>
            <p>
              <strong>Expense:</strong> ${event.amount}
            </p>
            <p>
              <strong>Insurance Company:</strong> {event.companyName}
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <button onClick={onClose}>Close</button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
