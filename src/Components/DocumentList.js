import React from "react";
import { Link } from "react-router-dom";

const DocumentList = () => {
  const documents = [
    {
      id: "2212.08011",
      title: "Sample Document 1",
      url: "https://arxiv.org/pdf/2212.08011.pdf",
    },
    {
      id: "2212.07937",
      title: "Sample Document 2",
      url: "https://arxiv.org/pdf/2212.07937.pdf",
    },
    {
      id: "2212.07931",
      title: "Sample Document 3",
      url: "https://arxiv.org/pdf/2212.07931.pdf",
    },
  ];

  return (
    <ul>
      {documents.map((doc) => (
        <li key={doc.id}>
          <Link to={`/document/${doc.id}`}>{doc.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export default DocumentList;
