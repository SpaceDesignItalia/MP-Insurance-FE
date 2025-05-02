import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface Policy {
  id: number;
  policyNumber: string;
  customerName: string;
  vehiclePlate: string;
}

interface AddAccidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddAccidentModal({
  isOpen,
  onClose,
  onSuccess,
}: AddAccidentModalProps) {
  const [loading, setLoading] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    description: "",
    policyId: "",
    estimatedAmount: "",
    deductible: "",
    responsibilityPercentage: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchPolicies();
    }
  }, [isOpen]);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("/Policy/GET/GetActivePolicies", {
        withCredentials: true,
      });
      setPolicies(res.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "/Accident/POST/CreateAccident",
        {
          ...formData,
          policyId: Number(formData.policyId),
          estimatedAmount: Number(formData.estimatedAmount),
          deductible: Number(formData.deductible),
          responsibilityPercentage: Number(formData.responsibilityPercentage),
        },
        { withCredentials: true }
      );
      onSuccess();
    } catch (error) {
      console.error("Error creating accident:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      className={isDarkMode ? "bg-gray-900" : ""}
    >
      <ModalContent className={isDarkMode ? "bg-gray-900 border-gray-700" : ""}>
        <form onSubmit={handleSubmit}>
          <ModalHeader
            className={`flex flex-col gap-1 ${isDarkMode ? "text-white" : ""}`}
          >
            Nuovo Incidente
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : ""
                  }`}
                >
                  Data
                </label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  classNames={{
                    input: isDarkMode ? "bg-gray-900 text-white" : "",
                    inputWrapper: isDarkMode
                      ? "bg-gray-900 border-gray-700"
                      : "",
                  }}
                />
              </div>
              <div className="space-y-2">
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : ""
                  }`}
                >
                  Ora
                </label>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  classNames={{
                    input: isDarkMode ? "bg-gray-900 text-white" : "",
                    inputWrapper: isDarkMode
                      ? "bg-gray-900 border-gray-700"
                      : "",
                  }}
                />
              </div>
              <div className="space-y-2">
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : ""
                  }`}
                >
                  Luogo
                </label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  classNames={{
                    input: isDarkMode ? "bg-gray-900 text-white" : "",
                    inputWrapper: isDarkMode
                      ? "bg-gray-900 border-gray-700"
                      : "",
                  }}
                />
              </div>
              <div className="space-y-2">
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : ""
                  }`}
                >
                  Polizza
                </label>
                <Select
                  name="policyId"
                  selectedKeys={[formData.policyId]}
                  onChange={handleSelectChange}
                  required
                  classNames={{
                    trigger: isDarkMode
                      ? "bg-gray-900 text-white border-gray-700"
                      : "",
                    base: isDarkMode ? "bg-gray-900" : "",
                    popoverContent: isDarkMode
                      ? "bg-gray-900 border-gray-700"
                      : "",
                    listbox: isDarkMode ? "bg-gray-900 text-white" : "",
                  }}
                  items={[
                    { id: "empty", text: "Seleziona una polizza" },
                    ...policies.map((policy) => ({
                      id: policy.id.toString(),
                      text: `${policy.policyNumber} - ${policy.customerName} - ${policy.vehiclePlate}`,
                    })),
                  ]}
                >
                  {(item) => (
                    <SelectItem
                      key={item.id}
                      className={
                        isDarkMode
                          ? "text-white data-[selected=true]:bg-primary-600"
                          : ""
                      }
                    >
                      {item.text}
                    </SelectItem>
                  )}
                </Select>
              </div>
              <div className="space-y-2">
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : ""
                  }`}
                >
                  Importo Stimato
                </label>
                <Input
                  type="number"
                  name="estimatedAmount"
                  value={formData.estimatedAmount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  classNames={{
                    input: isDarkMode ? "bg-gray-900 text-white" : "",
                    inputWrapper: isDarkMode
                      ? "bg-gray-900 border-gray-700"
                      : "",
                  }}
                />
              </div>
              <div className="space-y-2">
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : ""
                  }`}
                >
                  Franchigia
                </label>
                <Input
                  type="number"
                  name="deductible"
                  value={formData.deductible}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  classNames={{
                    input: isDarkMode ? "bg-gray-900 text-white" : "",
                    inputWrapper: isDarkMode
                      ? "bg-gray-900 border-gray-700"
                      : "",
                  }}
                />
              </div>
              <div className="space-y-2">
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : ""
                  }`}
                >
                  Percentuale Responsabilità
                </label>
                <Input
                  type="number"
                  name="responsibilityPercentage"
                  value={formData.responsibilityPercentage}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  step="1"
                  classNames={{
                    input: isDarkMode ? "bg-gray-900 text-white" : "",
                    inputWrapper: isDarkMode
                      ? "bg-gray-900 border-gray-700"
                      : "",
                  }}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : ""
                  }`}
                >
                  Descrizione
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  minRows={3}
                  classNames={{
                    input: isDarkMode ? "bg-gray-900 text-white" : "",
                    inputWrapper: isDarkMode
                      ? "bg-gray-900 border-gray-700"
                      : "",
                  }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className={isDarkMode ? "border-gray-700" : ""}>
            <Button
              variant="light"
              onPress={onClose}
              className={isDarkMode ? "text-gray-300" : ""}
            >
              Annulla
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={loading}
              startContent={<Icon icon="heroicons:plus" className="w-4 h-4" />}
            >
              Crea
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
