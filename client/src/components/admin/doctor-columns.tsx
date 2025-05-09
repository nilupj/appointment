
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

export const doctorColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "specialty",
    header: "Specialty"
  },
  {
    accessorKey: "experience",
    header: "Experience",
    cell: ({ row }) => `${row.original.experience} years`
  },
  {
    accessorKey: "consultationFee",
    header: "Fee",
    cell: ({ row }) => `₹${row.original.consultationFee}`
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => row.original.rating?.toFixed(1) || "N/A"
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        row.original.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {row.original.status}
      </span>
    )
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const doctor = row.original;
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => doctor.onEdit?.(doctor)}
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => doctor.onDelete?.(doctor.id)}
          >
            Delete
          </Button>
        </div>
      );
    }
  }
];
