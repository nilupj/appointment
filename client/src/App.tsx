import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FindDoctors from "@/pages/FindDoctors";
import VideoConsult from "@/pages/VideoConsult";
import Surgeries from "@/pages/Surgeries";
import ArticleDetail from "@/pages/ArticleDetail";
import AuthPage from "@/pages/auth-page";
import UserProfile from "@/pages/UserProfile";
import LabTests from "@/pages/LabTests";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/find-doctors" component={FindDoctors} />
          <Route path="/video-consult" component={VideoConsult} />
          <Route path="/surgeries" component={Surgeries} />
          <Route path="/lab-tests" component={LabTests} />
          <Route path="/articles/:id" component={ArticleDetail} />
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/profile" component={UserProfile} />
          <Route component={NotFound} />
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
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
