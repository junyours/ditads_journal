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
    ReceiptText,
    Upload,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Textarea } from "@/components/ui/textarea";

export default function SaleBook() {
    const { books, payments, addresses } = usePage().props;
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
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [book, setBook] = useState(null);
    const { data, setData, post, errors, clearErrors, processing } = useForm({
        book_publication_id: null,
        amount: "",
        type: "",
        quantity: 1,
        payment_method_id: null,
        reference_number: "",
        receipt: null,
        delivery_address_id: null,
        complete_address: "",
        contact_number: "",
    });
    const [tab, setTab] = useState(1);
    const payment = payments.find(
        (payment) => payment.id === data.payment_method_id
    );
    const address = addresses.find(
        (address) => address.id === data.delivery_address_id
    );
    const [previewReceipt, setPreviewReceipt] = useState(null);

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
            setData("book_publication_id", book.id);
        } else {
            setBook(null);
            setData("book_publication_id", null);
        }
        setIsOpen(!isOpen);
    };

    const handleAddDeliveryAddress = () => {
        clearErrors();
        post("/customer/add/delivery-address", {
            onSuccess: () => {
                setIsAddressOpen(false);
            },
        });
    };

    const handlePay = () => {
        clearErrors();
        post("/customer/book/pay", {
            onSuccess: () => {
                handleIsOpen();
            },
        });
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
                <DialogContent className="max-h-full overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {tab === 1 &&
                                "Choose the type of book you want to buy"}
                            {tab === 2 &&
                                (data.type === "hard_bound"
                                    ? "Hard Bound Book"
                                    : "Soft Bound Book")}
                            {tab === 3 &&
                                data.type === "hard_bound" &&
                                "Select delivery address"}
                            {tab === 4 && "Select Payment Method"}
                            {tab === 5 && `Pay with ${payment?.name}`}
                        </DialogTitle>
                    </DialogHeader>
                    {tab === 1 && (
                        <RadioGroup
                            value={data.type || ""}
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
                                <div className="relative">
                                    <div
                                        onClick={() => {
                                            if (!book?.has_transaction) {
                                                setData("type", "soft_bound");
                                            }
                                        }}
                                        className={`flex flex-col h-40 rounded-lg border p-4 cursor-pointer ${
                                            book?.has_transaction &&
                                            "bg-muted opacity-30"
                                        } ${
                                            data.type === "soft_bound"
                                                ? "ring-1 ring-primary"
                                                : ""
                                        }`}
                                    >
                                        <RadioGroupItem
                                            value="soft_bound"
                                            id="option-two"
                                            disabled={book?.has_transaction}
                                        />
                                        <div className="flex-1 flex flex-col gap-2 items-center justify-center">
                                            <BookOpen size={40} />
                                            <h1>Soft Bound</h1>
                                        </div>
                                        <span>
                                            {formatCurrency(book?.soft_price)}
                                        </span>
                                    </div>
                                    <div
                                        className={
                                            book?.has_transaction
                                                ? "absolute inset-0 flex items-center justify-center"
                                                : "hidden"
                                        }
                                    >
                                        <p className="font-semibold">
                                            One time order only
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </RadioGroup>
                    )}
                    {tab === 2 && (
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
                                    {data.type === "hard_bound" && (
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
                                    )}
                                    <span>
                                        {formatCurrency(
                                            data.type === "hard_bound"
                                                ? book?.hard_price *
                                                      data.quantity
                                                : book?.soft_price
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    {data.type === "hard_bound" && tab === 3 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Select
                                    value={data.delivery_address_id || ""}
                                    onValueChange={(val) =>
                                        setData("delivery_address_id", val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {addresses.map((address, index) => (
                                            <SelectItem
                                                key={index}
                                                value={address.id}
                                            >
                                                Address {index + 1}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={() => setIsAddressOpen(true)}>
                                    Add
                                </Button>
                            </div>
                            {data.delivery_address_id && (
                                <>
                                    <div className="space-y-1">
                                        <Label>Complete Address</Label>
                                        <Textarea
                                            value={address?.complete_address}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Contact Number</Label>
                                        <Input
                                            value={address?.contact_number}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    {tab === 4 && (
                        <div className="space-y-4">
                            <Select
                                value={data.payment_method_id || ""}
                                onValueChange={(val) =>
                                    setData("payment_method_id", val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {payments.map((payment, index) => (
                                        <SelectItem
                                            key={index}
                                            value={payment.id}
                                        >
                                            {payment.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {data.payment_method_id && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>Account Name</Label>
                                            <Input
                                                value={payment?.account_name}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>
                                                {payment?.account_number
                                                    ? "Account Number"
                                                    : "Account Email"}
                                            </Label>
                                            <Input
                                                value={
                                                    payment?.account_number ??
                                                    payment?.account_email
                                                }
                                            />
                                        </div>
                                    </div>
                                    {payment?.qr_code && (
                                        <div className="max-w-[250px] mx-auto h-[300px]">
                                            <img
                                                src={payment?.qr_code}
                                                className="object-contain h-full w-full"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                    {tab === 5 && (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label>Reference Number</Label>
                                <Input
                                    value={data.reference_number}
                                    onChange={(e) =>
                                        setData(
                                            "reference_number",
                                            e.target.value
                                        )
                                    }
                                />
                                <InputError message={errors.reference_number} />
                            </div>
                            <div className="space-y-1">
                                <Label>Upload Receipt</Label>
                                <div className=" flex items-center space-x-4 rounded-md border p-4">
                                    <ReceiptText />
                                    <div className="flex-1">
                                        {data.receipt ? (
                                            <p className="text-sm font-medium leading-none">
                                                {data.receipt.name}
                                            </p>
                                        ) : (
                                            <p className="text-sm font-medium leading-none">
                                                No file chosen
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() =>
                                            document
                                                .getElementById("receipt")
                                                .click()
                                        }
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <Upload />
                                    </Button>
                                </div>
                                <input
                                    accept=".jpg,.jpeg,.png"
                                    id="receipt"
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setData("receipt", file);
                                        if (file) {
                                            const imageUrl =
                                                URL.createObjectURL(file);
                                            setPreviewReceipt(imageUrl);
                                        } else {
                                            setPreviewReceipt(null);
                                        }
                                    }}
                                    hidden
                                />
                                <InputError message={errors.receipt} />
                            </div>
                            {previewReceipt && (
                                <div className="max-w-[250px] mx-auto h-[300px]">
                                    <img
                                        src={previewReceipt}
                                        className="object-contain h-full w-full"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        {tab === 1 && data.type && (
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
                                <Button
                                    onClick={() =>
                                        setTab(
                                            data.type === "hard_bound" ? 3 : 4
                                        )
                                    }
                                >
                                    Next
                                </Button>
                            </>
                        )}
                        {tab === 3 && (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => setTab(2)}
                                >
                                    Back
                                </Button>
                                {data.delivery_address_id && (
                                    <Button onClick={() => setTab(4)}>
                                        Next
                                    </Button>
                                )}
                            </>
                        )}
                        {tab === 4 && (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        setTab(
                                            data.type === "hard_bound" ? 3 : 2
                                        )
                                    }
                                >
                                    Back
                                </Button>
                                {data.payment_method_id && (
                                    <Button onClick={() => setTab(5)}>
                                        Next
                                    </Button>
                                )}
                            </>
                        )}
                        {tab === 5 && (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => setTab(4)}
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handlePay}
                                    disabled={processing}
                                >
                                    Pay
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isAddressOpen}
                onOpenChange={() => setIsAddressOpen(false)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Delivery Address</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label>Complete Address</Label>
                            <Textarea
                                value={data.complete_address}
                                onChange={(e) =>
                                    setData("complete_address", e.target.value)
                                }
                            />
                            <InputError message={errors.complete_address} />
                        </div>
                        <div className="space-y-1">
                            <Label>Contact Number</Label>
                            <Input
                                value={data.contact_number}
                                onChange={(e) =>
                                    setData("contact_number", e.target.value)
                                }
                            />
                            <InputError message={errors.contact_number} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleAddDeliveryAddress}
                            disabled={processing}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

SaleBook.layout = (page) => (
    <AppLayout children={page} title="For Sale Books" />
);
