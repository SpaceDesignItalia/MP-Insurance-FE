import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Pagination,
  Button,
  Input,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Link,
} from "@nextui-org/react";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import axios from "axios";
import ViewPolicyModal from "../Other/ViewPolicyModal";
import DeletePolicyModal from "../Other/DeletePolicyModal";

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

// Mappa dei colori per i vari stati della polizza
const statusColorMap: Record<string, string> = {
  Attiva: "success",
  Interrotta: "danger",
  Scadenza: "warning",
  Pagato: "success",
  NonPagato: "warning",
  Rate: "primary",
};

const policyTypeFilter = [
  { value: "0", label: "Tutti" },
  { value: "1", label: "RCA" },
  { value: "2", label: "Furto/Incendio" },
  { value: "3", label: "Infortuni" },
  { value: "4", label: "Assistenza stradale" },
];

export default function PolicyTable() {
  const columns = [
    { name: "Cliente", uid: "fullName" },
    { name: "Veicolo", uid: "typeId" },
    { name: "Tipo di polizza", uid: "insuranceType" },
    { name: "Durata", uid: "duration" },
    { name: "Prezzo (€)", uid: "amount" },
    { name: "Data di inizio", uid: "startDate" },
    { name: "Data di fine", uid: "endDate" },
    { name: "Stato", uid: "status" },
    { name: "Stato Pagamento", uid: "paymentStatus" },
    { name: "Azioni", uid: "actions" },
  ];

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [searchFilter, setSearchFilter] = useState<SearchFilter>({
    searchTerms: "",
    vehicleTypeId: "0",
    policyTypeId: "0",
    duration: "0",
    state: "0",
    paymentStatus: "0",
  });
  const [policies, setPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    axios
      .get("/Policy/GET/GetAllPolicies", { withCredentials: true })
      .then((res) => {
        setPolicies(res.data);
      });
  }, []);

  const handleSearchFilterChange = (key: keyof SearchFilter, value: any) => {
    setSearchFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);
  const [ViewModalData, setViewModalData] = useState<ViewModalData>({
    open: false,
    Policy: {} as Policy,
  });
  const [DeleteModalData, setDeleteModalData] = useState<ViewModalData>({
    open: false,
    Policy: {} as Policy,
  });

  useEffect(() => {
    axios
      .get("/Policy/GET/SearchPolicy", {
        params: searchFilter,
        withCredentials: true,
      })
      .then((res) => {
        setFilteredPolicies(res.data);
      });
  }, [searchFilter, policies]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredPolicies.slice(start, end);
  }, [page, filteredPolicies]);

  const pages = Math.ceil(filteredPolicies.length / rowsPerPage);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-end">
          <div className="flex flex-row gap-5 w-full">
            <Input
              isClearable
              variant="bordered"
              radius="sm"
              className="w-full sm:w-1/3"
              placeholder="Cerca polizza per cliente o targa..."
              startContent={<SearchRoundedIcon />}
              onChange={(e) =>
                handleSearchFilterChange("searchTerms", e.target.value)
              }
            />
            <Popover placement="bottom">
              <PopoverTrigger>
                <Button
                  color="primary"
                  radius="sm"
                  startContent={<FilterListRoundedIcon />}
                >
                  Filtri
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[350px]">
                <h2 className="font-semibold px-4 pt-3 w-full">Filtri:</h2>
                <div className="p-4 flex flex-col gap-3 w-full">
                  <p>Tipologia Veicolo: </p>
                  <Select
                    variant="bordered"
                    radius="sm"
                    selectedKeys={[searchFilter.vehicleTypeId]}
                    onChange={(e) =>
                      handleSearchFilterChange("vehicleTypeId", e.target.value)
                    }
                  >
                    <SelectItem key="0" value="">
                      Tutti
                    </SelectItem>
                    <SelectItem key="2" value="2">
                      Auto
                    </SelectItem>
                    <SelectItem key="1" value="3">
                      Moto
                    </SelectItem>
                  </Select>
                  <p>Tipo di polizza: </p>
                  <Select
                    variant="bordered"
                    radius="sm"
                    placeholder="Tipo di polizza"
                    selectedKeys={[searchFilter.policyTypeId]}
                    onChange={(e) =>
                      handleSearchFilterChange("policyTypeId", e.target.value)
                    }
                  >
                    {policyTypeFilter.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <p>Durata: </p>
                  <Select
                    variant="bordered"
                    radius="sm"
                    selectedKeys={[searchFilter.duration]}
                    onChange={(e) =>
                      handleSearchFilterChange("duration", e.target.value)
                    }
                  >
                    <SelectItem key="0" value="">
                      Tutte
                    </SelectItem>
                    <SelectItem key="6" value="6">
                      6 mesi
                    </SelectItem>
                    <SelectItem key="12" value="12">
                      1 anno
                    </SelectItem>
                  </Select>
                  <p>Stato: </p>
                  <Select
                    variant="bordered"
                    radius="sm"
                    selectedKeys={[searchFilter.state]}
                    onChange={(e) =>
                      handleSearchFilterChange("state", e.target.value)
                    }
                  >
                    <SelectItem key="0" value="">
                      Tutti
                    </SelectItem>
                    <SelectItem key="1" value="attiva">
                      Attiva
                    </SelectItem>
                    <SelectItem key="2" value="scadenza">
                      Scadenza
                    </SelectItem>
                    <SelectItem key="3" value="interrotta">
                      Interrotta
                    </SelectItem>
                  </Select>
                  <p>Stato Pagamento: </p>
                  <Select
                    variant="bordered"
                    radius="sm"
                    selectedKeys={[searchFilter.paymentStatus]}
                    onChange={(e) =>
                      handleSearchFilterChange("paymentStatus", e.target.value)
                    }
                  >
                    <SelectItem key="0" value="">
                      Tutti
                    </SelectItem>
                    <SelectItem key="1" value="pagato">
                      Pagato
                    </SelectItem>
                    <SelectItem key="2" value="nonPagato">
                      Non Pagato
                    </SelectItem>
                    <SelectItem key="3" value="rate">
                      Pagamento a Rate
                    </SelectItem>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              as={Link}
              href="/policy/add-policy"
              color="primary"
              radius="sm"
              endContent={<PostAddRoundedIcon />}
              fullWidth
            >
              Crea nuova polizza
            </Button>
          </div>
        </div>
      </div>
    );
  }, [searchFilter]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center w-full">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages || 1}
          onChange={setPage}
        />
      </div>
    );
  }, [page, pages]);

  const renderCell = (policy: Policy, columnKey: string): React.ReactNode => {
    const cellValue = policy[columnKey as keyof Policy];

    switch (columnKey) {
      case "fullName":
        return (
          <div className="flex flex-col">
            <div className="font-medium">{policy.fullName}</div>
            <div className="text-sm text-gray-500">{policy.email}</div>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[policy.status]}
            size="sm"
            variant="flat"
          >
            {policy.status}
          </Chip>
        );
      case "paymentStatus":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[policy.paymentStatus]}
            size="sm"
            variant="flat"
          >
            {policy.paymentStatus}
          </Chip>
        );
      case "typeId":
        return policy.typeId === "2" ? (
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="flex flex-row gap-2 justify-center items-center">
              <DirectionsCarRoundedIcon />
              Auto
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">Targa: </span>
              {policy.licensePlate}
            </div>
          </div>
        ) : (
          <div className="flex flex-row gap-2 justify-center items-center">
            <TwoWheelerRoundedIcon />
            Moto
          </div>
        );
      case "startDate":
        return dayjs(policy.startDate).format("DD/MM/YYYY");
      case "endDate":
        return dayjs(policy.endDate).format("DD/MM/YYYY");
      case "insuranceType":
        return (
          <ul className="list-disc">
            {policy.types.map((type: string, index) => {
              return <li key={index}>{type}</li>;
            })}
          </ul>
        );
      case "duration":
        return (
          <>
            {policy.duration === 12 ? "1 anno" : <p>{policy.duration} mesi</p>}
          </>
        );
      case "amount":
        return <p>€ {policy.amount}</p>;
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <div
              onClick={() =>
                setViewModalData({
                  ...ViewModalData,
                  open: true,
                  Policy: policy,
                })
              }
            >
              <Tooltip content="Dettagli polizza" closeDelay={0} showArrow>
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <RemoveRedEyeRoundedIcon />
                </span>
              </Tooltip>
            </div>
            <div
              onClick={() =>
                setDeleteModalData({
                  ...DeleteModalData,
                  open: true,
                  Policy: policy,
                })
              }
            >
              <Tooltip
                color="danger"
                content="Rimuovi polizza"
                closeDelay={0}
                showArrow
              >
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <DeleteRoundedIcon />
                </span>
              </Tooltip>
            </div>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <ViewPolicyModal
        isOpen={ViewModalData.open}
        isClosed={() => setViewModalData({ ...ViewModalData, open: false })}
        PolicyData={ViewModalData.Policy}
      />
      <DeletePolicyModal
        isOpen={DeleteModalData.open}
        isClosed={() => setDeleteModalData({ ...DeleteModalData, open: false })}
        PolicyData={DeleteModalData.Policy}
      />
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
        Polizze
      </h2>

      <Table
        aria-label="All policies"
        topContent={topContent}
        bottomContent={bottomContent}
        isStriped
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.policyId}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
