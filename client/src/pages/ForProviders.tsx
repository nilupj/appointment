
import { Helmet } from "react-helmet";

export default function ForProviders() {
  return (
    <>
      <Helmet>
        <title>For Providers | MediConnect</title>
        <meta name="description" content="Join MediConnect as a healthcare provider." />
      </Helmet>
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">For Healthcare Providers</h1>
        <p className="text-gray-600 mb-8">Join our network of healthcare providers and expand your practice.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-4">For Doctors</h3>
            <p className="text-gray-600">Register as a doctor and connect with patients online.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-4">For Hospitals</h3>
            <p className="text-gray-600">Partner with us to digitize your hospital operations.</p>
          </div>
        </div>
      </div>
    </>
  );
}
