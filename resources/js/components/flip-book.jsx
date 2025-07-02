import { useIsMobile } from "@/hooks/use-mobile";
import React, { useMemo, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import { HashLoader } from "react-spinners";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Pages = React.memo(
    React.forwardRef(({ children }, ref) => <div ref={ref}>{children}</div>)
);

export default function FlipBook({ pdf_file }) {
    const [numPages, setNumPages] = useState(null);
    const isMobile = useIsMobile();

    const memoizedFile = useMemo(() => ({ url: pdf_file }), [pdf_file]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="bg-gray-900 min-h-screen flex p-4">
            <Document
                file={memoizedFile}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div className="flex flex-col items-center gap-4">
                        <HashLoader color="green" />
                        <p className="text-white">
                            Loading book, please wait...
                        </p>
                    </div>
                }
                error={<p className="text-white">Failed to load book.</p>}
                className="flex-1 flex justify-center items-center"
            >
                {numPages && (
                    <HTMLFlipBook
                        width={isMobile ? 350 : 500}
                        height={isMobile ? 493 : 708}
                        showCover={true}
                    >
                        {[...Array(numPages).keys()].map((n) => (
                            <Pages key={n}>
                                <Page
                                    pageNumber={n + 1}
                                    width={isMobile ? 350 : 500}
                                    height={isMobile ? 493 : 708}
                                    renderAnnotationLayer={false}
                                    renderTextLayer={false}
                                />
                            </Pages>
                        ))}
                    </HTMLFlipBook>
                )}
            </Document>
        </div>
    );
}
