import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import SearchSection from "@/components/layout/SearchSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Phone, MapPin, Calendar, Clock } from "lucide-react";

type Surgery = {
  id: number;
  name: string;
  description: string;
  benefits: string[];
  imageSrc: string;
  cost: {
    min: number;
    max: number;
  };
  duration: string;
  recovery: string;
};

const Surgeries = () => {
  const { data: surgeries, isLoading } = useQuery<Surgery[]>({
    queryKey: ['/api/surgeries'],
  });

  return (
    <>
      <Helmet>
        <title>Surgeries | MediConnect</title>
        <meta name="description" content="Book safe and trusted surgeries with top surgeons at affordable prices." />
      </Helmet>
      
      <SearchSection />
      
      <div className="bg-white py-8">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-3">Safe and Trusted Surgeries</h1>
            <p className="text-[#666666] max-w-2xl mx-auto">Book surgeries with expert surgeons at affordable, transparent prices. All inclusive packages with end-to-end care.</p>
          </div>
          
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <p className="text-sm text-[#666666]">Experienced Surgeons</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <p className="text-sm text-[#666666]">Surgical Procedures</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">100+</div>
                <p className="text-sm text-[#666666]">Partner Hospitals</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                <p className="text-sm text-[#666666]">Successful Surgeries</p>
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Why Choose MediConnect for Surgery?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Expert Surgeons</h3>
                  <p className="text-sm text-[#666666]">All surgeries are performed by experienced surgeons with proven track records of successful procedures.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Advanced Facilities</h3>
                  <p className="text-sm text-[#666666]">Our partner hospitals are equipped with state-of-the-art technology and adhere to strict safety protocols.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Affordable Packages</h3>
                  <p className="text-sm text-[#666666]">Transparent, all-inclusive pricing with no hidden costs. We ensure quality treatment at reasonable rates.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">End-to-End Care</h3>
                  <p className="text-sm text-[#666666]">From pre-surgery consultations to post-operative care, we ensure a smooth experience throughout your treatment journey.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Personalized Support</h3>
                  <p className="text-sm text-[#666666]">A dedicated MediConnect Care team to guide you through the entire process and address all your concerns.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Insurance Support</h3>
                  <p className="text-sm text-[#666666]">We assist you with insurance claims to ensure maximum coverage for your procedure.</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular Surgeries</h2>
            
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Surgeries</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="ortho">Orthopedic</TabsTrigger>
                <TabsTrigger value="gynae">Gynecology</TabsTrigger>
                <TabsTrigger value="ent">ENT</TabsTrigger>
                <TabsTrigger value="ophthal">Ophthalmology</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    [...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="h-48 bg-gray-200"></div>
                        <CardContent className="p-6">
                          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                          <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-100 rounded w-3/4 mb-4"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                          <div className="h-10 bg-primary rounded-md w-full"></div>
                        </CardContent>
                      </Card>
                    ))
                  ) : surgeries && surgeries.length > 0 ? (
                    surgeries.map((surgery) => (
                      <Card key={surgery.id} className="hover:shadow-md transition overflow-hidden">
                        <img 
                          src={surgery.imageSrc} 
                          alt={surgery.name} 
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-2">{surgery.name}</h3>
                          <p className="text-sm text-[#666666] mb-4">{surgery.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-start">
                              <Clock className="h-4 w-4 text-primary mr-2 mt-1" />
                              <p className="text-sm">
                                <span className="text-[#666666]">Duration:</span> <span className="font-medium">{surgery.duration}</span>
                              </p>
                            </div>
                            
                            <div className="flex items-start">
                              <Calendar className="h-4 w-4 text-primary mr-2 mt-1" />
                              <p className="text-sm">
                                <span className="text-[#666666]">Recovery:</span> <span className="font-medium">{surgery.recovery}</span>
                              </p>
                            </div>
                          </div>
                          
                          <p className="font-semibold text-lg mb-4">₹{surgery.cost.min.toLocaleString()} - ₹{surgery.cost.max.toLocaleString()}</p>
                          
                          <Button className="primary-button w-full">Book Consultation</Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <p className="text-center text-[#666666]">No surgeries available at the moment. Please check back later.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Other tab contents would be similar to the "all" tab */}
              <TabsContent value="general">
                <div className="text-center p-8">
                  <p>General surgeries will be displayed here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="ortho">
                <div className="text-center p-8">
                  <p>Orthopedic surgeries will be displayed here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="gynae">
                <div className="text-center p-8">
                  <p>Gynecology surgeries will be displayed here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="ent">
                <div className="text-center p-8">
                  <p>ENT surgeries will be displayed here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="ophthal">
                <div className="text-center p-8">
                  <p>Ophthalmology surgeries will be displayed here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-8 text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Not sure which surgery you need?</h2>
            <p className="text-[#666666] mb-6 max-w-2xl mx-auto">Speak with our medical experts who will guide you on the right treatment options for your condition.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="primary-button px-6 py-6 h-auto">
                <Phone className="mr-2 h-5 w-5" />
                Request Callback
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-6 py-6 h-auto">
                Book Free Consultation
              </Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">How it Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="text-center">
                <div className="rounded-full bg-blue-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold mb-2">Book Consultation</h3>
                <p className="text-sm text-[#666666]">Schedule a free consultation with our medical expert</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-blue-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold mb-2">Meet the Surgeon</h3>
                <p className="text-sm text-[#666666]">Discuss your case with an experienced surgeon</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-blue-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold mb-2">Pre-Surgery Tests</h3>
                <p className="text-sm text-[#666666]">Get all required diagnostics done</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-blue-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">4</span>
                </div>
                <h3 className="font-semibold mb-2">Surgery Day</h3>
                <p className="text-sm text-[#666666]">Undergo the procedure with complete care</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-blue-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">5</span>
                </div>
                <h3 className="font-semibold mb-2">Post-Op Care</h3>
                <p className="text-sm text-[#666666]">Follow-up visits and recovery assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Surgeries;
