"use client";

import {
  Table,
  Input,
  Pagination,
  Button,
} from "@heroui/react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Data table">
            <Table.Header>
              {columns.map((column, index) => (
                <Table.Column
                  key={column.key as string}
                  isRowHeader={index === 0}
                >
                  {column.label}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {items.length > 0 ? (
                items.map((item) => (
                  <Table.Row key={item.id}>
                    {columns.map((column) => (
                      <Table.Cell key={`${item.id}-${column.key as string}`}>
                        {item[column.key] as React.ReactNode}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  {columns.map((_, idx) => (
                    <Table.Cell key={`empty-${idx}`}>
                      {idx === 0 ? "No rows to display." : ""}
                    </Table.Cell>
                  ))}
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      {totalPages > 1 && (
        <div className="flex w-full justify-center">
          <Pagination>
            <Pagination.Content>
               <Pagination.Item>
                 <Pagination.Previous onClick={() => setPage(p => Math.max(1, p - 1))}>
                   <ChevronLeft className="h-4 w-4" />
                   <span>Previous</span>
                 </Pagination.Previous>
               </Pagination.Item>
               {[...Array(totalPages)].map((_, i) => (
                 <Pagination.Item key={i}>
                   <Pagination.Link
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                   >
                     {i + 1}
                   </Pagination.Link>
                 </Pagination.Item>
               ))}
               <Pagination.Item>
                 <Pagination.Next onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                   <span>Next</span>
                   <ChevronRight className="h-4 w-4" />
                 </Pagination.Next>
               </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
}
