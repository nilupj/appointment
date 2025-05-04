import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [location] = useLocation();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isLinkActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="logo-text text-2xl">
                <span className="primary-text">Medi</span>
                <span className="secondary-text">Connect</span>
              </span>
            </Link>
            
            {!isMobile && (
              <nav className="ml-10">
                <ul className="flex space-x-8">
                  <li>
                    <Link 
                      href="/find-doctors" 
                      className={`font-medium ${isLinkActive("/find-doctors") ? "text-primary" : "text-[#666666] hover:text-primary"} transition`}
                    >
                      Find Doctors
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/video-consult" 
                      className={`font-medium ${isLinkActive("/video-consult") ? "text-primary" : "text-[#666666] hover:text-primary"} transition`}
                    >
                      Video Consult
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/surgeries" 
                      className={`font-medium ${isLinkActive("/surgeries") ? "text-primary" : "text-[#666666] hover:text-primary"} transition`}
                    >
                      Surgeries
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/medicines" 
                      className={`font-medium ${isLinkActive("/medicines") ? "text-primary" : "text-[#666666] hover:text-primary"} transition`}
                    >
                      Medicines
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/lab-tests" 
                      className={`font-medium ${isLinkActive("/lab-tests") ? "text-primary" : "text-[#666666] hover:text-primary"} transition`}
                    >
                      Lab Tests
                    </Link>
                  </li>
                </ul>
              </nav>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {!isMobile && (
              <>
                <Link href="/for-corporates" className="text-sm font-medium text-[#666666] hover:text-primary">
                  For Corporates
                </Link>
                <Link href="/for-providers" className="text-sm font-medium text-[#666666] hover:text-primary">
                  For Providers
                </Link>
                <Link href="/help" className="text-sm font-medium text-[#666666] hover:text-primary">
                  Security & Help
                </Link>
              </>
            )}
            
            <Button className="primary-button">Login / Signup</Button>
            
            {isMobile && (
              <button 
                className="text-primary"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="py-4 border-t border-gray-200">
            <nav>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/find-doctors" 
                    className={`block font-medium ${isLinkActive("/find-doctors") ? "text-primary" : "text-[#666666]"} transition`}
                    onClick={closeMenu}
                  >
                    Find Doctors
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/video-consult" 
                    className={`block font-medium ${isLinkActive("/video-consult") ? "text-primary" : "text-[#666666]"} transition`}
                    onClick={closeMenu}
                  >
                    Video Consult
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/surgeries" 
                    className={`block font-medium ${isLinkActive("/surgeries") ? "text-primary" : "text-[#666666]"} transition`}
                    onClick={closeMenu}
                  >
                    Surgeries
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/medicines" 
                    className={`block font-medium ${isLinkActive("/medicines") ? "text-primary" : "text-[#666666]"} transition`}
                    onClick={closeMenu}
                  >
                    Medicines
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/lab-tests" 
                    className={`block font-medium ${isLinkActive("/lab-tests") ? "text-primary" : "text-[#666666]"} transition`}
                    onClick={closeMenu}
                  >
                    Lab Tests
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/for-corporates" 
                    className="block text-sm font-medium text-[#666666]"
                    onClick={closeMenu}
                  >
                    For Corporates
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/for-providers" 
                    className="block text-sm font-medium text-[#666666]"
                    onClick={closeMenu}
                  >
                    For Providers
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/help" 
                    className="block text-sm font-medium text-[#666666]"
                    onClick={closeMenu}
                  >
                    Security & Help
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
