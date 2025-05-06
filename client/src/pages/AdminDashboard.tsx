
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/admin/appointments-columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const form = useForm();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['/api/admin/appointments'],
  });

  const { data: tests = [] } = useQuery({
    queryKey: ['/api/admin/lab-tests'],
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create appointment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/admin/appointments']);
      toast({ title: "Success", description: "Appointment created" });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update appointment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/admin/appointments']);
      toast({ title: "Success", description: "Appointment updated" });
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete appointment');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/admin/appointments']);
      toast({ title: "Success", description: "Appointment deleted" });
    },
  });

  const onSubmit = (data) => {
    createAppointmentMutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="appointments">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="tests">Lab Tests</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Appointments Management</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Appointment</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Appointment</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="patientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Create</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={columns} 
                data={appointments}
                onDelete={(id) => deleteAppointmentMutation.mutate(id)}
                onUpdate={(id, data) => updateAppointmentMutation.mutate({ id, data })}
              />
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
        <TabsContent value="doctors">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Doctors Management</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Doctor</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Doctor</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doctor Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialty</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience (years)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Add Doctor</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <DataTable columns={doctorColumns} data={doctors || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
