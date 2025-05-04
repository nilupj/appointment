import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

type ClinicSpecialty = {
  id: number;
  name: string;
  description: string;
  imageSrc: string;
  alt: string;
};

const AppointmentBooking = () => {
  const { data: clinicSpecialties, isLoading, error } = useQuery<ClinicSpecialty[]>({
    queryKey: ['/api/clinic-specialties'],
  });

  if (isLoading) {
    return (
      <section className="py-10 bg-white">
        <div className="container">
          <h2 className="font-bold text-2xl mb-2">Book an appointment for an in-clinic consultation</h2>
          <p className="text-[#666666] mb-8">Find experienced doctors across all specialties</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-[#e1e8ed] rounded-lg overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-3 animate-pulse"></div>
                  <div className="h-4 bg-blue-100 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  return (
    <section className="py-10 bg-white">
      <div className="container">
        <h2 className="font-bold text-2xl mb-2">Book an appointment for an in-clinic consultation</h2>
        <p className="text-[#666666] mb-8">Find experienced doctors across all specialties</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clinicSpecialties?.map((specialty) => (
            <div 
              key={specialty.id} 
              className="border border-[#e1e8ed] rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
            >
              <img 
                src={specialty.imageSrc} 
                alt={specialty.alt} 
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h3 className="font-medium text-base mb-1">{specialty.name}</h3>
                <p className="text-sm text-[#666666] mb-3">{specialty.description}</p>
                <Link href={`/specialty/${specialty.id}`} className="text-primary text-sm font-medium flex items-center">
                  <span>BOOK NOW</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppointmentBooking;
