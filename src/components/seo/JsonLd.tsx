type JsonLdProps = {
  data: object | object[];
};

// Renders schema.org nodes as one @graph. `<` is escaped so content from the
// database can never close the script tag.
export function JsonLd({ data }: JsonLdProps) {
  const graph = { "@context": "https://schema.org", "@graph": Array.isArray(data) ? data : [data] };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
