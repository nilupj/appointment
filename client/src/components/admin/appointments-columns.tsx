
export const columns = [
  {
    id: "patientName",
    header: "Patient",
    cell: (row: any) => row.patientName
  },
  {
    id: "doctorName", 
    header: "Doctor",
    cell: (row: any) => row.doctorName
  },
  {
    id: "date",
    header: "Date",
    cell: (row: any) => new Date(row.date).toLocaleDateString()
  },
  {
    id: "status",
    header: "Status",
    cell: (row: any) => row.status
  }
];
