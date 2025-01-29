interface PageProps {
  title: string;
  content: string;
}

export default function PageTemplate({ title, content }: PageProps) {
  return (
    <>
      <div className="page-container">
        <h1 dangerouslySetInnerHTML={{ __html: title }} />
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </>
  );
}