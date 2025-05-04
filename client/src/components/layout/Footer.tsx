import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[#192133] text-white pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="font-medium mb-4">MediConnect</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/press" className="hover:text-white transition">Press</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Column 2 */}
          <div>
            <h3 className="font-medium mb-4">For Patients</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/find-doctors" className="hover:text-white transition">Search for Doctors</Link></li>
              <li><Link href="/find-clinics" className="hover:text-white transition">Search for Clinics</Link></li>
              <li><Link href="/book-tests" className="hover:text-white transition">Book Diagnostic Tests</Link></li>
              <li><Link href="/checkups" className="hover:text-white transition">Book Full Body Checkups</Link></li>
              <li><Link href="/app" className="hover:text-white transition">Health App</Link></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="font-medium mb-4">For Doctors</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/doctor-profile" className="hover:text-white transition">MediConnect Profile</Link></li>
              <li><Link href="/for-clinics" className="hover:text-white transition">For Clinics</Link></li>
              <li><Link href="/ray" className="hover:text-white transition">Ray by MediConnect</Link></li>
              <li><Link href="/reach" className="hover:text-white transition">MediConnect Reach</Link></li>
              <li><Link href="/pro" className="hover:text-white transition">MediConnect Pro</Link></li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h3 className="font-medium mb-4">For Hospitals</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/insta" className="hover:text-white transition">Insta by MediConnect</Link></li>
              <li><Link href="/qikwell" className="hover:text-white transition">Qikwell by MediConnect</Link></li>
              <li><Link href="/hospital-profile" className="hover:text-white transition">MediConnect Profile</Link></li>
              <li><Link href="/hospital-reach" className="hover:text-white transition">MediConnect Reach</Link></li>
              <li><Link href="/drive" className="hover:text-white transition">MediConnect Drive</Link></li>
            </ul>
          </div>
          
          {/* Column 5 */}
          <div>
            <h3 className="font-medium mb-4">More</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/help" className="hover:text-white transition">Help</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link href="/directory" className="hover:text-white transition">Healthcare Directory</Link></li>
              <li><Link href="/wiki" className="hover:text-white transition">MediConnect Health Wiki</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="font-bold text-xl">Medi<span className="text-[#6cc04a]">Connect</span></span>
              </Link>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">© {new Date().getFullYear()} MediConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
