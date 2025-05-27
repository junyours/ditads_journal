import FlipBook from "@/components/flip-book";
import { usePage } from "@inertiajs/react";

export default function ViewBook() {
    const { book } = usePage().props;

    return (
        <div className="h-screen">
            <FlipBook pdf_file={`/view-book/${book}`} />
        </div>
    );
} 
