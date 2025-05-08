
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
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const type = row.getValue("type");
      const isVideoConsult = type?.toLowerCase().includes("video");
      
      return (
        <div className="flex items-center gap-2">
          {status === "in-progress" && isVideoConsult && (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-green-600">Live Consultation</span>
            </div>
          )}
          {status}
        </div>
      );
    }
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
          {(appointment.type?.toLowerCase() === "video consultation" || appointment.type?.toLowerCase() === "video consult") && (appointment.status?.toLowerCase() === "scheduled" || appointment.status?.toLowerCase() === "in-progress") && (
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
