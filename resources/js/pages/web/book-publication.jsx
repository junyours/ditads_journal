import WebLayout from "@/layouts/web-layout";
import BookPublicationBanner from "../../../../public/images/book-publication-banner.png";
import { usePage } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Calendar, MoveRight } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";

const banners = [BookPublicationBanner];

export default function BookPublication() {
    const [open, setOpen] = useState(false);
    const { books } = usePage().props;
    const [book, setBook] = useState(null);
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const handleOpen = (book = null) => {
        if (book) {
            setBook(book);
        } else {
            setBook(null);
        }
        setOpen(!open);
    };

    return (
        <div className="space-y-4 mt-4">
            <Carousel
                opts={{ loop: true }}
                plugins={[
                    AutoScroll({
                        stopOnInteraction: false,
                        speed: 2,
                    }),
                ]}
            >
                <CarouselContent>
                    {books.map((book, index) => (
                        <CarouselItem
                            key={`${book.isbn}-${index}`}
                            className="sm:basis-1/2 lg:basis-1/3"
                        >
                            <div className="h-[200px]">
                                <img
                                    src={book.cover_page}
                                    alt="cover_page"
                                    className="object-contain size-full"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <div className="container mx-auto px-4 pb-4">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {books.map((book) => (
                        <Card key={book.isbn} className="shadow-none">
                            <CardHeader className="p-4">
                                <div className="flex gap-2 items-center text-primary">
                                    <Calendar size={16} />
                                    <span className="text-xs">
                                        {formatDate(book.created_at)}
                                    </span>
                                </div>
                                <div className="h-[200px] w-full">
                                    <img
                                        src={book.cover_page}
                                        alt="cover_page"
                                        className="object-contain size-full"
                                    />
                                </div>
                                <span className="text-xs">
                                    ISBN: {book.isbn}
                                </span>
                            </CardHeader>
                            <CardContent className="space-y-4 px-4">
                                <CardTitle className="break-words line-clamp-3">
                                    {book.title}
                                </CardTitle>
                                <CardDescription className="italic text-xs break-words line-clamp-2">
                                    {book.author}
                                </CardDescription>
                            </CardContent>
                            <CardFooter className="px-4 pb-4">
                                <Button
                                    onClick={() => handleOpen(book)}
                                    variant="ghost"
                                    size="sm"
                                >
                                    Read more
                                    <MoveRight />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            <Sheet open={open} onOpenChange={() => handleOpen()}>
                <SheetContent
                    side="bottom"
                    className="h-full overflow-y-auto text-sm"
                >
                    <SheetHeader>
                        <div className="flex gap-2 items-center text-primary">
                            <Calendar size={16} />
                            <span className="text-xs">
                                {formatDate(book?.created_at)}
                            </span>
                        </div>
                        <SheetTitle>{book?.title}</SheetTitle>
                        <SheetDescription className="italic">
                            {book?.author}
                        </SheetDescription>
                        <span>ISBN: {book?.isbn}</span>
                    </SheetHeader>
                    <p className="text-justify mt-4">{book?.overview}</p>
                </SheetContent>
            </Sheet>
        </div>
    );
}

BookPublication.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
