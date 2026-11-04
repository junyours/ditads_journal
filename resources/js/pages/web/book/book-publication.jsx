
import WebLayout from "@/layouts/web-layout";
import BookPublicationBanner from "../../../../../public/images/book-publication-banner.png";
import PDF from "../../../../../public/images/pdf.png";

import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AutoScroll from "embla-carousel-auto-scroll";
import { ClipLoader } from "react-spinners";
import {
    ArrowRight,
    BookOpen,
    BookOpenText,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    FileText,
    LockKeyhole,
    Search,
    ShieldCheck,
    X,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const banners = [BookPublicationBanner];

const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const getBookImage = (book) => {
    if (book?.cover_file_id) {
        return `https://lh3.googleusercontent.com/d/${book.cover_file_id}`;
    }

    return book?.cover_page || null;
};

const isBookOpenAccess = (book) => {
    return (
        book?.open_access === 1 ||
        book?.open_access === true ||
        book?.open_access === "1"
    );
};

const getLabel = (label) => {
    return String(label)
        .replace(/&laquo;/g, "«")
        .replace(/&raquo;/g, "»")
        .replace(/&amp;/g, "&")
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, '"');
};

function BookCover({ book, className = "" }) {
    const [imageError, setImageError] = useState(false);
    const image = getBookImage(book);

    return (
        <div
            className={`relative flex items-center justify-center overflow-hidden bg-muted ${className}`}
        >
            {image && !imageError ? (
                <img
                    src={image}
                    alt={book?.title || "Book cover"}
                    loading="lazy"
                    onError={() => setImageError(true)}
                    className="size-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <BookOpen className="size-12 opacity-30" />
                    <span className="text-xs">Cover unavailable</span>
                </div>
            )}
        </div>
    );
}

