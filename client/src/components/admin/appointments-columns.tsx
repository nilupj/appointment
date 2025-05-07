
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "user.username",
    header: "Patient"
  },
  {
    accessorKey: "doctor.name",
    header: "Doctor"
  },
  {
    accessorKey: "appointmentDate",
    header: "Date",
    cell: ({ row }) => {
      return format(new Date(row.getValue("appointmentDate")), "PPp");
    }
  },
  {
    accessorKey: "status",
    header: "Status"
  },
  {
    accessorKey: "type",
    header: "Type"
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => row.original.onEdit?.(row.original)}
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => row.original.onDelete?.(row.original.id)}
          >
            Delete
          </Button>
        </div>
      );
    }
  }
];
