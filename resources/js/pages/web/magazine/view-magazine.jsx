import FlipBook from "@/components/flip-book";
import { usePage } from "@inertiajs/react";

export default function ViewMagazine() {
    const { magazine } = usePage().props;

    return <FlipBook pdf_file={`/view-magazine/${magazine}`} />;
}
