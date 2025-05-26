import React, { useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FlipPage = React.forwardRef(({ number }, ref) => {
    return (
        <div className="demoPage p-4 bg-white" ref={ref}>
            <Page pageNumber={number} width={300} />
        </div>
    );
});

FlipPage.displayName = "FlipPage";

export default function FlipBook({ pdf_file }) {
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="flex justify-center my-6">
            <Document
                file={{ url: pdf_file }}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div>Loading PDF...</div>}
                error={<div>Failed to load PDF.</div>}
            >
                {numPages && (
                    <HTMLFlipBook width={300} height={500}>
                        {[...Array(numPages).keys()].map((_, index) => (
                            <FlipPage key={index} number={index + 1} />
                        ))}
                    </HTMLFlipBook>
                )}
            </Document>
        </div>
    );
}