export default function BookPublication() {
    const {
        auth,
        books,
        covers = [],
        search: initialSearch,
    } = usePage().props;

    const user = auth?.user;
    const bookList = books?.data || [];

    const [search, setSearch] = useState(initialSearch || "");
    const [selectedBook, setSelectedBook] = useState(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [formatDialogOpen, setFormatDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const autoScrollPlugin = useMemo(
        () =>
            AutoScroll({
                stopOnInteraction: false,
                stopOnMouseEnter: true,
                speed: 1.5,
            }),
        []
    );

    useEffect(() => {
        setSearch(initialSearch || "");
    }, [initialSearch]);

    const isOpenAccess = isBookOpenAccess(selectedBook);

    const hasBookAccess =
        isOpenAccess ||
        user?.role === "admin" ||
        ((user?.role === "customer" || user?.role === "author") &&
            selectedBook?.has_access === true) ||
        ((user?.role === "customer" || user?.role === "author") &&
            selectedBook?.has_access === 1);

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            "/book-publication",
            { search: search.trim() },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const clearSearch = () => {
        setSearch("");

        router.get(
            "/book-publication",
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handleOpenBook = (book) => {
        setSelectedBook(book);
        setSheetOpen(true);
    };

    const handleCloseSheet = (value) => {
        setSheetOpen(value);

        if (!value) {
            setSelectedBook(null);
            setFormatDialogOpen(false);
        }
    };

    const handleReadBook = () => {
        if (!selectedBook || loading) return;

        if (!hasBookAccess) {
            if (!user) {
                router.visit("/sign-in");
            } else if (user.role === "customer") {
                router.visit(
                    `/customer/book/sales/buy/${selectedBook.id}`
                );
            }

            return;
        }

        setFormatDialogOpen(true);
    };

    const handleOpenFormat = async (formatType) => {
        if (!selectedBook || loading || !hasBookAccess) return;

        if (formatType === "pdf") {
            if (!selectedBook.pdf_file) return;

            window.open(
                `/view-book/${encodeURIComponent(selectedBook.pdf_file)}`,
                "_blank",
                "noopener,noreferrer"
            );

            setFormatDialogOpen(false);
            return;
        }

        if (!selectedBook.soft_isbn && !selectedBook.hard_isbn) {
            return;
        }

        const newWindow = window.open("about:blank", "_blank");

        if (!newWindow) {
            return;
        }

        newWindow.opener = null;

        setLoading(true);

        try {
            const response = await axios.get("/api/book-hash", {
                params: {
                    soft_isbn: selectedBook.soft_isbn,
                    hard_isbn: selectedBook.hard_isbn,
                },
            });

            if (!response.data?.hash) {
                throw new Error("Unable to generate book access.");
            }

            newWindow.location.href = `/flip-book/${encodeURIComponent(
                response.data.hash
            )}`;

            setFormatDialogOpen(false);
        } catch (error) {
            newWindow.close();

            console.error("Unable to open book:", error);

            const message =
                error.response?.data?.message ||
                "Unable to open the book. Please try again.";

            window.alert(message);
        } finally {
            setLoading(false);
        }
    };

    const handlePagination = (url) => {
        if (!url) return;

        router.visit(url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <Head title="Book Publications">
                <meta
                    name="description"
                    content="Explore DIT.ADS book publications, academic resources, research materials, and digital books."
                />
            </Head>

            <section className="space-y-10 pb-12">
                {/* Featured book covers */}
                {covers.length > 0 && (
                    <section className="container mx-auto px-4 pt-8 sm:px-6 lg:px-8">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-primary">
                                    <BookOpenText className="size-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">
                                        Explore our collection
                                    </span>
                                </div>
                                <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                                    Featured Publications
                                </h2>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border bg-muted/20 py-5">
                            <Carousel
                                opts={{
                                    loop: covers.length > 2,
                                    align: "start",
                                }}
                                plugins={[autoScrollPlugin]}
                            >
                                <CarouselContent className="-ml-3">
                                    {covers.map((cover, index) => {
                                        const image = cover.cover_file_id
                                            ? `https://lh3.googleusercontent.com/d/${cover.cover_file_id}`
                                            : cover.cover_page;

                                        return (
                                            <CarouselItem
                                                key={cover.id || index}
                                                className="basis-3/4 pl-3 sm:basis-1/2 lg:basis-1/3"
                                            >
                                                <div className="flex h-48 items-center justify-center overflow-hidden rounded-xl bg-background p-3 sm:h-56">
                                                    {image ? (
                                                        <img
                                                            src={image}
                                                            alt={
                                                                cover.title ||
                                                                `Featured publication ${index + 1}`
                                                            }
                                                            loading="lazy"
                                                            className="size-full object-contain"
                                                        />
                                                    ) : (
                                                        <BookOpen className="size-12 text-muted-foreground/30" />
                                                    )}
                                                </div>
                                            </CarouselItem>
                                        );
                                    })}
                                </CarouselContent>
                            </Carousel>
                        </div>
                    </section>
                )}

                {/* Page heading and search */}
                <section className="container mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl space-y-3 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
                            <BookOpen className="size-4" />
                            DIT.ADS Publications
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Book Publications
                        </h1>

                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Discover our collection of academic books,
                            research publications, and educational resources.
                            Explore published works and access available
                            digital editions.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold">
                                Browse Publications
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {books?.total ?? bookList.length}{" "}
                                publications available
                            </p>
                        </div>

                        <form
                            onSubmit={handleSearch}
                            className="flex w-full gap-2 sm:max-w-md"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search title, ISBN, author..."
                                    className="h-10 pl-9 pr-9"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        aria-label="Clear search"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                            </div>

                            <Button type="submit" className="h-10">
                                Search
                            </Button>

                            {initialSearch && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-10"
                                    onClick={clearSearch}
                                >
                                    Clear
                                </Button>
                            )}
                        </form>
                    </div>

                    {/* Book collection */}
                    {bookList.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {bookList.map((book) => (
                                <Card
                                    key={book.id}
                                    className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-muted/50 p-4">
                                        <BookCover
                                            book={book}
                                            className="size-full rounded-lg"
                                        />

                                        <div className="absolute left-3 top-3">
                                            {isBookOpenAccess(book) ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/95 px-2.5 py-1.5 text-[10px] font-semibold text-primary shadow-sm">
                                                    <CheckCircle2 className="size-3" />
                                                    Open Access
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/95 px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground shadow-sm">
                                                    <LockKeyhole className="size-3" />
                                                    Restricted
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <CardHeader className="space-y-3 px-4 pb-2 pt-4">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <CalendarDays className="size-3.5 shrink-0 text-primary" />
                                            <span>
                                                {formatDate(book.published_at)}
                                            </span>
                                        </div>

                                        <h3 className="line-clamp-2 min-h-12 break-words text-base font-bold leading-snug">
                                            {book.title}
                                        </h3>

                                        <CardDescription className="line-clamp-2 min-h-8 text-xs italic leading-relaxed">
                                            {book.author || "Author unavailable"}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 space-y-2 px-4 pb-4">
                                        {(book.soft_isbn || book.hard_isbn) && (
                                            <div className="border-t pt-3">
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                    ISBN
                                                </p>
                                                <p className="mt-1 break-all text-xs text-foreground">
                                                    {book.soft_isbn || "—"} /{" "}
                                                    {book.hard_isbn || "—"}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>

                                    <CardFooter className="flex items-center justify-between gap-2 border-t px-4 py-3">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            className="px-1 text-primary hover:bg-primary/5 hover:text-primary"
                                            onClick={() =>
                                                handleOpenBook(book)
                                            }
                                        >
                                            View Details
                                            <ArrowRight className="ml-1 size-4" />
                                        </Button>

                                        {book.pdf_file && (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="ghost"
                                                className="px-1 text-muted-foreground"
                                            >
                                                <a
                                                    href={`/view-book/${encodeURIComponent(
                                                        book.pdf_file
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    PDF
                                                    <img
                                                        src={PDF}
                                                        alt=""
                                                        className="ml-1 size-4"
                                                    />
                                                </a>
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 text-center">
                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <BookOpen className="size-8" />
                            </div>

                            <h3 className="text-lg font-semibold">
                                No Publications Found
                            </h3>

                            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                {initialSearch
                                    ? `We couldn't find any publications matching "${initialSearch}". Try another title, author, or ISBN.`
                                    : "There are currently no book publications available. Please check back later."}
                            </p>

                            {initialSearch && (
                                <Button
                                    variant="outline"
                                    className="mt-5"
                                    onClick={clearSearch}
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {books?.links?.length > 3 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
                            {books.links.map((link, index) => {
                                const isPrevious =
                                    index === 0;
                                const isNext =
                                    index === books.links.length - 1;

                                return (
                                    <Button
                                        key={index}
                                        type="button"
                                        size="sm"
                                        variant={
                                            link.active
                                                ? "default"
                                                : "outline"
                                        }
                                        disabled={!link.url}
                                        onClick={() =>
                                            handlePagination(link.url)
                                        }
                                        className="min-w-9"
                                    >
                                        {isPrevious ? (
                                            <ChevronLeft className="size-4" />
                                        ) : isNext ? (
                                            <ChevronRight className="size-4" />
                                        ) : (
                                            getLabel(link.label)
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </section>
            </section>

            {/* Book details */}
            <Sheet open={sheetOpen} onOpenChange={handleCloseSheet}>
                <SheetContent
                    side="bottom"
                    className="h-[95svh] overflow-y-auto rounded-t-2xl p-0"
                >
                    {selectedBook && (
                        <div className="mx-auto w-full max-w-5xl pb-10">
                            <SheetHeader className="sticky top-0 z-20 border-b bg-background/95 px-5 py-5 text-left backdrop-blur sm:px-8">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                                    <BookOpenText className="size-4" />
                                    Book Publication
                                </div>

                                <SheetTitle className="pr-8 text-xl font-bold leading-tight sm:text-2xl">
                                    {selectedBook.title}
                                </SheetTitle>

                                <SheetDescription className="text-sm italic">
                                    {selectedBook.author ||
                                        "Author unavailable"}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="grid gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[280px_1fr]">
                                {/* Cover and access */}
                                <div className="space-y-4">
                                    <div className="group mx-auto aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-xl border bg-muted/30 p-3 shadow-sm">
                                        <BookCover
                                            book={selectedBook}
                                            className="size-full rounded-lg"
                                        />
                                    </div>

                                    <div className="flex items-center justify-center gap-2">
                                        {isOpenAccess ? (
                                            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                                                <CheckCircle2 className="size-4" />
                                                Open Access
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">
                                                <LockKeyhole className="size-4" />
                                                Restricted Access
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Button
                                            block
                                            onClick={handleReadBook}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <ClipLoader
                                                        size={15}
                                                        color="white"
                                                    />
                                                    <span className="ml-2">
                                                        Opening...
                                                    </span>
                                                </>
                                            ) : hasBookAccess ? (
                                                <>
                                                    <BookOpenText className="mr-2 size-4" />
                                                    Read Book
                                                </>
                                            ) : !user ? (
                                                "Sign in to Read"
                                            ) : user.role === "customer" ? (
                                                "Purchase Book"
                                            ) : (
                                                "Access Restricted"
                                            )}
                                        </Button>

                                        {selectedBook.pdf_file &&
                                            hasBookAccess && (
                                                <Button
                                                    block
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleOpenFormat("pdf")
                                                    }
                                                >
                                                    <FileText className="mr-2 size-4" />
                                                    Open PDF
                                                </Button>
                                            )}
                                    </div>

                                    {hasBookAccess && (
                                        <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-xs leading-relaxed text-muted-foreground">
                                            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                                            You have access to this
                                            publication.
                                        </div>
                                    )}
                                </div>

                                {/* Book information */}
                                <div className="min-w-0 space-y-7">
                                    <section className="space-y-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                                                About this publication
                                            </p>
                                            <h2 className="mt-1 text-xl font-bold">
                                                {selectedBook.title}
                                            </h2>
                                        </div>

                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {selectedBook.overview ||
                                                "No publication overview is currently available."}
                                        </p>
                                    </section>

                                    <section className="space-y-4">
                                        <h3 className="border-b pb-3 text-sm font-bold">
                                            Publication Information
                                        </h3>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground">
                                                    Author
                                                </p>
                                                <p className="break-words text-sm font-medium">
                                                    {selectedBook.author ||
                                                        "Not specified"}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground">
                                                    Publication Date
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {formatDate(
                                                        selectedBook.published_at
                                                    )}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground">
                                                    Soft Bound ISBN
                                                </p>
                                                <p className="break-all text-sm font-medium">
                                                    {selectedBook.soft_isbn ||
                                                        "Not available"}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground">
                                                    Hard Bound ISBN
                                                </p>
                                                <p className="break-all text-sm font-medium">
                                                    {selectedBook.hard_isbn ||
                                                        "Not available"}
                                                </p>
                                            </div>
                                        </div>

                                        {selectedBook.doi && (
                                            <div className="space-y-1 border-t pt-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Digital Object Identifier
                                                    (DOI)
                                                </p>
                                                <a
                                                    href={selectedBook.doi}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="break-all text-sm font-medium text-primary hover:underline"
                                                >
                                                    {selectedBook.doi}
                                                </a>
                                            </div>
                                        )}
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Reading format selection */}
            <Dialog
                open={formatDialogOpen}
                onOpenChange={setFormatDialogOpen}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Choose Reading Format</DialogTitle>
                        <DialogDescription>
                            Select how you would like to read this
                            publication.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-3 pt-3">
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleOpenFormat("flipbook")}
                            className="flex flex-col items-center gap-3 rounded-xl border p-5 text-center transition-all hover:border-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <BookOpenText className="size-8" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    Flip Book
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Interactive reading
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            disabled={loading || !selectedBook?.pdf_file}
                            onClick={() => handleOpenFormat("pdf")}
                            className="flex flex-col items-center gap-3 rounded-xl border p-5 text-center transition-all hover:border-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <div className="flex size-14 items-center justify-center rounded-xl bg-muted text-primary">
                                <FileText className="size-8" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    PDF File
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Standard document
                                </p>
                            </div>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

BookPublication.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
