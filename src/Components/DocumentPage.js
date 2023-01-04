import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Document, Page } from "react-pdf";
import { Viewer } from "@react-pdf-viewer/core";
const DocumentPage = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [activeLabel, setActiveLabel] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [selection, setSelection] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // Fetch the PDF document from the backend API
    const fetchDocument = async () => {
      let url;
      switch (id) {
        case "1":
          url = "https://arxiv.org/pdf/2212.08011.pdf";
          break;
        case "2":
          url = "https://arxiv.org/pdf/2212.07937.pdf";
          break;
        case "3":
          url = "https://arxiv.org/pdf/2212.07931.pdf";
          break;
        default:
          throw new Error(`Invalid document ID: ${id}`);
      }

      const response = await fetch(url);
      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    };
    fetchDocument();
  }, [id]);

  // Load the saved annotations from local storage
  const savedAnnotations = JSON.parse(
    localStorage.getItem(`annotations-${id}`)
  );
  setAnnotations(savedAnnotations || []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleLabelClick = (label) => {
    setActiveLabel(label);
  };

  const handleAnnotationSave = (page, annotation) => {
    const newAnnotations = [
      ...annotations,
      { page, annotation, label: activeLabel },
    ];
    setAnnotations(newAnnotations);
    localStorage.setItem(`annotations-${id}`, JSON.stringify(newAnnotations));
  };

  const handlePageRender = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  const handleMouseDown = (event) => {
    // Start creating a new annotation
    setSelection({
      startX: event.clientX,
      startY: event.clientY,
      pageNumber,
    });
  };

  const handleMouseMove = (event) => {
    if (selection) {
      // Update the current selection
      setSelection({
        ...selection,
        endX: event.clientX,
        endY: event.clientY,
      });
    }
  };

  const handleMouseUp = (event) => {
    if (selection) {
      // Save the new annotation
      const annotation = {
        x: Math.min(selection.startX, selection.endX),
        y: Math.min(selection.startY, selection.endY),
        width: Math.abs(selection.startX - selection.endX),
        height: Math.abs(selection.startY - selection.endY),
      };
      handleAnnotationSave(pageNumber, annotation);

      // Clear the current selection
      setSelection(null);
    }
  };

  const handleClearAnnotations = () => {
    setAnnotations([]);
  };

  return (
    <>
      <>
        <Viewer width="100%" height="800px" src={pdfUrl} />
      </>
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          renderAnnotationLayer={false}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              onRenderSuccess={handlePageRender}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
        <div>
          {annotations
            .filter((a) => a.page === pageNumber)
            .map((a, index) => (
              <div
                key={`annotation_${index}`}
                style={{
                  position: "absolute",
                  left: a.annotation.x,
                  top: a.annotation.y,
                  width: a.annotation.width,
                  height: a.annotation.height,
                  border: "2px solid green",
                }}
              >
                {a.label}
              </div>
            ))}
          {selection && (
            <div
              style={{
                position: "absolute",
                left: Math.min(selection.startX, selection.endX),
                top: Math.min(selection.startY, selection.endY),
                width: Math.abs(selection.startX - selection.endX),
                height: Math.abs(selection.startY - selection.endY),
                border: "2px dashed red",
              }}
            />
          )}
        </div>
        <div>
          <button type="button" onClick={() => handleLabelClick("Title")}>
            Title
          </button>
          <button type="button" onClick={() => handleLabelClick("Author")}>
            Author
          </button>
        </div>
        <div>
          {annotations
            .filter((a) => a.page === pageNumber)
            .map((a, index) => (
              <div key={`box_${index}`}>
                Page {a.page}: {a.label} at ({a.annotation.x}, {a.annotation.y})
              </div>
            ))}
        </div>

        <div>
          <button type="button" onClick={handleClearAnnotations}>
            Clear Annotations
          </button>
        </div>
      </div>
    </>
  );
};
export default DocumentPage;
