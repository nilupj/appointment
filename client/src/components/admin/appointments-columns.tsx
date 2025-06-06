
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "Booking ID"
  },
  {
    accessorKey: "user.username",
    header: "Patient Name"
  },
  {
    accessorKey: "doctor.name",
    header: "Doctor Name"
  },
  {
    accessorKey: "doctor.specialty",
    header: "Specialty"
  },
  {
    accessorKey: "consultationFee",
    header: "Fee",
    cell: ({ row }) => {
      const fee = row.getValue("consultationFee");
      return `₹${fee || 500}`;
    }
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
            <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2 shadow-lg shadow-green-200"></div>
              <span className="text-green-600 font-medium">Live Consultation</span>
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
