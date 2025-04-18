import {
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import DeletePolicyModal from "../Other/DeletePolicyModal";
import RenewSixPolicyModal from "../Other/RenewSixPolicyModal";
import ViewPolicyModal from "../Other/ViewPolicyModal";

interface Policy {
  policyId: number;
  fullName: string;
  email: string;
  typeId: string;
  duration: number;
  amount: string;
  startDate: string;
  endDate: string;
  licensePlate: string;
  status: string;
  insuranceType: string;
  paymentStatus: string;
  types: string[];
  note: string;
}

interface SearchFilter {
  searchTerms: string;
  vehicleTypeId: string;
  policyTypeId: string;
  duration: string;
  state: string;
  paymentStatus: string;
}

interface ViewModalData {
  open: boolean;
  Policy: Policy;
}

interface DeleteModalData {
  open: boolean;
  Policy: Policy;
}

interface RenewSixModalData {
  open: boolean;
  Policy: Policy;
}

interface PolicyTypeFilter {
  insuranceTypeId: string;
  name: string;
}

// Mappa dei colori per i vari stati della polizza
const statusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "primary" | "default" | "secondary"
> = {
  Attiva: "success",
  Terminata: "danger",
  "In Scadenza": "warning",
  "In Scadenza 6 mesi": "warning",
  "Terminata 6 mesi": "danger",
  Sospesa: "warning",
  Pagato: "success",
  "Non Pagato": "danger",
  Rate: "primary",
};

export default function PolicyTable() {
  const columns = [
    { name: "CLIENTE", uid: "fullName" },
    { name: "VEICOLO", uid: "vehicle" },
    { name: "DURATA", uid: "duration" },
    { name: "PREZZO", uid: "amount" },
    { name: "DATA", uid: "dates" },
    { name: "STATO", uid: "statuses" },
    { name: "AZIONI", uid: "actions" },
  ];

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();

  let [policyTypeFilter, setPolicyTypeFilter] = useState<PolicyTypeFilter[]>(
    []
  );

  useEffect(() => {
    axios
      .get("/Company/GET/GetAllInsuranceTypes", { withCredentials: true })
      .then((res) => {
        const updatedPolicyTypeFilter = [
          { insuranceTypeId: "0", name: "Tutti" },
          ...res.data,
        ];
        setPolicyTypeFilter(updatedPolicyTypeFilter);
      });
  }, []);

  const [searchFilter, setSearchFilter] = useState<SearchFilter>({
    searchTerms: "",
    vehicleTypeId: "0",
    policyTypeId: "0",
    duration: "0",
    state: "0",
    paymentStatus: "0",
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/Policy/GET/GetAllPolicies", {
        withCredentials: true,
      });
      setFilteredPolicies(res.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
    } finally {
      setLoading(false);
    }
  };

  async function downloadExcel() {
    try {
      // Scarica il file per le polizze di 12 mesi
      const res12 = await axios.get("FileGenerator/GET/GetMonthPolicyExcel", {
        params: { type: "12" },
        responseType: "blob",
        withCredentials: true,
      });

      if (res12.status === 200) {
        saveAs(res12.data, "Polizze_12_Mesi.xlsx");
      }

      // Scarica il file per le polizze di 6 mesi
      const res6 = await axios.get("FileGenerator/GET/GetMonthPolicyExcel", {
        params: { type: "6" },
        responseType: "blob",
        withCredentials: true,
      });

      if (res6.status === 200) {
        saveAs(res6.data, "Polizze_6_Mesi.xlsx");
      }
    } catch (error) {
      console.error("Errore durante il download dei file:", error);
    }
  }

  const handleSearchFilterChange = (key: keyof SearchFilter, value: any) => {
    setSearchFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchQueryChange = (value: string) => {
    setSearchFilter((prev) => ({
      ...prev,
      searchTerms: value,
    }));

    if (value === "") {
      fetchPolicies();
    }
  };

  const clearFilters = () => {
    setSearchFilter({
      searchTerms: "",
      vehicleTypeId: "0",
      policyTypeId: "0",
      duration: "0",
      state: "0",
      paymentStatus: "0",
    });
    fetchPolicies();
    onFilterClose();
  };

  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);
  const [ViewModalData, setViewModalData] = useState<ViewModalData>({
    open: false,
    Policy: {} as Policy,
  });
  const [DeleteModalData, setDeleteModalData] = useState<DeleteModalData>({
    open: false,
    Policy: {} as Policy,
  });
  const [RenewSixModalData, setRenewSixModalData] = useState<RenewSixModalData>(
    {
      open: false,
      Policy: {} as Policy,
    }
  );

  useEffect(() => {
    const fetchFilteredPolicies = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/Policy/GET/SearchPolicy", {
          params: searchFilter,
          withCredentials: true,
        });
        setFilteredPolicies(res.data);
      } catch (error) {
        console.error("Error searching policies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredPolicies();
  }, [searchFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredPolicies.slice(start, end);
  }, [page, filteredPolicies, rowsPerPage]);

  const pages = Math.ceil(filteredPolicies.length / rowsPerPage);

  const countActiveFilters = () => {
    let count = 0;
    if (searchFilter.vehicleTypeId !== "0") count++;
    if (searchFilter.policyTypeId !== "0") count++;
    if (searchFilter.duration !== "0") count++;
    if (searchFilter.state !== "0") count++;
    if (searchFilter.paymentStatus !== "0") count++;
    return count;
  };

  const activeFiltersCount = countActiveFilters();

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
          <Input
            isClearable
            variant="bordered"
            radius="full"
            className="w-full sm:max-w-[44%]"
            classNames={{
              inputWrapper: "border-1",
            }}
            placeholder="Cerca polizza per cliente o targa..."
            value={searchFilter.searchTerms}
            startContent={
              <Icon
                icon="solar:magnifer-linear"
                width={18}
                className="text-default-400"
              />
            }
            onChange={(e) => handleSearchQueryChange(e.target.value)}
            onClear={() => handleSearchQueryChange("")}
          />
          <div className="flex gap-3">
            <Button
              color={activeFiltersCount > 0 ? "primary" : "default"}
              radius="full"
              variant={activeFiltersCount > 0 ? "solid" : "bordered"}
              startContent={<Icon icon="solar:filter-linear" width={16} />}
              endContent={
                activeFiltersCount > 0 && (
                  <Badge size="sm">{activeFiltersCount}</Badge>
                )
              }
              onPress={onFilterOpen}
            >
              Filtri
            </Button>
            <Button
              color="primary"
              radius="full"
              variant="flat"
              startContent={
                <Icon icon="solar:file-download-outline" width={16} />
              }
              onPress={downloadExcel}
            >
              Esporta
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {filteredPolicies.length > 0
              ? `${filteredPolicies.length} polizze trovate`
              : "Nessuna polizza trovata"}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Righe per pagina:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-2"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [searchFilter, filteredPolicies.length, activeFiltersCount, rowsPerPage]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="text-default-400 text-small">
          {filteredPolicies.length > 0 ? `Pagina ${page} di ${pages}` : ""}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          radius="full"
        />
      </div>
    );
  }, [page, pages, filteredPolicies.length]);

  const getVehicleType = (typeId: string): ReactNode => {
    return (
      <Icon
        icon={typeId === "1" ? "mingcute:ebike-line" : "mingcute:car-3-line"}
        width={30}
        className="text-default-600"
      />
    );
  };

  const renderCell = (policy: Policy, columnKey: string): React.ReactNode => {
    switch (columnKey) {
      case "fullName":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{policy.fullName}</p>
            <p className="text-bold text-tiny text-default-400">
              {policy.email}
            </p>
          </div>
        );

      case "vehicle":
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {getVehicleType(policy.typeId)}
            </div>
            <p className="text-bold text-tiny text-default-400">
              {policy.licensePlate}
            </p>
            <p className="text-bold text-tiny text-default-500">
              {policy.insuranceType}
            </p>
          </div>
        );

      case "duration":
        return (
          <div className="flex items-center">
            <Badge
              content={`${policy.duration}m`}
              color="primary"
              size="sm"
              variant="solid"
            >
              <Icon icon="solar:calendar-linear" width={18} />
            </Badge>
          </div>
        );

      case "amount":
        return (
          <div className="flex items-center justify-start">
            <span className="text-bold text-small">€ {policy.amount}</span>
          </div>
        );

      case "dates":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-tiny text-default-500">
              <Icon
                icon="solar:calendar-mark-linear"
                className="mr-1 inline"
                width={14}
              />
              {dayjs(policy.startDate).format("DD/MM/YYYY")}
            </p>
            <p className="text-bold text-tiny text-default-500">
              <Icon
                icon="solar:calendar-end-linear"
                className="mr-1 inline"
                width={14}
              />
              {dayjs(policy.endDate).format("DD/MM/YYYY")}
            </p>
          </div>
        );

      case "statuses":
        return (
          <div className="flex flex-col gap-2">
            <Chip
              className="capitalize"
              color={statusColorMap[policy.status] || "default"}
              size="sm"
              variant="flat"
              startContent={
                <Icon icon="solar:shield-keyhole-linear" width={14} />
              }
            >
              {policy.status}
            </Chip>
            <Chip
              className="capitalize"
              color={statusColorMap[policy.paymentStatus] || "default"}
              size="sm"
              variant="flat"
              startContent={
                <Icon icon="solar:wallet-money-linear" width={14} />
              }
            >
              {policy.paymentStatus}
            </Chip>
          </div>
        );

      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <Icon icon="solar:menu-dots-bold" width={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Policy Actions">
                <DropdownItem
                  key="view"
                  startContent={<Icon icon="solar:eye-linear" width={16} />}
                  onPress={() =>
                    setViewModalData({
                      ...ViewModalData,
                      open: true,
                      Policy: policy,
                    })
                  }
                >
                  Visualizza dettagli
                </DropdownItem>
                <DropdownItem
                  key="renew"
                  startContent={<Icon icon="solar:restart-linear" width={16} />}
                  onPress={() =>
                    setRenewSixModalData({
                      ...RenewSixModalData,
                      open: true,
                      Policy: policy,
                    })
                  }
                >
                  Rinnova polizza
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  startContent={
                    <Icon icon="solar:trash-bin-trash-linear" width={16} />
                  }
                  color="danger"
                  className="text-danger"
                  onPress={() =>
                    setDeleteModalData({
                      ...DeleteModalData,
                      open: true,
                      Policy: policy,
                    })
                  }
                >
                  Elimina polizza
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card shadow="sm" className="border-none">
      <CardBody className="p-0">
        <ViewPolicyModal
          isOpen={ViewModalData.open}
          isClosed={() => setViewModalData({ ...ViewModalData, open: false })}
          PolicyData={ViewModalData.Policy}
        />
        <DeletePolicyModal
          isOpen={DeleteModalData.open}
          isClosed={() =>
            setDeleteModalData({ ...DeleteModalData, open: false })
          }
          PolicyData={{
            policyId: Number(DeleteModalData.Policy.policyId),
            fullName: DeleteModalData.Policy.fullName,
          }}
        />
        <RenewSixPolicyModal
          isOpen={RenewSixModalData.open}
          isClosed={() =>
            setRenewSixModalData({ ...RenewSixModalData, open: false })
          }
          PolicyData={{
            policyId: Number(RenewSixModalData.Policy.policyId),
            fullName: "",
          }}
        />

        <Modal
          isOpen={isFilterOpen}
          onClose={onFilterClose}
          backdrop="blur"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Filtri avanzati
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 gap-4">
                <Select
                  variant="bordered"
                  radius="sm"
                  label="Tipologia Veicolo"
                  selectedKeys={[searchFilter.vehicleTypeId]}
                  onChange={(e) =>
                    handleSearchFilterChange("vehicleTypeId", e.target.value)
                  }
                  className="w-full"
                >
                  <SelectItem key="0">Tutte</SelectItem>
                  <SelectItem key="1">Moto</SelectItem>
                  <SelectItem key="2">Auto</SelectItem>
                </Select>

                <Select
                  variant="bordered"
                  radius="sm"
                  label="Tipo di polizza"
                  selectedKeys={[searchFilter.policyTypeId]}
                  onChange={(e) =>
                    handleSearchFilterChange("policyTypeId", e.target.value)
                  }
                  className="w-full"
                >
                  {policyTypeFilter.map((type) => (
                    <SelectItem key={String(type.insuranceTypeId)}>
                      {type.name}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  variant="bordered"
                  radius="sm"
                  label="Frazionamento"
                  selectedKeys={[searchFilter.duration]}
                  onChange={(e) =>
                    handleSearchFilterChange("duration", e.target.value)
                  }
                  className="w-full"
                >
                  <SelectItem key="0">Tutte</SelectItem>
                  <SelectItem key="6">6 mesi</SelectItem>
                  <SelectItem key="12">12 mesi</SelectItem>
                </Select>

                <Select
                  variant="bordered"
                  radius="sm"
                  label="Stato Polizza"
                  selectedKeys={[searchFilter.state]}
                  onChange={(e) =>
                    handleSearchFilterChange("state", e.target.value)
                  }
                  className="w-full"
                >
                  <SelectItem key="0">Tutte</SelectItem>
                  <SelectItem key="1">Attiva</SelectItem>
                  <SelectItem key="2">In Scadenza</SelectItem>
                  <SelectItem key="3">Terminata</SelectItem>
                  <SelectItem key="4">In Scadenza 6 mesi</SelectItem>
                  <SelectItem key="5">Terminata 6 mesi</SelectItem>
                  <SelectItem key="6">Sospesa</SelectItem>
                </Select>

                <Select
                  variant="bordered"
                  radius="sm"
                  label="Stato Pagamento"
                  selectedKeys={[searchFilter.paymentStatus]}
                  onChange={(e) =>
                    handleSearchFilterChange("paymentStatus", e.target.value)
                  }
                  className="w-full"
                >
                  <SelectItem key="0">Tutte</SelectItem>
                  <SelectItem key="1">Pagato</SelectItem>
                  <SelectItem key="2">Non Pagato</SelectItem>
                  <SelectItem key="3">Rate</SelectItem>
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={clearFilters}>
                Reset filtri
              </Button>
              <Button color="primary" onPress={onFilterClose}>
                Applica filtri
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Table
          aria-label="Policy table"
          topContent={topContent}
          bottomContent={bottomContent}
          isStriped
          isHeaderSticky
          classNames={{
            base: "max-h-[calc(100vh-16.5rem)]",
            table: "min-h-[400px]",
            thead: "bg-default-50 [&>tr]:first:shadow-none",
            th: "bg-default-50 text-default-500 text-xs font-semibold",
            tr: "transition-all hover:bg-default-50",
            td: "py-3",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "end" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={items}
            emptyContent={
              <div className="flex flex-col items-center justify-center py-10">
                <Icon
                  icon="solar:document-broken"
                  width={48}
                  className="text-default-300 mb-3"
                />
                <p className="text-default-500">
                  {searchFilter.searchTerms || activeFiltersCount > 0
                    ? "Nessuna polizza corrisponde ai criteri di ricerca"
                    : "Non sono presenti polizze"}
                </p>
              </div>
            }
          >
            {(item) => (
              <TableRow key={item.policyId.toString()}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, String(columnKey))}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
