import { Button } from "@/components/ui/button";
import CustomerLayout from "@/layouts/customer-layout";
import { usePage } from "@inertiajs/react";
import { Heart, Minus, Plus } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

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

    return (
        <div className="space-y-8">
            <div className="flex gap-4">
                <div className="bg-muted border max-h-60 max-w-60">
                    <img
                        src={`https://lh3.googleusercontent.com/d/${book.cover_file_id}`}
                        alt="cover_page"
                        className="object-contain size-full"
                    />
                </div>
                <div className="flex-1 flex flex-col gap-4 justify-between">
                    <div className="space-y-4">
                        <h1 className="font-semibold text-2xl">{book.title}</h1>
                        <div className="space-y-2">
                            <p>
                                Author/s:{" "}
                                <span className="font-medium">
                                    {book.author}
                                </span>
                            </p>
                            <p>
                                Price:{" "}
                                <span className="font-medium">
                                    {formatCurrency(book.hard_price)}
                                </span>
                            </p>
                            <div className="flex items-center gap-1">
                                <span>Quantity:</span>
                                <div className="flex">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="rounded-r-none"
                                    >
                                        <Minus />
                                    </Button>
                                    <div className="min-w-10 px-2 border flex justify-center items-center">
                                        <span>1</span>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="rounded-l-none"
                                    >
                                        <Plus />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                            className="min-w-52"
                        >
                            Add to Cart
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                            size="icon"
                            variant="ghost"
                            className="shrink-0"
                        >
                            <Heart />
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
