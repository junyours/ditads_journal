import { Button } from "@/components/ui/button";
import CustomerLayout from "@/layouts/customer-layout";
import { router, usePage } from "@inertiajs/react";
import { Heart, Minus, Plus } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

export default function BookDetail() {
    const { book } = usePage().props;
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(parseFloat(amount));
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    const [loading, setLoading] = useState(null);

    const handleAddCart = () => {
        setLoading(true);
        router.post(
            "/cart/add",
            { bookId: book.id },
            {
                preserveScroll: true,
                onFinish: () => {
                    setLoading(false);
                },
            }
        );
    };

    return (
        <div className="space-y-8 p-4">
            <div className="flex gap-4 bg-background rounded-lg border p-4">
                <div className="max-h-60 max-w-60">
                    <img
                        src={`https://lh3.googleusercontent.com/d/${book.cover_file_id}`}
                        alt="cover_page"
                        className="object-contain size-full"
                    />
                </div>
                <div className="flex-1 flex flex-col gap-4 justify-between">
                    <div className="space-y-4">
                        <h1 className="font-semibold text-lg">{book.title}</h1>
                        <div className="space-y-2 text-sm font-medium">
                            <p>
                                Author/s: <span>{book.author}</span>
                            </p>
                            <p>
                                Price:{" "}
                                <span>{formatCurrency(book.hard_price)}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                handleAddCart();
                            }}
                            className="min-w-52"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add to Cart"}
                        </Button>
                    </div>
                </div>
            </div>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Overview</AccordionTrigger>
                    <AccordionContent>
                        <p>{book.overview}</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Additional Information</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-1">
                            <div className="flex gap-1">
                                <p>ISBN:</p>
                                <div>
                                    <p>
                                        Hard ISBN:{" "}
                                        <span className="font-medium">
                                            {book.hard_isbn}
                                        </span>
                                    </p>
                                    <p>
                                        Soft ISBN:{" "}
                                        <span className="font-medium">
                                            {book.soft_isbn}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <p>
                                Published Date: {formatDate(book.published_at)}
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

BookDetail.layout = (page) => <CustomerLayout children={page} />;
