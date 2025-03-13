import Image from 'next/image';
import Services from './Services';
import ContactForm from './ContactForm';

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
      <div className="page-container max-w-6xl mx-auto p-8 font-[family-name:var(--font-inter)]">
      
        <h1 className="text-4xl font-semibold mb-6 text-center" dangerouslySetInnerHTML={{ __html: title }} />
        {featuredImage && (
          <div className="my-10 mx-auto flex justify-center">
            <Image 
              src={featuredImage.source_url} 
              alt={featuredImage.alt_text || ''} 
              width={600} 
              height={450} 
              className="rounded-lg w-1/2 h-auto"
              priority
            />
          </div>
         )}
        <div dangerouslySetInnerHTML={{ __html: content }} />
       
      </div>
      {/* show services on overview page */}
      {slug === 'services' && <Services showHeading={false}/>}
      {/* show contact form */}
      {slug === 'contact-us' &&  <ContactForm isMainContactForm/>}
    </>
  );
}