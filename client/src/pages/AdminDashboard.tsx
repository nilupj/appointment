
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/admin/appointments-columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['/api/admin/appointments'],
  });

  const { data: tests = [] } = useQuery({
    queryKey: ['/api/admin/lab-tests'],
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="appointments">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="tests">Lab Tests</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointments Management</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={appointments} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Lab Tests Management</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={tests} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
