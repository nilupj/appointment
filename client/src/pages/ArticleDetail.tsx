import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, ArrowLeft, Facebook, Twitter, Linkedin, Heart } from "lucide-react";
import { Link } from "wouter";

type Article = {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    title: string;
    imageSrc: string;
  };
  publishedDate: string;
  imageSrc: string;
  category: string;
  tags: string[];
};

type RelatedArticle = {
  id: number;
  title: string;
  excerpt: string;
  imageSrc: string;
  publishedDate: string;
};

const ArticleDetail = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  
  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${id}`],
  });
  
  const { data: relatedArticles } = useQuery<RelatedArticle[]>({
    queryKey: ['/api/articles/related', id],
  });

  if (isLoading) {
    return (
      <div className="bg-white py-8">
        <div className="container">
          <Button 
            variant="ghost" 
            className="mb-6 pl-0"
            onClick={() => navigate('/articles')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
          
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/6"></div>
              </div>
            </div>
            <div className="h-80 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4 mb-8">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-white py-8">
        <div className="container">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="text-[#666666] mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Button 
              className="primary-button"
              onClick={() => navigate('/articles')}
            >
              Go to Articles
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | MediConnect</title>
        <meta name="description" content={article.title} />
      </Helmet>
      
      <div className="bg-white py-8">
        <div className="container">
          <Button 
            variant="ghost" 
            className="mb-6 pl-0"
            onClick={() => navigate('/articles')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-6">{article.title}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={article.author.imageSrc} 
                  alt={article.author.name} 
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold">{article.author.name}</p>
                  <p className="text-sm text-[#666666]">{article.author.title}</p>
                </div>
                <div className="ml-auto flex items-center text-sm text-[#666666]">
                  <Calendar className="h-4 w-4 mr-1" />
                  {article.publishedDate}
                </div>
              </div>
              
              <img 
                src={article.imageSrc} 
                alt={article.title} 
                className="w-full h-auto rounded-lg mb-8"
                loading="lazy"
              />
              
              <div className="prose max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
              
              <div className="flex items-center justify-between py-4 border-t border-b border-[#e1e8ed] mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#666666]">Share this article:</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>Save</span>
                </Button>
              </div>
              
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Link key={index} href={`/articles/tag/${tag}`} className="px-3 py-1 bg-blue-50 text-primary rounded-full text-sm hover:bg-blue-100 transition">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Card className="mb-12">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src={article.author.imageSrc} 
                      alt={article.author.name} 
                      className="w-16 h-16 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div>
                      <h3 className="font-bold mb-1">About the Author</h3>
                      <p className="font-semibold">{article.author.name}</p>
                      <p className="text-sm text-[#666666] mb-2">{article.author.title}</p>
                      <p className="text-sm">Dr. Smith is a renowned specialist with over 15 years of experience in internal medicine. He is passionate about preventive healthcare and patient education.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {relatedArticles && relatedArticles.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map((related) => (
                    <Card key={related.id} className="hover:shadow-md transition">
                      <CardContent className="p-0">
                        <img 
                          src={related.imageSrc} 
                          alt={related.title} 
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                        <div className="p-6">
                          <h3 className="font-semibold text-lg mb-2">{related.title}</h3>
                          <p className="text-sm text-[#666666] mb-4">{related.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#666666] flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {related.publishedDate}
                            </span>
                            <Link href={`/articles/${related.id}`} className="text-primary text-sm font-medium">
                              Read More
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetail;
