import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import {
    Book,
    BookOpen,
    Calendar,
    ChevronRight,
    Minus,
    MoreHorizontal,
    MoveRight,
    Plus,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColumnHeader } from "@/components/table/column-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/table/data-table";

export default function SaleBook() {
    const { books } = usePage().props;
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(parseFloat(amount));
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [book, setBook] = useState(null);
    const { data, setData } = useForm({
        type: "hard_bound",
        quantity: 1,
    });
    const [tab, setTab] = useState(1);

    const handleIncrement = () => setData("quantity", data.quantity + 1);

    const handleDecrement = () =>
        setData("quantity", data.quantity > 1 ? data.quantity - 1 : 1);

    const handleOpen = (book = null) => {
        if (book) {
            setBook(book);
        } else {
            setBook(null);
        }
        setOpen(!open);
    };

    const handleIsOpen = (book = null) => {
        if (book) {
            setBook(book);
        } else {
            setBook(null);
        }
        setIsOpen(!isOpen);
    };

    const columns = [
        {
            accessorKey: "cover_page",
            header: "",
            cell: ({ row }) => {
                const book = row.original;
                return (
                    <div className="size-10">
                        <img
                            src={book.cover_page}
                            alt="cover_page"
                            className="size-full object-contain"
                        />
                    </div>
                );
            },
        },
        {
            accessorKey: "soft_isbn",
            header: ({ column }) => (
                <ColumnHeader column={column} title="Soft Bound ISBN" />
            ),
        },
        {
            accessorKey: "hard_isbn",
            header: ({ column }) => (
                <ColumnHeader column={column} title="Hard Bound ISBN" />
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "published_at",
            header: "Published At",
            cell: ({ row }) => {
                const book = row.original;
                return formatDate(book.published_at);
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const book = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpen(book)}>
                                <MoveRight />
                                Read more
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleIsOpen(book)}
                            >
                                <ChevronRight />
                                Buy now
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <>
            <DataTable columns={columns} data={books} button={null} />

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
                    <p className="text-justify whitespace-pre-line mt-4">
                        {book?.overview}
                    </p>
                </SheetContent>
            </Sheet>

            <Dialog open={isOpen} onOpenChange={() => handleIsOpen()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {tab === 1 &&
                                "Choose the type of book you want to buy"}
                            {tab === 2 && "Add quantity"}
                        </DialogTitle>
                    </DialogHeader>
                    {tab === 1 && (
                        <RadioGroup
                            value={data.type}
                            onValueChange={(val) => setData("type", val)}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    onClick={() =>
                                        setData("type", "hard_bound")
                                    }
                                    className={`flex flex-col h-40 rounded-lg border p-4 cursor-pointer ${
                                        data.type === "hard_bound"
                                            ? "ring-1 ring-primary"
                                            : ""
                                    }`}
                                >
                                    <RadioGroupItem
                                        value="hard_bound"
                                        id="option-one"
                                    />
                                    <div className="flex-1 flex flex-col gap-2 items-center justify-center">
                                        <Book size={40} />
                                        <h1>Hard Bound</h1>
                                    </div>
                                    <span>
                                        {formatCurrency(book?.hard_price)}
                                    </span>
                                </div>
                                <div
                                    onClick={() =>
                                        setData("type", "soft_bound")
                                    }
                                    className={`flex flex-col h-40 rounded-lg border p-4 cursor-pointer ${
                                        data.type === "soft_bound"
                                            ? "ring-1 ring-primary"
                                            : ""
                                    }`}
                                >
                                    <RadioGroupItem
                                        value="soft_bound"
                                        id="option-two"
                                    />
                                    <div className="flex-1 flex flex-col gap-2 items-center justify-center">
                                        <BookOpen size={40} />
                                        <h1>Soft Bound</h1>
                                    </div>
                                    <span>
                                        {formatCurrency(book?.soft_price)}
                                    </span>
                                </div>
                            </div>
                        </RadioGroup>
                    )}
                    {tab === 2 && (
                        <>
                            {data.type === "hard_bound" && (
                                <div className="flex items-center gap-4">
                                    <div className="size-32">
                                        <img
                                            src={book?.cover_page}
                                            alt="cover_page"
                                            className="size-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="space-y-1">
                                            <h1>{book?.title}</h1>
                                            <p className="text-xs text-muted-foreground italic">
                                                {book?.author}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={handleDecrement}
                                                    variant="outline"
                                                    size="icon"
                                                >
                                                    <Minus />
                                                </Button>
                                                <span>{data.quantity}</span>
                                                <Button
                                                    onClick={handleIncrement}
                                                    variant="outline"
                                                    size="icon"
                                                >
                                                    <Plus />
                                                </Button>
                                            </div>
                                            <span>
                                                {formatCurrency(
                                                    book?.hard_price *
                                                        data.quantity
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <DialogFooter>
                        {tab === 1 && (
                            <Button onClick={() => setTab(2)}>Next</Button>
                        )}
                        {tab === 2 && (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => setTab(1)}
                                >
                                    Back
                                </Button>
                                <Button onClick={() => setTab(3)}>Next</Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

SaleBook.layout = (page) => (
    <AppLayout children={page} title="For Sale Books" />
);
