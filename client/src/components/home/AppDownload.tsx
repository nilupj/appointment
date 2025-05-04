import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const AppDownload = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSendAppLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/send-app-link", { phoneNumber });
      
      toast({
        title: "Success!",
        description: "App link has been sent to your phone",
      });
      
      setPhoneNumber("");
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Could not send the app link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-white border-t border-[#e1e8ed]">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <img 
              src="https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=400&h=500" 
              alt="Doctor using mobile app" 
              className="mx-auto max-w-[300px]"
              width="300"
              loading="lazy"
            />
          </div>
          <div className="md:w-2/3 md:pl-10">
            <h2 className="font-bold text-2xl mb-4">Download the MediConnect app</h2>
            <p className="text-[#666666] mb-6">Book appointments, order medicines, consult with doctors online, access health records on the go. More than 25 million users.</p>
            
            <form onSubmit={handleSendAppLink} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <div className="relative w-full sm:w-auto">
                <Input 
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full border border-[#e1e8ed] rounded-md py-6 focus:ring-primary"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  pattern="[0-9]*"
                  minLength={10}
                  maxLength={15}
                />
              </div>
              <Button 
                type="submit" 
                className="primary-button px-6 py-6 h-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send app link"}
              </Button>
            </form>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a 
                href="#" 
                className="bg-black text-white px-6 py-3 rounded-md font-medium flex items-center transition hover:bg-black/80"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.19892 22.75C3.00031 22.75 2.80856 22.707 2.63069 22.622C2.26294 22.4336 2.0332 22.0787 2.0332 21.665V2.33498C2.0332 1.92127 2.26294 1.56636 2.63069 1.37799C3.00519 1.18274 3.43994 1.23186 3.76544 1.50024L12.8657 9.33498C13.3654 9.75557 14.6345 9.75557 15.1342 9.33498L24.2344 1.50024C24.5599 1.23186 24.9947 1.18274 25.3692 1.37799C25.7369 1.56636 25.9667 1.92127 25.9667 2.33498V21.665C25.9667 22.0787 25.7369 22.4336 25.3692 22.622C25.2001 22.7033 25.0083 22.7467 24.8097 22.7467C24.5423 22.7467 24.2798 22.6598 24.0742 22.4834L15.1342 14.7917C14.6345 14.3711 13.3654 14.3711 12.8657 14.7917L3.92567 22.4834C3.71994 22.6598 3.45744 22.75 3.19892 22.75Z" />
                </svg>
                Get it on Google Play
              </a>
              <a 
                href="#" 
                className="bg-black text-white px-6 py-3 rounded-md font-medium flex items-center transition hover:bg-black/80"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.0781 24H4.92188C3.31286 24 2 22.6871 2 21.0781V2.92188C2 1.31286 3.31286 0 4.92188 0H19.0781C20.6871 0 22 1.31286 22 2.92188V21.0781C22 22.6871 20.6871 24 19.0781 24ZM12 7.5C13.6569 7.5 15 6.15685 15 4.5C15 2.84315 13.6569 1.5 12 1.5C10.3431 1.5 9 2.84315 9 4.5C9 6.15685 10.3431 7.5 12 7.5ZM15 16.5C15 14.8431 13.6569 13.5 12 13.5C10.3431 13.5 9 14.8431 9 16.5C9 18.1569 10.3431 19.5 12 19.5C13.6569 19.5 15 18.1569 15 16.5Z" />
                </svg>
                Download on App Store
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
