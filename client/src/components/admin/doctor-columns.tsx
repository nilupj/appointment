
export const doctorColumns = [
  {
    id: "name",
    header: "Name",
    cell: (row: any) => row.name
  },
  {
    id: "specialty",
    header: "Specialty",
    cell: (row: any) => row.specialty
  },
  {
    id: "experience",
    header: "Experience",
    cell: (row: any) => `${row.experience} years`
  },
  {
    id: "rating",
    header: "Rating",
    cell: (row: any) => row.rating || "N/A"
  },
  {
    id: "actions",
    header: "Actions",
    cell: (row: any) => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">Edit</Button>
        <Button variant="destructive" size="sm">Delete</Button>
      </div>
    )
  }
];
