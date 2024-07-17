import React, { useEffect, useState } from "react";
import Header from "../../Header";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTaskMutation } from "@/store/slices/taskSlices";
import { useFormik } from "formik";
import { useGetTaskQuery } from "@/store/slices/taskSlices";
import { useToast } from "../../ui/use-toast";
import { useDeleteTaskMutation } from "@/store/slices/taskSlices";
import { useUpdateTaskMutation } from "@/store/slices/taskSlices";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "taskId",
    header: "Task Id",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("taskId")}</div>
    ),
  },

  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("status")}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original._id;
      const { toast } = useToast();
      const initialValues = {
        title: row.original.title,
        status: row.original.status,
      };
      const [deleteTask] = useDeleteTaskMutation();
      const [updateTask] = useUpdateTaskMutation();

      const handleDelete = async () => {
        const response = await deleteTask(id);
        if (response.data) {
          console.log(response.data);
          toast({
            title: "Success",
            variant: "destructive",
            className: "bg-green-400",
            description: response.data.message,
          });
        }
        if (response.error) {
          console.log(response.error);
          toast({
            title: "Oops Error",
            variant: "destructive",
            description: response.error.data.message,
          });
        }
      };

      const { values, errors, handleSubmit, handleChange, setFieldValue } =
        useFormik({
          initialValues,
          onSubmit: async (values, action) => {
            console.log(values);
            const formDatas = new FormData();
            formDatas.append("title", values.name);
            formDatas.append("status", values.status);
            try {
              const response = await updateTask({ id: id, values: values });

              if (response.data) {
                toast({
                  title: "Success",
                  variant: "destructive",
                  className: "bg-green-400",
                  description: response.data.message,
                });
              }
              if (response.error) {
                console.log(response.error);
                toast({
                  title: "Oops Error",
                  variant: "destructive",
                  description: response.error.data.message,
                });
              }
            } catch (error) {
              console.log(error);
            }
          },
        });
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DialogTrigger asChild>
                <DropdownMenuItem>Update</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete}>
                <span className="text-red-600">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update item</DialogTitle>
              <DialogDescription>Update your added item</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Task Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  className="col-span-3"
                  value={values.title}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Status
                </Label>
                <Select
                  onValueChange={(e) => {
                    setFieldValue("status", e);
                  }}
                  name="status"
                >
                  <SelectTrigger id="status" className="w-[250px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

const Home = () => {
  const initialValues = {
    title: "",
    status: "",
  };
  const [task, setTask] = useState([]);
  const { data, isLoading, isSuccess } = useGetTaskQuery();
  useEffect(() => {
    if (data) {
      setTask(data.tasks);
    }
  }, [data, isSuccess]);

  const [createTask] = useCreateTaskMutation();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const { toast } = useToast();
  const table = useReactTable({
    data: task,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const { values, errors, handleSubmit, handleChange, setFieldValue } =
    useFormik({
      initialValues,
      onSubmit: async (values, action) => {
        const formDatas = new FormData();
        formDatas.append("title", values.name);
        formDatas.append("status", values.status);
        try {
          const response = await createTask(values);

          if (response.data) {
            action.resetForm();
          }
          if (response.error) {
            console.log(response.error);
            toast({
              title: "Oops Error",
              variant: "destructive",
              description: response.error.data.message,
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
    });

  return (
    <div>
      <Header />
      <div>
        <div className="w-full p-3">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter task..."
              value={table.getColumn("title")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add item</DialogTitle>
                  <DialogDescription>
                    Add your item to the list
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Task Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      className="col-span-3"
                      value={values.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Status
                    </Label>
                    <Select
                      onValueChange={(e) => {
                        setFieldValue("status", e);
                      }}
                      name="status"
                    >
                      <SelectTrigger id="status" className="w-[250px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="progress">Progress</SelectItem>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSubmit}>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
