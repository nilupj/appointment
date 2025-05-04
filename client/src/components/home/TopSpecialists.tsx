import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

type Specialist = {
  id: number;
  name: string;
  imageSrc: string;
  alt: string;
};

const TopSpecialists = () => {
  const { data: specialists, isLoading, error } = useQuery<Specialist[]>({
    queryKey: ['/api/specialists'],
  });

  if (isLoading) {
    return (
      <section className="py-10 bg-white">
        <div className="container">
          <h2 className="font-bold text-2xl mb-8">Consult top doctors online for any health concern</h2>
          <p className="text-[#666666] mb-8">Private online consultations with verified doctors in all specialists</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="rounded-full bg-blue-100 w-20 h-20 mx-auto mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
                <div className="h-3 bg-blue-100 rounded w-1/2 mx-auto animate-pulse"></div>
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
        <h2 className="font-bold text-2xl mb-8">Consult top doctors online for any health concern</h2>
        <p className="text-[#666666] mb-8">Private online consultations with verified doctors in all specialists</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {specialists?.map((specialist) => (
            <Link key={specialist.id} href={`/specialist/${specialist.id}`} className="text-center cursor-pointer group">
              <div className="rounded-full bg-blue-100 w-20 h-20 mx-auto mb-3 flex items-center justify-center group-hover:bg-blue-200 transition">
                <img 
                  src={specialist.imageSrc} 
                  alt={specialist.alt} 
                  className="w-10 h-10 rounded-full"
                  loading="lazy"
                />
              </div>
              <h3 className="font-medium text-sm mb-1">{specialist.name}</h3>
              <p className="text-xs text-primary">CONSULT NOW</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSpecialists;
