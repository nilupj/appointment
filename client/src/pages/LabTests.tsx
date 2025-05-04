import { useState } from "react";
import { Helmet } from "react-helmet";
import SearchSection from "@/components/layout/SearchSection";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Phone, Calendar, MapPin, Clock, Home, Award, Heart, User, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Types
type TestCategory = {
  id: number;
  name: string;
  imageUrl: string;
  count: number;
};

type LabTest = {
  id: number;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  popularFor: string[];
  preparationInfo: string;
  reportTime: string;
  homeCollection: boolean;
};

type LabPackage = {
  id: number;
  name: string;
  description: string;
  tests: string[];
  price: number;
  discountedPrice: number;
  reportTime: string;
  homeCollection: boolean;
  recommended: boolean;
};

const LabTests = () => {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingTest, setBookingTest] = useState<LabTest | LabPackage | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const { toast } = useToast();

  // Sample categories
  const categories: TestCategory[] = [
    { id: 1, name: "Health Checkup", imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=100&h=100", count: 28 },
    { id: 2, name: "Diabetes", imageUrl: "https://images.unsplash.com/photo-1554498808-d3ae8f23540f?auto=format&fit=crop&w=100&h=100", count: 12 },
    { id: 3, name: "Thyroid", imageUrl: "https://images.unsplash.com/photo-1559757175-7cb037ec2b29?auto=format&fit=crop&w=100&h=100", count: 8 },
    { id: 4, name: "Covid-19", imageUrl: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=100&h=100", count: 5 },
    { id: 5, name: "Liver", imageUrl: "https://images.unsplash.com/photo-1576086211219-d93a0e9d684b?auto=format&fit=crop&w=100&h=100", count: 14 },
    { id: 6, name: "Fertility", imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=100&h=100", count: 7 },
  ];

  // Sample tests
  const labTests: LabTest[] = [
    {
      id: 101,
      name: "Complete Blood Count (CBC)",
      description: "Measures various components of your blood to provide insight into your overall health.",
      price: 800,
      discountedPrice: 650,
      popularFor: ["Anemia", "Infection", "General health assessment"],
      preparationInfo: "No special preparation required. Fasting not necessary.",
      reportTime: "Same day",
      homeCollection: true
    },
    {
      id: 102,
      name: "Thyroid Profile",
      description: "Evaluates thyroid function by measuring thyroid hormone levels.",
      price: 1200,
      discountedPrice: 950,
      popularFor: ["Hypothyroidism", "Hyperthyroidism", "Goiter"],
      preparationInfo: "12-hour fasting recommended.",
      reportTime: "Next day",
      homeCollection: true
    },
    {
      id: 103,
      name: "Lipid Profile",
      description: "Measures cholesterol and triglycerides to assess heart disease risk.",
      price: 900,
      discountedPrice: 750,
      popularFor: ["Heart disease", "Stroke risk", "Cholesterol monitoring"],
      preparationInfo: "8-12 hour fasting required.",
      reportTime: "Same day",
      homeCollection: true
    },
    {
      id: 104,
      name: "Diabetes Screening (HbA1c)",
      description: "Measures average blood glucose levels over the past 2-3 months.",
      price: 850,
      discountedPrice: 700,
      popularFor: ["Diabetes diagnosis", "Diabetes monitoring", "Pre-diabetes screening"],
      preparationInfo: "No fasting required.",
      reportTime: "Next day",
      homeCollection: true
    }
  ];

  // Sample packages
  const labPackages: LabPackage[] = [
    {
      id: 201,
      name: "Basic Health Checkup",
      description: "Comprehensive screening for general health assessment.",
      tests: ["Complete Blood Count", "Liver Function Test", "Kidney Function Test", "Lipid Profile", "Blood Sugar Fasting"],
      price: 2500,
      discountedPrice: 1799,
      reportTime: "Next day",
      homeCollection: true,
      recommended: true
    },
    {
      id: 202,
      name: "Advanced Health Checkup",
      description: "Thorough screening for comprehensive health assessment with additional tests.",
      tests: ["Complete Blood Count", "Liver Function Test", "Kidney Function Test", "Lipid Profile", "Thyroid Profile", "Vitamin D", "Vitamin B12", "Blood Sugar (Fasting & PP)"],
      price: 4500,
      discountedPrice: 3299,
      reportTime: "1-2 days",
      homeCollection: true,
      recommended: false
    },
    {
      id: 203,
      name: "Diabetes Care Package",
      description: "Comprehensive assessment for diabetes management and monitoring.",
      tests: ["HbA1c", "Fasting Blood Sugar", "Post Prandial Blood Sugar", "Lipid Profile", "Kidney Function Test", "Urine Routine"],
      price: 2800,
      discountedPrice: 1999,
      reportTime: "Next day",
      homeCollection: true,
      recommended: false
    }
  ];

  const handleBookTest = () => {
    if (!patientName || !patientAge || !patientGender || !patientPhone || !selectedDate || !selectedSlot) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would submit the booking to the server
    toast({
      title: "Test booked successfully!",
      description: `Your ${bookingTest?.name} has been scheduled for ${selectedDate} at ${selectedSlot}.`,
    });

    // Reset form
    setBookingTest(null);
    setPatientName("");
    setPatientAge("");
    setPatientGender("");
    setPatientPhone("");
    setPatientAddress("");
    setSelectedDate("");
    setSelectedSlot("");
  };

  return (
    <>
      <Helmet>
        <title>Lab Tests | MediConnect</title>
        <meta name="description" content="Book lab tests and health checkups with home sample collection." />
      </Helmet>
      
      <SearchSection />
      
      <div className="bg-white py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-3">Lab Tests & Health Checkups</h1>
          <p className="text-[#666666] max-w-3xl mb-8">Book diagnostic tests and full body health checkups from the comfort of your home. Get accurate results, home sample collection, and more.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="bg-blue-50 rounded-lg p-6 text-center flex flex-col items-center">
              <Home className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">Home Sample Collection</h3>
              <p className="text-sm text-[#666666]">Blood samples collected from your home</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 text-center flex flex-col items-center">
              <Award className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">Certified Labs</h3>
              <p className="text-sm text-[#666666]">NABL and ISO certified diagnostic centers</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 text-center flex flex-col items-center">
              <Clock className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">Quick Reports</h3>
              <p className="text-sm text-[#666666]">Get digital reports in 24-48 hours</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 text-center flex flex-col items-center">
              <Heart className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">Up to 50% Off</h3>
              <p className="text-sm text-[#666666]">Special discounts on all tests and packages</p>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {categories.map(category => (
                <div key={category.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center cursor-pointer transition">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
                    loading="lazy"
                  />
                  <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-[#666666]">{category.count} tests</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Location and Filters */}
          <div className="flex flex-col md:flex-row items-stretch gap-4 mb-8">
            <div className="flex-1 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Select Location</h3>
              </div>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                  <SelectItem value="central">Central</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Select Date</h3>
              </div>
              <Input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="flex-1 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Select Time Slot</h3>
              </div>
              <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6am-8am">6:00 AM - 8:00 AM</SelectItem>
                  <SelectItem value="8am-10am">8:00 AM - 10:00 AM</SelectItem>
                  <SelectItem value="10am-12pm">10:00 AM - 12:00 PM</SelectItem>
                  <SelectItem value="12pm-2pm">12:00 PM - 2:00 PM</SelectItem>
                  <SelectItem value="2pm-4pm">2:00 PM - 4:00 PM</SelectItem>
                  <SelectItem value="4pm-6pm">4:00 PM - 6:00 PM</SelectItem>
                  <SelectItem value="6pm-8pm">6:00 PM - 8:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Filter By</h3>
              </div>
              <Select defaultValue="popularity">
                <SelectTrigger>
                  <SelectValue placeholder="Filter tests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="discount">Highest Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Tests and Packages */}
          <Tabs defaultValue="tests" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="tests">Individual Tests</TabsTrigger>
              <TabsTrigger value="packages">Health Packages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tests" className="mt-0">
              <div className="space-y-6">
                {labTests.map(test => (
                  <Card key={test.id} className="hover:shadow-md transition">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-2/3 p-6 border-b md:border-b-0 md:border-r border-gray-200">
                          <div className="flex justify-between mb-3">
                            <h3 className="font-semibold text-lg">{test.name}</h3>
                            {test.homeCollection && (
                              <div className="flex items-center text-xs bg-green-50 text-green-700 py-1 px-2 rounded">
                                <Home className="h-3 w-3 mr-1" />
                                Home Collection
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-[#666666] mb-4">{test.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-primary mr-2 mt-1" />
                              <p className="text-sm">
                                <span className="text-[#666666]">Popular for:</span> <span className="font-medium">{test.popularFor.join(", ")}</span>
                              </p>
                            </div>
                            
                            <div className="flex items-start">
                              <Clock className="h-4 w-4 text-primary mr-2 mt-1" />
                              <p className="text-sm">
                                <span className="text-[#666666]">Report Time:</span> <span className="font-medium">{test.reportTime}</span>
                              </p>
                            </div>
                            
                            <div className="flex items-start">
                              <User className="h-4 w-4 text-primary mr-2 mt-1" />
                              <p className="text-sm">
                                <span className="text-[#666666]">Preparation:</span> <span className="font-medium">{test.preparationInfo}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="md:w-1/3 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center mb-3">
                              <p className="text-2xl font-bold text-primary">₹{test.discountedPrice}</p>
                              <p className="text-sm text-[#666666] line-through ml-2">₹{test.price}</p>
                              <div className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded ml-2">
                                {Math.round((1 - test.discountedPrice / test.price) * 100)}% off
                              </div>
                            </div>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="primary-button w-full" onClick={() => setBookingTest(test)}>Book Now</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Book Lab Test</DialogTitle>
                                <DialogDescription>
                                  Enter patient details to book {test.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Patient Name*</label>
                                  <Input 
                                    value={patientName} 
                                    onChange={(e) => setPatientName(e.target.value)} 
                                    placeholder="Enter full name" 
                                    required 
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Age*</label>
                                    <Input 
                                      value={patientAge} 
                                      onChange={(e) => setPatientAge(e.target.value)} 
                                      placeholder="Age" 
                                      type="number" 
                                      required 
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Gender*</label>
                                    <Select value={patientGender} onValueChange={setPatientGender}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Phone Number*</label>
                                  <Input 
                                    value={patientPhone} 
                                    onChange={(e) => setPatientPhone(e.target.value)} 
                                    placeholder="Enter phone number" 
                                    required 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Collection Address (for home collection)</label>
                                  <Input 
                                    value={patientAddress} 
                                    onChange={(e) => setPatientAddress(e.target.value)} 
                                    placeholder="Enter your complete address" 
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Date*</label>
                                    <Input 
                                      type="date" 
                                      value={selectedDate}
                                      onChange={(e) => setSelectedDate(e.target.value)}
                                      min={new Date().toISOString().split('T')[0]}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Time Slot*</label>
                                    <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="6am-8am">6:00 AM - 8:00 AM</SelectItem>
                                        <SelectItem value="8am-10am">8:00 AM - 10:00 AM</SelectItem>
                                        <SelectItem value="10am-12pm">10:00 AM - 12:00 PM</SelectItem>
                                        <SelectItem value="12pm-2pm">12:00 PM - 2:00 PM</SelectItem>
                                        <SelectItem value="2pm-4pm">2:00 PM - 4:00 PM</SelectItem>
                                        <SelectItem value="4pm-6pm">4:00 PM - 6:00 PM</SelectItem>
                                        <SelectItem value="6pm-8pm">6:00 PM - 8:00 PM</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <div className="flex justify-between items-center w-full">
                                  <div>
                                    <p className="font-medium">Total Amount</p>
                                    <p className="font-bold text-xl text-primary">₹{test.discountedPrice}</p>
                                  </div>
                                  <Button onClick={handleBookTest}>Confirm Booking</Button>
                                </div>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="packages" className="mt-0">
              <div className="space-y-6">
                {labPackages.map(pkg => (
                  <Card key={pkg.id} className={`hover:shadow-md transition ${pkg.recommended ? 'border-primary' : ''}`}>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-2/3 p-6 border-b md:border-b-0 md:border-r border-gray-200">
                          <div className="flex justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{pkg.name}</h3>
                              {pkg.recommended && (
                                <div className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full mt-2">
                                  Recommended
                                </div>
                              )}
                            </div>
                            {pkg.homeCollection && (
                              <div className="flex items-center text-xs bg-green-50 text-green-700 py-1 px-2 rounded">
                                <Home className="h-3 w-3 mr-1" />
                                Home Collection
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-[#666666] mb-4">{pkg.description}</p>
                          
                          <div className="space-y-1 mb-4">
                            <p className="text-sm font-medium">Includes {pkg.tests.length} tests:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                              {pkg.tests.map((test, index) => (
                                <div key={index} className="flex items-start">
                                  <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                                  <p className="text-sm">{test}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-start mt-4">
                            <Clock className="h-4 w-4 text-primary mr-2 mt-1" />
                            <p className="text-sm">
                              <span className="text-[#666666]">Report Time:</span> <span className="font-medium">{pkg.reportTime}</span>
                            </p>
                          </div>
                        </div>
                        <div className="md:w-1/3 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center mb-3">
                              <p className="text-2xl font-bold text-primary">₹{pkg.discountedPrice}</p>
                              <p className="text-sm text-[#666666] line-through ml-2">₹{pkg.price}</p>
                              <div className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded ml-2">
                                {Math.round((1 - pkg.discountedPrice / pkg.price) * 100)}% off
                              </div>
                            </div>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="primary-button w-full" onClick={() => setBookingTest(pkg)}>Book Now</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Book Health Package</DialogTitle>
                                <DialogDescription>
                                  Enter patient details to book {pkg.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Patient Name*</label>
                                  <Input 
                                    value={patientName} 
                                    onChange={(e) => setPatientName(e.target.value)} 
                                    placeholder="Enter full name" 
                                    required 
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Age*</label>
                                    <Input 
                                      value={patientAge} 
                                      onChange={(e) => setPatientAge(e.target.value)} 
                                      placeholder="Age" 
                                      type="number" 
                                      required 
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Gender*</label>
                                    <Select value={patientGender} onValueChange={setPatientGender}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Phone Number*</label>
                                  <Input 
                                    value={patientPhone} 
                                    onChange={(e) => setPatientPhone(e.target.value)} 
                                    placeholder="Enter phone number" 
                                    required 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Collection Address (for home collection)</label>
                                  <Input 
                                    value={patientAddress} 
                                    onChange={(e) => setPatientAddress(e.target.value)} 
                                    placeholder="Enter your complete address" 
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Date*</label>
                                    <Input 
                                      type="date" 
                                      value={selectedDate}
                                      onChange={(e) => setSelectedDate(e.target.value)}
                                      min={new Date().toISOString().split('T')[0]}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Time Slot*</label>
                                    <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="6am-8am">6:00 AM - 8:00 AM</SelectItem>
                                        <SelectItem value="8am-10am">8:00 AM - 10:00 AM</SelectItem>
                                        <SelectItem value="10am-12pm">10:00 AM - 12:00 PM</SelectItem>
                                        <SelectItem value="12pm-2pm">12:00 PM - 2:00 PM</SelectItem>
                                        <SelectItem value="2pm-4pm">2:00 PM - 4:00 PM</SelectItem>
                                        <SelectItem value="4pm-6pm">4:00 PM - 6:00 PM</SelectItem>
                                        <SelectItem value="6pm-8pm">6:00 PM - 8:00 PM</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <div className="flex justify-between items-center w-full">
                                  <div>
                                    <p className="font-medium">Total Amount</p>
                                    <p className="font-bold text-xl text-primary">₹{pkg.discountedPrice}</p>
                                  </div>
                                  <Button onClick={handleBookTest}>Confirm Booking</Button>
                                </div>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* FAQ Section */}
          <div className="py-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">How can I book a lab test?</h3>
                  <p className="text-sm text-[#666666]">You can book a lab test online through the MediConnect website or app. Select your preferred test or package, choose a date and time slot for sample collection, and provide patient details.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Is fasting required before a lab test?</h3>
                  <p className="text-sm text-[#666666]">Fasting requirements vary depending on the test. Some tests like lipid profile and glucose tests require 8-12 hours of fasting, while others do not. The fasting requirements are mentioned in the test details.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">How is the sample collected?</h3>
                  <p className="text-sm text-[#666666]">A trained phlebotomist will visit your home at the scheduled time to collect the blood sample. They follow all safety and hygiene protocols during the process.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">When will I receive my test results?</h3>
                  <p className="text-sm text-[#666666]">The turnaround time for results varies by test. Most routine tests provide results within 24-48 hours. The estimated reporting time is mentioned in the test details.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">How can I pay for my lab test?</h3>
                  <p className="text-sm text-[#666666]">We offer multiple payment options including credit/debit cards, UPI, digital wallets, and cash on collection. You can pay online while booking or at the time of sample collection.</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Need Help Section */}
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need help selecting the right test?</h2>
            <p className="text-[#666666] mb-6 max-w-2xl mx-auto">Our healthcare experts can help you choose the right diagnostic tests based on your symptoms and requirements.</p>
            <Button className="primary-button px-6 py-6 h-auto">
              <Phone className="mr-2 h-5 w-5" />
              Speak to Healthcare Expert
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LabTests;