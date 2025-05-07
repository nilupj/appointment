
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "doctorId",
    header: "Doctor ID"
  },
  {
    accessorKey: "userId",
    header: "Patient ID"
  },
  {
    accessorKey: "appointmentDate",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.appointmentDate);
      return date.toLocaleDateString();
    }
  },
  {
    accessorKey: "timeSlot",
    header: "Time Slot"
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
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => row.original.onUpdate?.(row.original.id)}>
            Update
          </Button>
          <Button variant="destructive" size="sm" onClick={() => row.original.onDelete?.(row.original.id)}>
            Delete
          </Button>
        </div>
      );
    }
  }
];
