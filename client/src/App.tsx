import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FindDoctors from "@/pages/FindDoctors";
import VideoConsult from "@/pages/VideoConsult";
import VideoConsultRoom from "@/pages/VideoConsultRoom";
import Surgeries from "@/pages/Surgeries";
import ArticleDetail from "@/pages/ArticleDetail";
import AuthPage from "@/pages/auth-page";
import UserProfile from "@/pages/UserProfile";
import LabTests from "@/pages/LabTests";
import PaymentPage from "@/components/payment/PaymentPage";
import WhatsAppFloat from "@/components/chat/WhatsAppFloat";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import AdminDashboard from './pages/AdminDashboard';
import Medicines from './pages/Medicines';
import ForCorporates from './pages/ForCorporates';
import ForProviders from './pages/ForProviders';
import SecurityHelp from './pages/SecurityHelp';

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/find-doctors" component={FindDoctors} />
          <Route path="/video-consult" component={VideoConsult} />
          <ProtectedRoute path="/video-consult/room" component={VideoConsultRoom} />
          <Route path="/surgeries" component={Surgeries} />
          <Route path="/lab-tests" component={LabTests} />
          <Route path="/articles/:id" component={ArticleDetail} />
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/profile" component={UserProfile} />
          <ProtectedRoute path="/payment" component={PaymentPage} />
          <ProtectedRoute path="/admin" component={AdminDashboard} />
          <Route path="/app" component={Home} />
          <Route path="/doctor-profile" component={FindDoctors} />
          <Route path="/for-clinics" component={Home} />
          <Route path="/ray" component={Home} />
          <Route path="/reach" component={Home} />
          <Route path="/pro" component={Home} />
          <Route path="/insta" component={Home} />
          <Route path="/qikwell" component={Home} />
          <Route path="/hospital-profile" component={Home} />
          <Route path="/hospital-reach" component={Home} />
          <Route path="/medicines" component={Medicines} />
          <Route path="/for-corporates" component={ForCorporates} />
          <Route path="/for-providers" component={ForProviders} />
          <Route path="/security-help" component={SecurityHelp} />
          <Route path="*" component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <WhatsAppFloat />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;