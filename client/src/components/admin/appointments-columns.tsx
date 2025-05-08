
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
      const appointment = row.original;
      return (
        <div className="flex gap-2">
          {appointment.type?.toLowerCase() === "video consultation" && (appointment.status?.toLowerCase() === "scheduled" || appointment.status?.toLowerCase() === "in-progress") && (
            <Button
              size="sm"
              onClick={() => {
                window.location.href = `/video-consult/room?doctor=${encodeURIComponent(appointment.doctor?.name || '')}&appointmentId=${appointment.id}`;
              }}
            >
              Join Call
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => appointment.onEdit?.(appointment)}
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => appointment.onDelete?.(appointment.id)}
          >
            Delete
          </Button>
        </div>
      );
    }
  }
];
