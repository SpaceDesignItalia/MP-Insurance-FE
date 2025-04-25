import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface AccidentProps {
  accidentId: number;
  date: string;
  description: string;
  status: string;
  customerName: string;
  policyNumber: string;
}

const columns = [
  { name: "DATA", uid: "date" },
  { name: "DESCRIZIONE", uid: "description" },
  { name: "STATO", uid: "status" },
  { name: "CLIENTE", uid: "customerName" },
  { name: "POLIZZA", uid: "policyNumber" },
  { name: "AZIONI", uid: "actions" },
];

export default function AccidentTable() {
  const [accidents, setAccidents] = useState<AccidentProps[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAccidents();
  }, []);

  const fetchAccidents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/Accident/GET/GetAllAccidents", {
        withCredentials: true,
      });
      setAccidents(response.data);
    } catch (error) {
      console.error("Errore nel recupero degli incidenti:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchAccident = async (searchQuery: string) => {
    if (searchQuery.trim() === "") {
      fetchAccidents();
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("/Accident/GET/SearchAccident", {
        params: { searchTerm: searchQuery },
        withCredentials: true,
      });

      if (res.status === 200) {
        setAccidents(res.data);
      }
    } catch (error) {
      console.error("Errore nella ricerca dell'incidente: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    const timeoutId = setTimeout(() => {
      searchAccident(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const pages = Math.ceil(accidents.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return accidents.slice(start, end);
  }, [page, accidents, rowsPerPage]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-end">
          <Input
            variant="bordered"
            radius="full"
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Cerca incidente per descrizione o cliente..."
            value={searchQuery}
            onChange={handleSearchQuery}
            startContent={
              <Icon
                icon="solar:magnifer-linear"
                width={18}
                className="text-default-400"
              />
            }
            endContent={
              searchQuery ? (
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => {
                    setSearchQuery("");
                    fetchAccidents();
                  }}
                >
                  <Icon icon="solar:close-circle-linear" width={16} />
                </Button>
              ) : null
            }
          />
          <div className="flex gap-3">
            <Button
              as={Link}
              href="./accident/add-accident"
              color="primary"
              radius="full"
              variant="solid"
              endContent={<Icon icon="mingcute:add-fill" width={16} />}
            >
              Aggiungi incidente
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {accidents.length > 0
              ? `${accidents.length} incidenti trovati`
              : "Nessun incidente trovato"}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Righe per pagina:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-2"
              onChange={() => setPage(1)}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [searchQuery, accidents.length]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="text-default-400 text-small">
          {accidents.length > 0 ? `Pagina ${page} di ${pages}` : ""}
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
  }, [page, pages, accidents.length]);

  const renderCell = React.useCallback(
    (accident: AccidentProps, columnKey: any) => {
      switch (columnKey) {
        case "date":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">
                {new Date(accident.date).toLocaleDateString()}
              </p>
            </div>
          );
        case "description":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{accident.description}</p>
            </div>
          );
        case "status":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{accident.status}</p>
            </div>
          );
        case "customerName":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{accident.customerName}</p>
            </div>
          );
        case "policyNumber":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{accident.policyNumber}</p>
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
                <DropdownMenu aria-label="Accident Actions">
                  <DropdownItem
                    key="view"
                    startContent={<Icon icon="solar:eye-linear" width={16} />}
                    as={Link}
                    onPress={() => {
                      window.location.href = `/accidents/view-accident/${accident.accidentId}`;
                    }}
                  >
                    Visualizza dettagli
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    startContent={<Icon icon="solar:pen-linear" width={16} />}
                    as={Link}
                    onPress={() => {
                      window.location.href = `/accidents/edit-accident/${accident.accidentId}`;
                    }}
                  >
                    Modifica
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return null;
      }
    },
    []
  );

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={`loading-row-${index}`}>
          {columns.map((column) => (
            <TableCell key={`loading-cell-${column.uid}`}>
              <Skeleton className="rounded-lg">
                <div className="h-12 w-full"></div>
              </Skeleton>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );

  return (
    <Card shadow="sm" className="border-none">
      <CardBody className="p-0">
        <Table
          aria-label="Accident table"
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
              loading ? (
                <LoadingSkeleton />
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Icon
                    icon="solar:warning-linear"
                    width={48}
                    className="text-default-300 mb-3"
                  />
                  <p className="text-default-500">
                    {searchQuery
                      ? "Nessun incidente corrisponde alla ricerca"
                      : "Non sono presenti incidenti"}
                  </p>
                </div>
              )
            }
            loadingContent={<LoadingSkeleton />}
            loadingState={loading ? "loading" : "idle"}
          >
            {(item) => (
              <TableRow key={item.accidentId}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
} 