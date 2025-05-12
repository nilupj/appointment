
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/admin/appointments-columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingAppointment, setEditingAppointment] = useState(null);
  const form = useForm();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <div>Access denied. Admin only.</div>;
  }

  const { data: labBookings = [] } = useQuery({
    queryKey: ['/api/admin/lab-bookings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/lab-bookings');
      if (!response.ok) throw new Error('Failed to fetch lab bookings');
      return response.json();
    },
    enabled: user?.role === 'admin'
  });

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['/api/admin/appointments'],
    queryFn: async () => {
      const response = await fetch('/api/admin/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      
      // Check for live/upcoming consultations
      const now = new Date();
      const liveConsultations = data.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        const timeDiff = Math.abs(aptDate.getTime() - now.getTime());
        // Show notification for consultations within 15 minutes
        return timeDiff <= 15 * 60 * 1000 && apt.status === "scheduled";
      });

      // Show notifications for live consultations
      liveConsultations.forEach(apt => {
        toast({
          title: "Live Consultation Alert",
          description: `Consultation with Dr. ${apt.doctor?.name} is starting soon at ${new Date(apt.appointmentDate).toLocaleTimeString()}`,
          variant: "default",
          duration: 5000
        });
      });

      return data;
    },
    enabled: user?.role === 'admin',
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
    select: (data) => data.map(apt => ({
      ...apt,
      consultationFee: apt.doctor?.consultationFee || 500,
      specialty: apt.doctor?.specialty || 'General Medicine'
    }))
  });

  const { data: doctors = [], isLoading: isDoctorsLoading } = useQuery({
    queryKey: ['/api/admin/doctors'],
    queryFn: async () => {
      const response = await fetch('/api/admin/doctors');
      if (!response.ok) throw new Error('Failed to fetch doctors');
      return response.json();
    },
    enabled: user?.role === 'admin'
  });

  const createDoctorMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create doctor');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/admin/doctors']);
      toast({ title: "Success", description: "Doctor added successfully" });
    },
  });

  const updateDoctorMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/admin/doctors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update doctor');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/admin/doctors']);
      toast({ title: "Success", description: "Doctor updated successfully" });
    },
  });

  const deleteDoctorMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/admin/doctors/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete doctor');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/admin/doctors']);
      toast({ title: "Success", description: "Doctor deleted successfully" });
    },
  });

  const { data: labTests = [] } = useQuery({
    queryKey: ['/api/admin/lab-tests'],
    enabled: user?.role === 'admin'
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
      setEditingAppointment(null);
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
    if (editingAppointment) {
      updateAppointmentMutation.mutate({ id: editingAppointment.id, data });
    } else {
      createAppointmentMutation.mutate(data);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    form.reset(appointment);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointmentMutation.mutate(id);
    }
  };

  const enhancedAppointments = appointments.map(appointment => ({
    ...appointment,
    onEdit: handleEdit,
    onDelete: handleDelete
  }));

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="appointments">
        <TabsList className="w-full">
          <TabsTrigger value="appointments" className="flex-1">Appointments</TabsTrigger>
          <TabsTrigger value="doctors" className="flex-1">Doctors</TabsTrigger>
          <TabsTrigger value="lab-tests" className="flex-1">Lab Tests</TabsTrigger>
          <TabsTrigger value="lab-bookings" className="flex-1">Lab Bookings</TabsTrigger>
          <TabsTrigger value="payments" className="flex-1">Payments</TabsTrigger>
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
                    <DialogTitle>
                      {editingAppointment ? 'Edit Appointment' : 'Create New Appointment'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="doctorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doctor</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select doctor" />
                            </SelectTrigger>
                            <SelectContent>
                              {doctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                  {doctor.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="appointmentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date & Time</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <Button type="submit">
                      {editingAppointment ? 'Update' : 'Create'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={columns} 
                data={enhancedAppointments}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="doctors">
          <Card>
            <CardHeader>
              <CardTitle>Doctors Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Registered Doctors</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Doctor</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Doctor</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={form.handleSubmit((data) => {
                        createDoctorMutation.mutate(data);
                      })} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter doctor's name" />
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select specialty" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="general">General Medicine</SelectItem>
                                  <SelectItem value="cardiology">Cardiology</SelectItem>
                                  <SelectItem value="dermatology">Dermatology</SelectItem>
                                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="consultationFee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Consultation Fee</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} placeholder="Enter fee" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={createDoctorMutation.isLoading}>
                          {createDoctorMutation.isLoading ? "Adding..." : "Add Doctor"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <DataTable 
                  columns={doctorColumns} 
                  data={doctors.map(doctor => ({
                    ...doctor,
                    onEdit: (doctor) => {
                      form.reset(doctor);
                      updateDoctorMutation.mutate({ id: doctor.id, data: form.getValues() });
                    },
                    onDelete: (id) => {
                      if (confirm('Are you sure you want to delete this doctor?')) {
                        deleteDoctorMutation.mutate(id);
                      }
                    }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-tests">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lab Tests Management</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Lab Test</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Lab Test</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(async (data) => {
                    try {
                      const response = await fetch('/api/admin/lab-tests', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                      });
                      if (!response.ok) throw new Error('Failed to add lab test');
                      queryClient.invalidateQueries(['/api/admin/lab-tests']);
                      toast({ title: "Success", description: "Lab test added successfully" });
                    } catch (error) {
                      toast({ title: "Error", description: "Failed to add lab test", variant: "destructive" });
                    }
                  })} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Test Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter test name" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} placeholder="Enter price" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Add Test</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={[
                  { accessorKey: "name", header: "Test Name" },
                  { accessorKey: "description", header: "Description" },
                  { accessorKey: "price", header: "Price" },
                  { accessorKey: "discounted_price", header: "Discounted Price" },
                  { accessorKey: "report_time", header: "Report Time" },
                  { accessorKey: "home_collection", header: "Home Collection",
                    cell: ({ row }) => row.original.home_collection ? "Yes" : "No"
                  },
                  {
                    id: "actions",
                    cell: ({ row }) => (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          // Handle edit
                        }}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={async () => {
                          if (confirm('Are you sure you want to delete this test?')) {
                            try {
                              await fetch(`/api/admin/lab-tests/${row.original.id}`, {
                                method: 'DELETE'
                              });
                              queryClient.invalidateQueries(['/api/admin/lab-tests']);
                              toast({ title: "Success", description: "Lab test deleted" });
                            } catch (error) {
                              toast({ title: "Error", description: "Failed to delete lab test", variant: "destructive" });
                            }
                          }
                        }}>Delete</Button>
                      </div>
                    )
                  }
                ]}
                data={labTests || []}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Available Payment Methods</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Payment Method</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={form.handleSubmit(async (data) => {
                        try {
                          const response = await fetch('/api/admin/payment-methods', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                          });
                          
                          if (!response.ok) {
                            throw new Error('Failed to add payment method');
                          }
                          
                          toast({
                            title: "Success",
                            description: "Payment method added successfully",
                          });
                          
                          // Close dialog and reset form
                          const closeButton = document.querySelector('[role="dialog"] button[type="button"]');
                          if (closeButton) closeButton.click();
                          form.reset();
                          
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to add payment method",
                            variant: "destructive",
                          });
                        }
                      })} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="paymentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                                  <SelectItem value="upi">UPI</SelectItem>
                                  <SelectItem value="netbanking">Net Banking</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="provider"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Provider</FormLabel>
                              <Input {...field} placeholder="e.g. PayPal, Stripe" />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Add Method</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <DataTable 
                  columns={[
                    {
                      accessorKey: "type",
                      header: "Payment Type"
                    },
                    {
                      accessorKey: "provider",
                      header: "Provider"
                    },
                    {
                      accessorKey: "status",
                      header: "Status"
                    },
                    {
                      id: "actions",
                      cell: ({ row }) => (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </div>
                      )
                    }
                  ]} 
                  data={[
                    { type: "Credit/Debit Card", provider: "Stripe", status: "Active" },
                    { type: "UPI", provider: "PhonePe", status: "Active" },
                    { type: "PayPal", provider: "PayPal", status: "Active" }
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-bookings">
          <Card>
            <CardHeader>
              <CardTitle>Lab Test Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={[
                  { accessorKey: "patient_name", header: "Patient Name" },
                  { accessorKey: "patient_age", header: "Age" },
                  { accessorKey: "patient_gender", header: "Gender" },
                  { accessorKey: "patient_phone", header: "Phone" },
                  { accessorKey: "test_id", header: "Test ID" },
                  { accessorKey: "booking_date", header: "Date",
                    cell: ({ row }) => new Date(row.getValue("booking_date")).toLocaleDateString()
                  },
                  { accessorKey: "time_slot", header: "Time Slot" },
                  { accessorKey: "collection_address", header: "Collection Address" },
                  { 
                    accessorKey: "status", 
                    header: "Status",
                    cell: ({ row }) => (
                      <div className="flex gap-2">
                        <Select
                          value={row.original.status}
                          onValueChange={async (value) => {
                            try {
                              await fetch(`/api/admin/lab-bookings/${row.original.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: value })
                              });
                              queryClient.invalidateQueries(['/api/admin/lab-bookings']);
                              toast({ title: "Success", description: "Booking status updated" });
                            } catch (error) {
                              toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
                            }
                          }}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  },
                  {
                    id: "actions",
                    header: "Actions",
                    cell: ({ row }) => (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          toast({ 
                            title: "Details", 
                            description: `Collection Address: ${row.original.collectionAddress || 'Not provided'}` 
                          });
                        }}>View</Button>
                        <Button variant="destructive" size="sm" onClick={async () => {
                          try {
                            await fetch(`/api/admin/lab-bookings/${row.original.id}`, {
                              method: 'DELETE'
                            });
                            queryClient.invalidateQueries(['/api/admin/lab-bookings']);
                            toast({ title: "Success", description: "Booking deleted" });
                          } catch (error) {
                            toast({ title: "Error", description: "Failed to delete booking", variant: "destructive" });
                          }
                        }}>Delete</Button>
                      </div>
                    )
                  }
                ]} 
                data={labBookings || []}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
