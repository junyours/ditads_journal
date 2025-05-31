import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Pages = React.forwardRef((props, ref) => {
    return (
        <div ref={ref}>
            <p>{props.children}</p>
        </div>
    );
});

export default function FlipBook({ pdf_file }) {
    const [numPages, setNumPages] = useState(null);
    const isMobile = useIsMobile();

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="bg-gray-900 h-screen flex justify-end items-center md:justify-center overflow-hidden">
            <HTMLFlipBook
                width={isMobile ? 350 : 500}
                height={isMobile ? 493 : 708}
                showCover={true}
            >
                {[...Array(numPages).keys()].map((n) => (
                    <Pages number={`${n + 1}`}>
                        <Document
                            file={{ url: pdf_file }}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <p className="text-white">
                                    Loading please wait...
                                </p>
                            }
                            error={
                                <p className="text-white">
                                    Failed to load book.
                                </p>
                            }
                        >
                            <Page
                                pageNumber={n + 1}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                width={isMobile ? 350 : 500}
                                height={isMobile ? 493 : 708}
                                scale={1}
                            />
                        </Document>
                    </Pages>
                ))}
            </HTMLFlipBook>
        </div>
    );
}
