import React, { useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import { HashLoader } from "react-spinners";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Pages = React.forwardRef((props, ref) => {
    return (
        <div className="demoPage" ref={ref}>
            <p>{props.children}</p>
        </div>
    );
});

export default function FlipBook({ pdf_file }) {
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="bg-gray-900 h-screen flex flex-col justify-end items-center md:justify-center scroll-mx-2 overflow-hidden">
            <HTMLFlipBook width={500} height={700} showCover={true}>
                {[...Array(numPages).keys()].map((n) => (
                    <Pages number={`${n + 1}`}>
                        <Document
                            file={{ url: pdf_file }}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={<HashLoader color="green" />}
                            error={
                                <div className="text-white">
                                    Failed to load PDF.
                                </div>
                            }
                        >
                            <Page
                                loading={<p>Please wait...</p>}
                                pageNumber={n + 1}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                width={500}
                                scale={1}
                            />
                        </Document>
                    </Pages>
                ))}
            </HTMLFlipBook>
        </div>
    );
}
