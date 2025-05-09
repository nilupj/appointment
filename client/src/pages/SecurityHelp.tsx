
import { Helmet } from "react-helmet";

export default function SecurityHelp() {
  return (
    <>
      <Helmet>
        <title>Security & Help | MediConnect</title>
        <meta name="description" content="Security information and help center for MediConnect users." />
      </Helmet>
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Security & Help Center</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-4">Security</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Data Protection</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-4">Help Center</h3>
            <ul className="space-y-2 text-gray-600">
              <li>FAQs</li>
              <li>Contact Support</li>
              <li>User Guidelines</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
