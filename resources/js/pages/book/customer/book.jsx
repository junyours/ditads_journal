import { Button } from "@/components/ui/button";
import CustomerLayout from "@/layouts/customer-layout";
import { Link, usePage } from "@inertiajs/react";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function Book() {
    const { books } = usePage().props;
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(parseFloat(amount));

    return (
        <div className="flex">
            <div className="w-full max-w-80 bg-red-500"></div>
            <div className="flex-1 pl-4 space-y-4">
                {books.map((book) => (
                    <Link
                        key={book.id}
                        href={`/book/${book.title}/${book.author}/${book.cover_file_id}`}
                        className="flex gap-2"
                    >
                        <div className="bg-muted border max-h-60 max-w-60">
                            <img
                                src={`https://lh3.googleusercontent.com/d/${book.cover_file_id}`}
                                alt="cover_page"
                                className="object-contain size-full"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-2 justify-between">
                            <div className="space-y-4">
                                <h1 className="font-semibold line-clamp-2">
                                    {book.title}
                                </h1>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground italic line-clamp-2">
                                        {book.author}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {formatCurrency(book.hard_price)}
                                    </p>
                                    <p className="text-sm line-clamp-4">
                                        {book.overview}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                    variant="outline"
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
                    </Link>
                ))}
            </div>
        </div>
    );
}

Book.layout = (page) => <CustomerLayout children={page} />;
