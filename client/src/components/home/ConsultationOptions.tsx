import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

const ConsultationOptions = () => {
  const options = [
    {
      title: "Instant Video Consultation",
      description: "Connect within 60 secs",
      imageSrc: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=150&h=150",
      alt: "Doctor on phone",
      buttonText: "CONSULT NOW",
      link: "/video-consult"
    },
    {
      title: "Find Doctors Near You",
      description: "Confirmed appointments",
      imageSrc: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150",
      alt: "Doctor with stethoscope",
      buttonText: "FIND DOCTORS",
      link: "/find-doctors"
    },
    {
      title: "Surgeries",
      description: "Safe and trusted",
      imageSrc: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=150&h=150",
      alt: "Surgeon in operation room",
      buttonText: "BOOK NOW",
      link: "/surgeries"
    }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option, index) => (
            <div 
              key={index} 
              className="bg-blue-100 rounded-xl p-5 flex items-center transition hover:shadow-md cursor-pointer"
            >
              <div className="w-1/3">
                <img 
                  src={option.imageSrc} 
                  alt={option.alt} 
                  className="rounded-lg object-cover"
                  width="120" 
                  height="120"
                  loading="lazy"
                />
              </div>
              <div className="w-2/3 pl-4">
                <h3 className="font-bold text-lg mb-1">{option.title}</h3>
                <p className="text-sm text-[#666666] mb-3">{option.description}</p>
                <Link href={option.link} className="text-primary text-sm font-medium flex items-center">
                  <span>{option.buttonText}</span>
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

export default ConsultationOptions;
