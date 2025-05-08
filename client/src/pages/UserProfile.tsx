import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  LockIcon, 
  CreditCardIcon, 
  CalendarIcon, 
  FileTextIcon, 
  HeartIcon,
  ClipboardListIcon
} from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function UserProfile() {
  const { user, updateProfileMutation, changePasswordMutation, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    const { confirmPassword, ...passwordData } = data;
    changePasswordMutation.mutate(passwordData);

    // Reset form on successful submission
    if (!changePasswordMutation.isError) {
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) {
    return null;
  }

  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  
  useEffect(() => {
    // Fetch video consultations
    fetch('/api/video-consult/appointments')
      .then(res => res.json())
      .then(data => {
        const now = new Date();
        const upcoming = data.filter(a => new Date(a.date) > now);
        const past = data.filter(a => new Date(a.date) <= now);
        
        // Check for live/upcoming consultations
        const liveConsultations = upcoming.filter(apt => {
          const aptDate = new Date(apt.date);
          const timeDiff = Math.abs(aptDate.getTime() - now.getTime());
          return timeDiff <= 15 * 60 * 1000;
        });

        // Show notifications for live consultations
        liveConsultations.forEach(apt => {
          toast({
            title: "Your Consultation is Starting Soon",
            description: `Video consultation with Dr. ${apt.doctorName} starts at ${new Date(apt.date).toLocaleTimeString()}`,
            variant: "default",
            duration: 5000
          });
        });

        setAppointments({
          upcoming: [...appointments.upcoming, ...upcoming],
          past: [...appointments.past, ...past]
        });
      })
      .catch(console.error);
  }, []);

  const medicalRecords = [
    { id: 1, title: "Blood Test Results", date: "April 25, 2025", type: "Laboratory" },
    { id: 2, title: "Chest X-Ray Report", date: "March 15, 2025", type: "Radiology" },
  ];

  const savedDoctors = [
    { id: 1, name: "Dr. Priya Sharma", specialty: "Pediatrician" },
    { id: 2, name: "Dr. Robert Lee", specialty: "Psychiatrist" },
  ];
  
  return (
    <>
      <Helmet>
        <title>My Profile | MediConnect</title>
        <meta name="description" content="Manage your MediConnect profile, appointments, and medical records" />
      </Helmet>
      
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mb-3">
                      {user.firstName?.[0] || user.username?.[0] || 'U'}
                      {user.lastName?.[0] || ''}
                    </div>
                    <h2 className="font-semibold text-lg">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant={activeTab === "profile" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("profile")}
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      Personal Information
                    </Button>
                    <Button 
                      variant={activeTab === "appointments" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("appointments")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      My Appointments
                    </Button>
                    <Button 
                      variant={activeTab === "medical-records" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("medical-records")}
                    >
                      <FileTextIcon className="mr-2 h-4 w-4" />
                      Medical Records
                    </Button>
                    <Button 
                      variant={activeTab === "saved" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("saved")}
                    >
                      <HeartIcon className="mr-2 h-4 w-4" />
                      Saved Doctors
                    </Button>
                    <Button 
                      variant={activeTab === "payments" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("payments")}
                    >
                      <CreditCardIcon className="mr-2 h-4 w-4" />
                      Payment Methods
                    </Button>
                    <Button 
                      variant={activeTab === "security" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("security")}
                    >
                      <LockIcon className="mr-2 h-4 w-4" />
                      Security
                    </Button>
                    
                    <Separator className="my-4" />
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">Sign Out</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Sign out of MediConnect?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You will need to login again to access your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button variant="destructive" onClick={handleLogout}>
                            {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                      <UserIcon className="h-5 w-5" />
                                    </span>
                                    <Input className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                      <UserIcon className="h-5 w-5" />
                                    </span>
                                    <Input className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <MailIcon className="h-5 w-5" />
                                  </span>
                                  <Input className="pl-10" type="email" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <PhoneIcon className="h-5 w-5" />
                                  </span>
                                  <Input className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full md:w-auto"
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? "Saving Changes..." : "Save Changes"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
              
              {/* Security Tab */}
              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <LockIcon className="h-5 w-5" />
                                  </span>
                                  <Input className="pl-10" type="password" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <LockIcon className="h-5 w-5" />
                                  </span>
                                  <Input className="pl-10" type="password" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <LockIcon className="h-5 w-5" />
                                  </span>
                                  <Input className="pl-10" type="password" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full md:w-auto"
                          disabled={changePasswordMutation.isPending}
                        >
                          {changePasswordMutation.isPending ? "Updating Password..." : "Update Password"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
              
              {/* Appointments Tab */}
              {activeTab === "appointments" && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Appointments</CardTitle>
                    <CardDescription>View and manage your appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="upcoming">
                      <TabsList className="mb-6">
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="past">Past</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="upcoming">
                        {appointments.upcoming.length > 0 ? (
                          <div className="space-y-4">
                            {appointments.upcoming.map(appointment => (
                              <Card key={appointment.id}>
                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                      <h3 className="font-semibold text-lg">{appointment.doctor}</h3>
                                      <p className="text-sm text-gray-500">{appointment.specialty}</p>
                                      <div className="flex items-center mt-2">
                                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-sm">{appointment.date} at {appointment.time}</span>
                                      </div>
                                      <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                                        {appointment.type}
                                      </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 space-x-2">
                                      {appointment.type === "Video Consultation" && (
                                        <Button>Join Consultation</Button>
                                      )}
                                      <Button 
                                        variant="outline"
                                        onClick={() => {
                                          const newDate = window.prompt('Enter new date (YYYY-MM-DD)');
                                          const newTime = window.prompt('Enter new time (HH:MM)');
                                          
                                          if (newDate && newTime) {
                                            fetch(`/api/appointments/${appointment.id}`, {
                                              method: 'PUT',
                                              headers: {
                                                'Content-Type': 'application/json'
                                              },
                                              body: JSON.stringify({
                                                date: `${newDate}T${newTime}`,
                                                status: 'rescheduled'
                                              })
                                            })
                                            .then(response => {
                                              if (response.ok) {
                                                window.location.reload();
                                              } else {
                                                alert('Failed to reschedule appointment');
                                              }
                                            })
                                            .catch(error => {
                                              console.error('Error:', error);
                                              alert('Failed to reschedule appointment');
                                            });
                                          }
                                        }}
                                      >
                                        Reschedule
                                      </Button>
                                      <Button variant="destructive" size="sm">Cancel</Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="font-medium text-lg mb-2">No upcoming appointments</h3>
                            <p className="text-gray-500 mb-4">You don't have any upcoming appointments scheduled.</p>
                            <Button>Book an Appointment</Button>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="past">
                        {appointments.past.length > 0 ? (
                          <div className="space-y-4">
                            {appointments.past.map(appointment => (
                              <Card key={appointment.id}>
                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                      <h3 className="font-semibold text-lg">{appointment.doctor}</h3>
                                      <p className="text-sm text-gray-500">{appointment.specialty}</p>
                                      <div className="flex items-center mt-2">
                                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-sm">{appointment.date} at {appointment.time}</span>
                                      </div>
                                      <div className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mt-2">
                                        {appointment.type}
                                      </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 space-x-2">
                                      <Button variant="outline">View Details</Button>
                                      <Button variant="outline">Book Again</Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <ClipboardListIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="font-medium text-lg mb-2">No past appointments</h3>
                            <p className="text-gray-500">You don't have any past appointments.</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
              
              {/* Medical Records Tab */}
              {activeTab === "medical-records" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Records</CardTitle>
                    <CardDescription>Access your medical documents and records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {medicalRecords.length > 0 ? (
                      <div className="space-y-4">
                        {medicalRecords.map(record => (
                          <Card key={record.id}>
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg">{record.title}</h3>
                                  <div className="flex items-center mt-2">
                                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                                    <span className="text-sm">{record.date}</span>
                                  </div>
                                  <div className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mt-2">
                                    {record.type}
                                  </div>
                                </div>
                                <div className="mt-4 md:mt-0 space-x-2">
                                  <Button variant="outline">View</Button>
                                  <Button variant="outline">Download</Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <FileTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">No medical records</h3>
                        <p className="text-gray-500 mb-4">You don't have any medical records uploaded yet.</p>
                        <Button>Upload Records</Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Upload New Record</Button>
                  </CardFooter>
                </Card>
              )}
              
              {/* Saved Doctors Tab */}
              {activeTab === "saved" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Doctors</CardTitle>
                    <CardDescription>Doctors you've saved for quick access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedDoctors.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedDoctors.map(doctor => (
                          <Card key={doctor.id}>
                            <CardContent className="p-6">
                              <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold mr-4">
                                  {doctor.name.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="font-semibold">{doctor.name}</h3>
                                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                                </div>
                              </div>
                              <div className="flex mt-4 space-x-2">
                                <Button variant="outline" className="flex-1">View Profile</Button>
                                <Button className="flex-1">Book Appointment</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <HeartIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">No saved doctors</h3>
                        <p className="text-gray-500 mb-4">You haven't saved any doctors yet.</p>
                        <Button>Find Doctors</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Payment Methods Tab */}
              {activeTab === "payments" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment options</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10">
                      <CreditCardIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-medium text-lg mb-2">No payment methods</h3>
                      <p className="text-gray-500 mb-4">You haven't added any payment methods yet.</p>
                      <Button>Add Payment Method</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}