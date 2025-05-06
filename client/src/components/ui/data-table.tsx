
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

interface DataTableProps<TData> {
  columns: {
    id: string;
    header: string;
    cell: (row: TData) => React.ReactNode;
  }[];
  data: TData[];
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, data: any) => void;
}

export function DataTable<TData extends { id: number }>({ 
  columns, 
  data,
  onDelete,
  onUpdate 
}: DataTableProps<TData>) {
  const form = useForm();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id}>{column.header}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.cell(row)}</TableCell>
              ))}
              <TableCell>
                <div className="flex gap-2">
                  {onUpdate && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Edit</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Record</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit((data) => onUpdate(row.id, data))} className="space-y-4">
                          {columns.map((column) => (
                            <FormField
                              key={column.id}
                              control={form.control}
                              name={column.id}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{column.header}</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          ))}
                          <Button type="submit">Update</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                  {onDelete && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => onDelete(row.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
