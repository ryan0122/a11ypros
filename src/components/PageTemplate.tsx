interface PageProps {
  title: string;
  content: string;
}

export default function PageTemplate({ title, content }: PageProps) {
  return (
    <>
      <div className="page-container max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-semibold mb-6 text-center" dangerouslySetInnerHTML={{ __html: title }} />
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </>
  );
}