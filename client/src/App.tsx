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
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
          <Route path="/articles/:id" component={ArticleDetail} />
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
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
