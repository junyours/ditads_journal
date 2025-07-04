import WebLayout from "@/layouts/web-layout";
import BookPublicationBanner from "../../../../../public/images/book-publication-banner.png";
import { Link, router, usePage } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BookOpenText, Calendar, FileText, MoveRight } from "lucide-react";
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
import PDF from "../../../../../public/images/pdf.png";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const banners = [BookPublicationBanner];

export default function BookPublication() {
    const user = usePage().props.auth.user;
    const [open, setOpen] = useState(false);
    const { books, covers, search: initialSearch } = usePage().props;
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(false);
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState(initialSearch || "");

    const handleOpen = (book = null) => {
        if (book) {
            setBook(book);
        } else {
            setBook(null);
        }
        setOpen(!open);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/book-publication",
            { search },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <>
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
                        {covers.map((cover, index) => (
                            <CarouselItem
                                key={index}
                                className="sm:basis-1/2 lg:basis-1/3"
                            >
                                <div className="h-[200px]">
                                    <img
                                        src={cover.cover_page}
                                        alt={`cover_page-${index}`}
                                        className="object-contain size-full"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                <form
                    onSubmit={handleSearch}
                    className="flex items-center justify-end gap-2 px-4"
                >
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search for isbn, title, authors..."
                        className="sm:max-w-72"
                    />
                    <Button type="submit">Search</Button>
                </form>

                <div className="container mx-auto px-4 pb-4">
                    {books.data.length > 0 ? (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {books.data.map((book, index) => (
                                <Card
                                    key={index}
                                    className="flex flex-col shadow-none"
                                >
                                    <CardHeader className="p-4">
                                        <div className="flex gap-2 items-center text-primary">
                                            <Calendar size={16} />
                                            <span className="text-xs">
                                                {formatDate(book.published_at)}
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
                                            Soft/Hard Bound ISBN:{" "}
                                            {book.soft_isbn} / {book.hard_isbn}
                                        </span>
                                        <span className="text-xs">
                                            DOI:{" "}
                                            <a
                                                href={book.doi}
                                                target="_blank"
                                                className="hover:underline"
                                            >
                                                {book.doi}
                                            </a>
                                        </span>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-4 px-4">
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
                                        {/* <a
                                    href={`/view-book/${book.overview_pdf_file}`}
                                    target="_blank"
                                >
                                    <Button size="sm" variant="ghost">
                                        PDF open access
                                        <img src={PDF} className="size-4" />
                                    </Button>
                                </a> */}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground italic">
                            {initialSearch
                                ? `No books found for "${initialSearch}".`
                                : "No books available."}
                        </div>
                    )}
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
                                    {formatDate(book?.published_at)}
                                </span>
                            </div>
                            <SheetTitle>{book?.title}</SheetTitle>
                            <SheetDescription className="italic">
                                {book?.author}
                            </SheetDescription>
                            <span>
                                Soft/Hard Bound ISBN: {book?.soft_isbn} /{" "}
                                {book?.hard_isbn}
                            </span>
                            <span>
                                DOI:{" "}
                                <a
                                    href={book?.doi}
                                    target="_blank"
                                    className="hover:underline"
                                >
                                    {book?.doi}
                                </a>
                            </span>
                        </SheetHeader>
                        <div className="space-y-4">
                            <p className="text-justify whitespace-pre-line mt-4">
                                {book?.overview}
                            </p>
                            <div
                                onClick={() => {
                                    if (!loading) {
                                        if (user?.role === "admin") {
                                            setIsOpen(true);
                                        } else if (user?.role === "customer") {
                                            setIsOpen(true);
                                        }
                                    }
                                }}
                                className={`relative size-fit ${
                                    (user?.role === "customer" &&
                                        book?.has_access) ||
                                    (user?.role === "admin" && !loading)
                                        ? "hover-book-flip cursor-pointer"
                                        : ""
                                }`}
                            >
                                <div
                                    className={
                                        !user ||
                                        (user?.role === "customer" &&
                                            !book?.has_access)
                                            ? "bg-black opacity-35"
                                            : "bg-transparent"
                                    }
                                >
                                    <img
                                        src={book?.cover_page}
                                        alt={`cover_${book?.title}`}
                                        className="object-contain size-48"
                                    />
                                    <div className="w-48 border">
                                        <div className="h-2 w-full bg-primary"></div>
                                        <div className="flex items-center bg-muted p-2">
                                            <p className="text-xs">
                                                {book?.title}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {loading && <ClipLoader color="green" />}
                                    {!user && (
                                        <Button
                                            onClick={() =>
                                                router.visit("/sign-in")
                                            }
                                            size="sm"
                                            variant="outline"
                                        >
                                            Sign in
                                        </Button>
                                    )}
                                    {user?.role === "customer" &&
                                        !book?.has_access && (
                                            <Button size="sm">Buy now</Button>
                                        )}
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Open book as?</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={async () => {
                                setIsOpen(false);
                                if (user?.role === "admin") {
                                    if (!loading) {
                                        setLoading(true);
                                        const res = await axios.get(
                                            "/api/book-hash",
                                            {
                                                params: {
                                                    soft_isbn: book.soft_isbn,
                                                    hard_isbn: book.hard_isbn,
                                                },
                                            }
                                        );

                                        const hash = res.data.hash;
                                        window.open(
                                            `/flip-book/${hash}`,
                                            "_blank"
                                        );
                                        setLoading(false);
                                    }
                                } else if (user?.role === "author") {
                                    if (book.has_access) {
                                        if (!loading) {
                                            setLoading(true);
                                            const res = await axios.get(
                                                "/api/book-hash",
                                                {
                                                    params: {
                                                        soft_isbn:
                                                            book.soft_isbn,
                                                        hard_isbn:
                                                            book.hard_isbn,
                                                    },
                                                }
                                            );

                                            const hash = res.data.hash;
                                            window.open(
                                                `/flip-book/${hash}`,
                                                "_blank"
                                            );
                                            setLoading(false);
                                        }
                                    }
                                }
                            }}
                            className="flex flex-col items-center border rounded-lg gap-2 p-4 hover:border-primary transition-all cursor-pointer"
                        >
                            <BookOpenText size={40} color="blue" />
                            <h1 className="font-semibold">Flip book</h1>
                        </div>
                        <div
                            onClick={async () => {
                                setIsOpen(false);
                                if (user?.role === "admin") {
                                    if (!loading) {
                                        setLoading(true);
                                        window.open(
                                            `/view-book/${book.pdf_file}`,
                                            "_blank"
                                        );
                                        setLoading(false);
                                    }
                                } else if (user?.role === "author") {
                                    if (book.has_access) {
                                        if (!loading) {
                                            setLoading(true);
                                            window.open(
                                                `/view-book/${book.pdf_file}`,
                                                "_blank"
                                            );
                                            setLoading(false);
                                        }
                                    }
                                }
                            }}
                            className="flex flex-col items-center border rounded-lg gap-2 p-4 hover:border-primary transition-all cursor-pointer"
                        >
                            <FileText size={40} color="red" />
                            <h1 className="font-semibold">PDF file</h1>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

BookPublication.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
