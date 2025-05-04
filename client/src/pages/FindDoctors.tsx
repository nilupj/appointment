import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import SearchSection from "@/components/layout/SearchSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ThumbsUp, Calendar, MapPin, Phone } from "lucide-react";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  experience: number;
  imageSrc: string;
  consultationFee: number;
  availability: string;
};

const FindDoctors = () => {
  const [filters, setFilters] = useState({
    specialty: "all",
    location: "all",
    experience: [0, 30],
    availability: "all",
    gender: "all",
    fee: [0, 5000]
  });

  const { data: doctors, isLoading, error } = useQuery<Doctor[]>({
    queryKey: ['/api/doctors', filters],
  });

  const handleExperienceChange = (value: number[]) => {
    setFilters({
      ...filters,
      experience: value
    });
  };

  const handleFeeChange = (value: number[]) => {
    setFilters({
      ...filters,
      fee: value
    });
  };

  const handleFilterChange = (key: string, value: string | number[]) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      specialty: "all",
      location: "all",
      experience: [0, 30],
      availability: "all",
      gender: "all",
      fee: [0, 5000]
    });
  };

  return (
    <>
      <Helmet>
        <title>Find Doctors | MediConnect</title>
        <meta name="description" content="Find and book appointments with the best doctors near you." />
      </Helmet>
      
      <SearchSection />
      
      <div className="bg-white py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">Find Doctors</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Section */}
            <div className="lg:w-1/4">
              <div className="bg-[#f7f9fc] p-6 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <Button variant="link" onClick={resetFilters} className="text-primary">Reset All</Button>
                </div>
                
                <div className="space-y-6">
                  {/* Specialty Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Specialty</label>
                    <Select
                      value={filters.specialty}
                      onValueChange={(value) => handleFilterChange("specialty", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specialties</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Select
                      value={filters.location}
                      onValueChange={(value) => handleFilterChange("location", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
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
                  
                  {/* Experience Filter */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Experience</label>
                      <span className="text-sm text-[#666666]">{filters.experience[0]}-{filters.experience[1]} years</span>
                    </div>
                    <Slider
                      defaultValue={[0, 30]}
                      max={30}
                      step={1}
                      value={filters.experience}
                      onValueChange={handleExperienceChange}
                      className="py-4"
                    />
                  </div>
                  
                  {/* Availability Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Availability</label>
                    <Select
                      value={filters.availability}
                      onValueChange={(value) => handleFilterChange("availability", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                        <SelectItem value="weekend">This Weekend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Gender Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Gender</label>
                    <Select
                      value={filters.gender}
                      onValueChange={(value) => handleFilterChange("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Fee Filter */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Consultation Fee</label>
                      <span className="text-sm text-[#666666]">₹{filters.fee[0]}-₹{filters.fee[1]}</span>
                    </div>
                    <Slider
                      defaultValue={[0, 5000]}
                      max={5000}
                      step={100}
                      value={filters.fee}
                      onValueChange={handleFeeChange}
                      className="py-4"
                    />
                  </div>

                  <Button className="primary-button w-full">Apply Filters</Button>
                </div>
              </div>
            </div>
            
            {/* Doctors List */}
            <div className="lg:w-3/4">
              <Tabs defaultValue="relevance" className="mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <TabsList>
                    <TabsTrigger value="relevance">Relevance</TabsTrigger>
                    <TabsTrigger value="availability">Availability</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="fee_low">Fee: Low to High</TabsTrigger>
                    <TabsTrigger value="fee_high">Fee: High to Low</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-[#666666]">Found:</span>
                    <span className="text-sm font-medium">{doctors?.length || 0} doctors</span>
                  </div>
                </div>
              </Tabs>
              
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(5)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
                            <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                          </div>
                          <div className="md:w-2/4 p-6 border-b md:border-b-0 md:border-r border-gray-200">
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
                            <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
                            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                          </div>
                          <div className="md:w-1/4 p-6 flex flex-col justify-between">
                            <div>
                              <div className="h-5 bg-gray-200 rounded w-full mb-3"></div>
                              <div className="h-4 bg-gray-100 rounded w-3/4 mb-6"></div>
                            </div>
                            <div className="h-10 bg-primary rounded-md w-full"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="bg-red-50 p-6 rounded-lg">
                  <p className="text-red-500">Error loading doctors. Please try again later.</p>
                </div>
              ) : doctors && doctors.length > 0 ? (
                <div className="space-y-6">
                  {doctors.map((doctor) => (
                    <Card key={doctor.id} className="hover:shadow-md transition">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
                            <img 
                              src={doctor.imageSrc} 
                              alt={doctor.name} 
                              className="w-24 h-24 rounded-full object-cover mb-3"
                              loading="lazy"
                            />
                            <h3 className="font-semibold text-center">{doctor.name}</h3>
                            <p className="text-sm text-[#666666] text-center">{doctor.specialty}</p>
                          </div>
                          <div className="md:w-2/4 p-6 border-b md:border-b-0 md:border-r border-gray-200">
                            <div className="flex items-center mb-3">
                              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                              <span className="font-medium">{doctor.rating}</span>
                              <span className="text-[#666666] text-sm ml-2">(120+ ratings)</span>
                            </div>
                            
                            <div className="flex items-start mb-2">
                              <ThumbsUp className="h-4 w-4 text-primary mr-2 mt-1" />
                              <p className="text-sm">
                                <span className="font-medium">{doctor.experience} years</span>
                                <span className="text-[#666666]"> of experience overall</span>
                              </p>
                            </div>
                            
                            <div className="flex items-start mb-2">
                              <MapPin className="h-4 w-4 text-primary mr-2 mt-1" />
                              <p className="text-sm text-[#666666]">{doctor.location}</p>
                            </div>
                            
                            <div className="flex items-start">
                              <Calendar className="h-4 w-4 text-primary mr-2 mt-1" />
                              <p className="text-sm text-[#666666]">Available {doctor.availability}</p>
                            </div>
                          </div>
                          <div className="md:w-1/4 p-6 flex flex-col justify-between">
                            <div>
                              <p className="text-sm text-[#666666] mb-1">Consultation fee</p>
                              <p className="font-semibold text-xl mb-3">₹{doctor.consultationFee}</p>
                            </div>
                            <Button className="primary-button">Book Appointment</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-blue-500">No doctors found with the selected filters. Try adjusting your filters.</p>
                </div>
              )}
              
              {doctors && doctors.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Button variant="outline" className="mx-2">Previous</Button>
                  <Button variant="outline" className="mx-2 bg-primary text-white">1</Button>
                  <Button variant="outline" className="mx-2">2</Button>
                  <Button variant="outline" className="mx-2">3</Button>
                  <Button variant="outline" className="mx-2">Next</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindDoctors;
