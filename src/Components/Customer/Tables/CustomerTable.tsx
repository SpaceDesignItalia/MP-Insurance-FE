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
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DeleteCustomerModal from "../Other/DeleteCustomerModal";

interface CustomerProps {
  clientId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface DeleteModalData {
  open: boolean;
  customer: CustomerProps;
}

const columns = [
  { name: "CLIENTE", uid: "name" },
  { name: "CONTATTI", uid: "contacts" },
  { name: "AZIONI", uid: "actions" },
];

export default function CustomerTable() {
  const [customer, setCustomer] = useState<CustomerProps[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);
  const [deleteModalData, setDeleteModalData] = useState<DeleteModalData>({
    open: false,
    customer: {} as CustomerProps,
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/Customer/GET/GetAllCustomers", {
        withCredentials: true,
      });
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchCustomer = async (searchQuery: string) => {
    if (searchQuery.trim() === "") {
      fetchCustomers();
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("/Customer/GET/SearchCustomer", {
        params: { searchTerm: searchQuery },
        withCredentials: true,
      });

      if (res.status === 200) {
        setCustomer(res.data);
      }
    } catch (error) {
      console.error("Errore nella ricerca del cliente: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Use debounce to avoid too many API calls
    const timeoutId = setTimeout(() => {
      searchCustomer(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const pages = Math.ceil(customer.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return customer.slice(start, end);
  }, [page, customer, rowsPerPage]);

  // Get initials from name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

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
            placeholder="Cerca cliente per nome, email o telefono..."
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
                    fetchCustomers();
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
              href="./customers/add-customer"
              color="primary"
              radius="full"
              variant="solid"
              endContent={<Icon icon="mingcute:add-fill" width={16} />}
            >
              Aggiungi cliente
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {customer.length > 0
              ? `${customer.length} clienti trovati`
              : "Nessun cliente trovato"}
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
  }, [searchQuery, customer.length]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="text-default-400 text-small">
          {customer.length > 0 ? `Pagina ${page} di ${pages}` : ""}
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
  }, [page, pages, customer.length]);

  const renderCell = React.useCallback(
    (customer: CustomerProps, columnKey: any) => {
      switch (columnKey) {
        case "name":
          return (
            <div className="flex items-center gap-3">
              <Avatar
                name={getInitials(customer.firstName, customer.lastName)}
                size="sm"
                color="primary"
                isBordered
                className="text-small font-thin"
              />
              <div className="flex flex-col">
                <p className="text-bold text-sm">
                  {customer.firstName} {customer.lastName}
                </p>
              </div>
            </div>
          );
        case "contacts":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small flex items-center gap-1">
                <Icon
                  icon="solar:mailbox-linear"
                  width={14}
                  className="text-default-400"
                />
                {customer.email}
              </p>
              <p className="text-bold text-small flex items-center gap-1">
                <Icon
                  icon="solar:smartphone-2-linear"
                  width={14}
                  className="text-default-400"
                />
                {customer.phoneNumber}
              </p>
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
                <DropdownMenu aria-label="Customer Actions">
                  <DropdownItem
                    key="view"
                    startContent={<Icon icon="solar:eye-linear" width={16} />}
                    as={Link}
                    onPress={() => {
                      window.location.href = `/customers/view-customer-data/${customer.clientId}`;
                    }}
                  >
                    Visualizza dettagli
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
                        ...deleteModalData,
                        open: true,
                        customer: customer,
                      })
                    }
                  >
                    Elimina cliente
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

  // LoadingSkeleton component for table rows
  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={`loading-row-${index}`}>
          {columns.map((column) => (
            <TableCell key={`loading-cell-${column.uid}`}>
              <Skeleton className="rounded-lg">
                <div
                  className={
                    column.uid === "actions"
                      ? "h-8 w-8"
                      : column.uid === "name"
                      ? "h-10 w-32"
                      : "h-12 w-full"
                  }
                ></div>
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
        <DeleteCustomerModal
          isOpen={deleteModalData.open}
          isClosed={() =>
            setDeleteModalData({ ...deleteModalData, open: false })
          }
          CustomerData={deleteModalData.customer}
        />
        <Table
          aria-label="Customer table"
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
                    icon="solar:user-broken"
                    width={48}
                    className="text-default-300 mb-3"
                  />
                  <p className="text-default-500">
                    {searchQuery
                      ? "Nessun cliente corrisponde alla ricerca"
                      : "Non sono presenti clienti"}
                  </p>
                </div>
              )
            }
            loadingContent={<LoadingSkeleton />}
            loadingState={loading ? "loading" : "idle"}
          >
            {(item) => (
              <TableRow key={item.clientId}>
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
