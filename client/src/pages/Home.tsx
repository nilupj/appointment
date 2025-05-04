import SearchSection from "@/components/layout/SearchSection";
import ConsultationOptions from "@/components/home/ConsultationOptions";
import TopSpecialists from "@/components/home/TopSpecialists";
import AppointmentBooking from "@/components/home/AppointmentBooking";
import ArticlesSection from "@/components/home/ArticlesSection";
import Testimonials from "@/components/home/Testimonials";
import AppDownload from "@/components/home/AppDownload";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>MediConnect - Healthcare at Your Fingertips</title>
        <meta name="description" content="Online healthcare platform for finding doctors, booking appointments, and accessing medical information." />
      </Helmet>
      
      <SearchSection />
      <ConsultationOptions />
      <TopSpecialists />
      <AppointmentBooking />
      <ArticlesSection />
      <Testimonials />
      <AppDownload />
    </>
  );
};

export default Home;
