import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  id: number;
  text: string;
  name: string;
  title: string;
  initials: string;
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  if (isLoading) {
    return (
      <section className="py-10 bg-white">
        <div className="container">
          <h2 className="font-bold text-2xl mb-8 text-center">What our users have to say</h2>
          
          <div className="relative">
            <div className="bg-[#f0f4f8] rounded-lg p-6 md:w-1/3 mx-auto">
              <div className="h-24 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white"></div>
                <div className="ml-3">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !testimonials || testimonials.length === 0) {
    return null;
  }

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="py-10 bg-white">
      <div className="container">
        <h2 className="font-bold text-2xl mb-8 text-center">What our users have to say</h2>
        
        <div className="relative">
          <div className="md:w-2/3 lg:w-1/2 mx-auto">
            <div className="bg-[#f0f4f8] rounded-lg p-6">
              <p className="italic text-[#666666] mb-4">"{activeTestimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {activeTestimonial.initials}
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">{activeTestimonial.name}</h4>
                  <p className="text-sm text-[#666666]">{activeTestimonial.title}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-primary hidden md:flex"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-primary hidden md:flex"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        
        {/* Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button 
              key={index}
              className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-primary' : 'bg-[#e1e8ed]'}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
