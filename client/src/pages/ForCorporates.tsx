
import { Helmet } from "react-helmet";

export default function ForCorporates() {
  return (
    <>
      <Helmet>
        <title>For Corporates | MediConnect</title>
        <meta name="description" content="Corporate healthcare solutions and employee wellness programs." />
      </Helmet>
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Corporate Healthcare Solutions</h1>
        <p className="text-gray-600 mb-8">Comprehensive healthcare solutions for your organization.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-4">Employee Wellness Programs</h3>
            <p className="text-gray-600">Customized wellness programs to keep your employees healthy and productive.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-4">Corporate Health Packages</h3>
            <p className="text-gray-600">Comprehensive health checkup packages for your workforce.</p>
          </div>
        </div>
      </div>
    </>
  );
}
