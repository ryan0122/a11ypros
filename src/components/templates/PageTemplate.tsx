import Image from 'next/image';
import Services from '@/components/features/Services';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

interface PageProps {
  title: string;
  content: string;
  slug: string;
  featuredImage?: {
    source_url: string;
    alt_text: string;
    caption?: string;
  };
}

export default function PageTemplate({ title, content, featuredImage, slug }: PageProps) {
  return (
    <>
      <div className='max-w-6xl mx-auto'>
        <Breadcrumbs/>
      </div>  
      <main id="main-content" tabIndex={-1}>
        <div className="page-container max-w-6xl mx-auto p-8 font-[family-name:var(--font-inter)]">
        
          {/* Hero Section - 2 Column Layout */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center mt-10 mb-20">
            <div className="flex-1">
              <h1 className="text-6xl font-semibold mb-6 text-left" dangerouslySetInnerHTML={{ __html: title }} />
            </div>
            {featuredImage && (
              <div className="flex-1 flex justify-center lg:justify-end">
                <Image 
                  src={featuredImage.source_url} 
                  alt={featuredImage.alt_text || ''} 
                  width={600} 
                  height={450} 
                  className="rounded-lg w-full max-w-lg h-auto"
                  priority
                />
              </div>
            )}
          </div>
          
          <div dangerouslySetInnerHTML={{ __html: content }} />
         
        </div>
        {/* show services on overview page */}
        {slug === 'services' && <Services showHeading={false}/>}
       </main>
    </>
  );
}