"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  Button,
} from "@heroui/react";
import { Search, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  searchPlaceholder = "Search...",
}: DataTableProps<T>) {
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(() => {
    let filteredData = [...data];

    if (filterValue) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some(
          (val) =>
            val &&
            val.toString().toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }

    return filteredData;
  }, [data, filterValue]);

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Input
          className="w-full sm:max-w-[44%]"
          placeholder={searchPlaceholder}
          value={filterValue}
          onChange={(e) => setFilterValue(e.currentTarget.value)}
        />
        <div className="flex gap-3">
          <Button variant="ghost">
            Columns <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      <Table aria-label="Data table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key as string}>
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={`${item.id}-${column.key as string}`}>
                    {item[column.key] as React.ReactNode}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow id="empty">
              {columns.map((column, idx) => (
                <TableCell key={`empty-${idx}`}>
                  {idx === 0 ? "No rows to display." : ""}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex w-full justify-center">
          <Pagination>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous onClick={() => setPage(p => Math.max(1, p - 1))}>
                  Previous
                </Pagination.Previous>
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Next onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                  Next
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
}
