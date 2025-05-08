import { Helmet } from "react-helmet";
import SearchSection from "@/components/layout/SearchSection";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Star, Video } from "lucide-react";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  consultationFee: number;
  imageSrc: string;
  availableSlots: string[];
  languages: string[];
};

const VideoConsult = () => {
  const { data: doctors, isLoading } = useQuery<Doctor[]>({
    queryKey: ['/api/video-consult-doctors'],
  });

  const bookAppointment = async (doctorId: number, slot: string) => {
    try {
      const formattedSlot = slot.replace(/[APM]/g, '').trim().padStart(5, '0');
      // Redirect to payment gateway
      window.location.href = `/payment-gateway/${doctorId}/${encodeURIComponent(formattedSlot)}`;
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: doctorId,
          slot: formattedSlot,
          date: date,
          patientNotes: ''
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to book appointment' }));
        throw new Error(errorData.message || 'Failed to book appointment');
      }

      const data = await response.json();
      const appointment = data[0] || data; // Handle both array and direct object response
      if (appointment?.id) {
        const doctorName = doctors?.find(d => d.id === doctorId)?.name || '';
        window.location.href = `/video-consult/room?doctor=${encodeURIComponent(doctorName)}&appointmentId=${appointment.id}`;
      } else {
        throw new Error('Invalid appointment response');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      const errorMessage = error.message === 'Authentication required' 
        ? 'Please login to book an appointment' 
        : 'Failed to book appointment. Please try again.';
      alert(errorMessage);
    }
  };

  // Assuming 'user' is available in the component's scope.  This would need to be fetched/provided.
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  return (
    <>
      <Helmet>
        <title>Video Consultation | MediConnect</title>
        <meta name="description" content="Consult with top doctors online via video call." />
      </Helmet>

      <SearchSection />

      <div className="bg-white py-8">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-3">Online Video Consultation</h1>
            <p className="text-[#666666] max-w-2xl mx-auto">Consult with top doctors from the comfort of your home. Get medical advice, prescriptions, and follow-ups without leaving your home.</p>
          </div>

          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="rounded-full bg-blue-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Video className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Connect Within Minutes</h3>
                <p className="text-sm text-[#666666]">No waiting times. Connect with doctors instantly for your medical needs.</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="rounded-full bg-blue-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Verified Doctors</h3>
                <p className="text-sm text-[#666666]">All doctors on our platform are verified, experienced and trusted healthcare providers.</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="rounded-full bg-blue-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Available 24/7</h3>
                <p className="text-sm text-[#666666]">Get medical advice anytime, day or night. We have doctors available round the clock.</p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular Specialties</h2>

            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Specialties</TabsTrigger>
                <TabsTrigger value="general_medicine">General Medicine</TabsTrigger>
                <TabsTrigger value="dermatology">Dermatology</TabsTrigger>
                <TabsTrigger value="pediatrics">Pediatrics</TabsTrigger>
                <TabsTrigger value="gynecology">Gynecology</TabsTrigger>
                <TabsTrigger value="psychiatry">Psychiatry</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    [...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="flex mb-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 mr-4"></div>
                            <div className="flex-1">
                              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-4 bg-gray-100 rounded w-1/2 mb-1"></div>
                              <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                          </div>
                          <div className="flex justify-between items-center mb-4">
                            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                          </div>
                          <div className="h-10 bg-primary rounded-md w-full"></div>
                        </CardContent>
                      </Card>
                    ))
                  ) : doctors && doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <Card key={doctor.id} className="hover:shadow-md transition">
                        <CardContent className="p-6">
                          <div className="flex mb-4">
                            <img 
                              src={doctor.imageSrc} 
                              alt={doctor.name} 
                              className="w-16 h-16 rounded-full object-cover mr-4"
                              loading="lazy"
                            />
                            <div>
                              <h3 className="font-semibold">{doctor.name}</h3>
                              <p className="text-sm text-[#666666]">{doctor.specialty}</p>
                              <div className="flex items-center mt-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                                <span className="text-sm font-medium">{doctor.rating}</span>
                                <span className="text-[#666666] text-xs ml-1">(120+ ratings)</span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm mb-1">
                              <span className="text-[#666666]">Experience:</span> <span className="font-medium">{doctor.experience} years</span>
                            </p>
                            <p className="text-sm mb-1">
                              <span className="text-[#666666]">Languages:</span> <span className="font-medium">{doctor.languages.join(", ")}</span>
                            </p>
                          </div>

                          <div className="flex justify-between items-center mb-4">
                            <p className="text-[#666666] text-sm">Available</p>
                            <p className="font-semibold">₹{doctor.consultationFee}</p>
                          </div>

                          {user ? (
                            <Button 
                              className="primary-button w-full"
                              onClick={() => bookAppointment(doctor.id, doctor.availableSlots[0])}
                            >
                              Book Consultation
                            </Button>
                          ) : (
                            <Button 
                              className="primary-button w-full"
                              asChild
                            >
                              <a href="/auth">Login to Book</a>
                            </Button>
                          )}

                          <div className="mt-3">
                            <p className="text-xs text-center text-[#666666]">Next available slot: Today, {doctor.availableSlots[0]}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <p className="text-center text-[#666666]">No doctors available at the moment. Please check back later.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Other tab contents would be similar to the "all" tab */}
              <TabsContent value="general_medicine">
                <div className="text-center p-8">
                  <p>General Medicine doctors will be displayed here</p>
                </div>
              </TabsContent>

              <TabsContent value="dermatology">
                <div className="text-center p-8">
                  <p>Dermatology doctors will be displayed here</p>
                </div>
              </TabsContent>

              <TabsContent value="pediatrics">
                <div className="text-center p-8">
                  <p>Pediatrics doctors will be displayed here</p>
                </div>
              </TabsContent>

              <TabsContent value="gynecology">
                <div className="text-center p-8">
                  <p>Gynecology doctors will be displayed here</p>
                </div>
              </TabsContent>

              <TabsContent value="psychiatry">
                <div className="text-center p-8">
                  <p>Psychiatry doctors will be displayed here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">How Video Consultation Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="rounded-full bg-blue-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold mb-2">Choose a Doctor</h3>
                <p className="text-sm text-[#666666]">Browse through our list of verified specialists and select your preferred doctor</p>
              </div>

              <div className="text-center">
                <div className="rounded-full bg-blue-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold mb-2">Make Payment</h3>
                <p className="text-sm text-[#666666]">Complete the payment securely through PayPal, credit card or UPI</p>
              </div>

              <div className="text-center">
                <div className="rounded-full bg-blue-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold mb-2">Join Video Call</h3>
                <p className="text-sm text-[#666666]">Connect with your doctor instantly through our secure high-quality video platform</p>
              </div>

              <div className="text-center">
                <div className="rounded-full bg-blue-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">4</span>
                </div>
                <h3 className="font-semibold mb-2">Get Prescription</h3>
                <p className="text-sm text-[#666666]">Receive digital prescription and personalized treatment plan after consultation</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button 
                className="primary-button"
                asChild
              >
                <a href="/payment">See Pricing Plans</a>
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">What is an online video consultation?</h3>
                  <p className="text-sm text-[#666666]">An online video consultation is a virtual appointment with a doctor via video call where you can discuss your health concerns just like an in-person visit.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Is the video consultation secure and private?</h3>
                  <p className="text-sm text-[#666666]">Yes, all video consultations are conducted on a secure platform with end-to-end encryption. Your privacy is our priority.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">How long does a video consultation last?</h3>
                  <p className="text-sm text-[#666666]">A standard video consultation typically lasts 15-20 minutes, but it can vary depending on your health concerns and the doctor's assessment.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Can the doctor prescribe medications during a video consultation?</h3>
                  <p className="text-sm text-[#666666]">Yes, doctors can prescribe medications during a video consultation. You'll receive a digital prescription that can be used at any pharmacy.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">What if I face technical issues during the consultation?</h3>
                  <p className="text-sm text-[#666666]">Our support team is available to help resolve any technical issues. If the video call fails, the doctor may continue via phone call or reschedule at no additional cost.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoConsult;