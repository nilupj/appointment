import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

type Article = {
  id: number;
  title: string;
  author: string;
  imageSrc: string;
  alt: string;
};

const ArticlesSection = () => {
  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  if (isLoading) {
    return (
      <section className="py-10 bg-white">
        <div className="container">
          <h2 className="font-bold text-2xl mb-4">Read top articles from health experts</h2>
          <p className="text-[#666666] mb-8">Health articles that keep you informed about good health practices and achieve your goals.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-1 flex flex-col justify-center">
              <p className="text-lg font-medium mb-4">Daily health tips to help you stay healthy</p>
              <div className="h-10 w-32 bg-primary rounded-md animate-pulse"></div>
            </div>
            
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border border-[#e1e8ed] rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 p-4">
                    <div className="h-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/3 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-blue-100 rounded w-1/4 animate-pulse"></div>
                  </div>
                  <div className="md:w-1/2">
                    <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  return (
    <section className="py-10 bg-white">
      <div className="container">
        <h2 className="font-bold text-2xl mb-4">Read top articles from health experts</h2>
        <p className="text-[#666666] mb-8">Health articles that keep you informed about good health practices and achieve your goals.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-1 flex flex-col justify-center">
            <p className="text-lg font-medium mb-4">Daily health tips to help you stay healthy</p>
            <Button className="primary-button px-6 py-3 w-fit">
              See all articles
            </Button>
          </div>
          
          {articles?.slice(0, 2).map((article) => (
            <div 
              key={article.id} 
              className="border border-[#e1e8ed] rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-4">
                  <h3 className="font-medium text-base mb-2">{article.title}</h3>
                  <p className="text-sm text-[#666666] mb-3">{article.author}</p>
                  <Link href={`/articles/${article.id}`} className="text-primary text-sm font-medium flex items-center">
                    <span>READ MORE</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                <div className="md:w-1/2">
                  <img 
                    src={article.imageSrc} 
                    alt={article.alt} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
