import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const cities = [
  { value: "bangalore", label: "Bangalore" },
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi" },
  { value: "chennai", label: "Chennai" },
  { value: "hyderabad", label: "Hyderabad" }
];

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("bangalore");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch search suggestions when user types
  const { data: suggestions } = useQuery({
    queryKey: ['/api/search/suggestions', searchQuery],
    enabled: searchQuery.length > 2 && showSuggestions,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log(`Searching for: ${searchQuery} in ${selectedCity}`);
    setShowSuggestions(false);
  };

  return (
    <section className="bg-white py-6 border-b border-[#e1e8ed]">
      <div className="container">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full border border-[#e1e8ed] rounded-l-md py-6 focus:ring-primary">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative w-full md:w-3/4">
            <Input
              type="text"
              placeholder="Search doctors, specialties, clinics"
              className="w-full border border-[#e1e8ed] rounded-r-md py-6 pr-12 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-md"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Search suggestions dropdown */}
            {showSuggestions && searchQuery.length > 2 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-md z-10 mt-1 border border-[#e1e8ed]">
                {!suggestions || suggestions.length === 0 ? (
                  <div className="p-4 text-[#666666]">Type to search doctors, specialties, and clinics</div>
                ) : (
                  <ul className="py-2">
                    {suggestions.map((suggestion: any, index: number) => (
                      <li key={index} className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchSection;
