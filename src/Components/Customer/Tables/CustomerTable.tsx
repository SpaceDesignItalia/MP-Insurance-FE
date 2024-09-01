import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Pagination,
  Button,
  Input,
  Link,
} from "@nextui-org/react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import axios from "axios";
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
  { name: "Nome cliente", uid: "name" },
  { name: "Email", uid: "email" },
  { name: "N.Telefono", uid: "phone" },
  { name: "Azioni", uid: "actions" },
];

export default function CustomerTable() {
  const [customer, setCustomer] = useState<CustomerProps[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
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
    try {
      const response = await axios.get("/Customer/GET/GetAllCustomers", {
        withCredentials: true,
      });
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const searchCustomer = async (searchQuery: string) => {
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
    }
  };

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query === "") {
      fetchCustomers(); // Reset customers if search query is cleared
    }
  };

  const pages = Math.ceil(customer.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return customer.slice(start, end);
  }, [page, customer, rowsPerPage]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-end">
          <div className="flex flex-row gap-5 w-full">
            <Input
              variant="bordered"
              radius="sm"
              className="w-full sm:w-1/3"
              placeholder="Cerca cliente per nome o email..."
              onChange={handleSearchQuery}
              startContent={<SearchRoundedIcon />}
            />
            <Button
              color="primary"
              radius="sm"
              startContent={<SearchRoundedIcon />}
              className="hidden sm:flex"
              onClick={() => searchCustomer(searchQuery)}
            >
              Cerca
            </Button>
            <Button
              color="primary"
              radius="sm"
              className="flex sm:hidden"
              onClick={() => searchCustomer(searchQuery)}
              isIconOnly
            >
              <SearchRoundedIcon />
            </Button>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              as={Link}
              href="./customers/add-customer"
              color="primary"
              radius="sm"
              endContent={<PersonAddAlt1RoundedIcon />}
              fullWidth
            >
              Aggiungi cliente
            </Button>
          </div>
        </div>
      </div>
    );
  }, [searchQuery]);

  const bottomContent = React.useMemo(() => {
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

  const renderCell = React.useCallback(
    (customer: CustomerProps, columnKey: any) => {
      const cellValue = customer[columnKey as keyof CustomerProps];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              {customer.firstName + " " + customer.lastName}
            </div>
          );
        case "email":
          return <div className="flex flex-col">{customer.email}</div>;
        case "phone":
          return <div className="flex flex-col">{customer.phoneNumber}</div>;
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Tooltip content="Dettagli cliente" closeDelay={0} showArrow>
                <Link
                  as={"a"}
                  href={"/customers/view-customer-data/" + customer.clientId}
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                >
                  <RemoveRedEyeRoundedIcon />
                </Link>
              </Tooltip>
              <div
                onClick={() =>
                  setDeleteModalData({
                    ...deleteModalData,
                    open: true,
                    customer: customer,
                  })
                }
              >
                <Tooltip
                  color="danger"
                  content="Rimuovi cliente"
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
          return cellValue as React.ReactNode;
      }
    },
    []
  );

  return (
    <div className="flex flex-col gap-5">
      <DeleteCustomerModal
        isOpen={deleteModalData.open}
        isClosed={() => setDeleteModalData({ ...deleteModalData, open: false })}
        CustomerData={deleteModalData.customer}
      />
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
        <TableBody
          items={items}
          emptyContent={
            searchQuery
              ? "Nessun cliente trovato!"
              : "Non sono presenti clienti!"
          }
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
    </div>
  );
}
