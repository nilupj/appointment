
import { Helmet } from "react-helmet";
import SearchSection from "@/components/layout/SearchSection";

export default function Medicines() {
  return (
    <>
      <Helmet>
        <title>Medicines | MediConnect</title>
        <meta name="description" content="Order medicines online with quick delivery." />
      </Helmet>
      
      <SearchSection />
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Online Medicines</h1>
        <p className="text-gray-600 mb-8">Order your medicines online and get them delivered to your doorstep.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Placeholder content - replace with actual medicine categories/content */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Prescription Medicines</h3>
            <p className="text-sm text-gray-600">Upload your prescription and order medicines.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Over-the-Counter</h3>
            <p className="text-sm text-gray-600">Browse and buy common medicines without prescription.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Healthcare Products</h3>
            <p className="text-sm text-gray-600">Health supplements and medical devices.</p>
          </div>
        </div>
      </div>
    </>
  );
}
