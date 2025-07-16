import CustomerLayout from "@/layouts/customer-layout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import { CreditCard, Wallet } from "lucide-react";
import GcashLogo from "../../../../../public/images/e-wallet/gcash-logo.svg";
import GrabpayLogo from "../../../../../public/images/e-wallet/grabpay-logo.svg";
import PaymayaLogo from "../../../../../public/images/e-wallet/paymaya-logo.svg";
import InputError from "@/components/input-error";
import { toast } from "sonner";
import LoadingScreen from "@/components/loading-screen";
import CartEmpty from "../../../../../public/images/cart-empty.png";

export default function Checkout() {
    const { items, addresses } = usePage().props;
    const subtotal = items.reduce((total, item) => {
        return total + item.book_publication.hard_price * item.quantity;
    }, 0);
    const { data, setData, post, errors, clearErrors, processing } = useForm({
        id: null,
        name: "",
        contact_number: "",
        complete_address: "",
        postal_code: "",
    });
    const {
        data: cardData,
        setData: cardSetData,
        post: cardPost,
        errors: cardErrors,
        clearErrors: cardClearErrors,
    } = useForm({
        card_number: "",
        card_exp_month: "",
        card_exp_year: "",
        card_cvn: "",
        card_holder_first_name: "",
        card_holder_last_name: "",
        card_holder_email: "",
        card_holder_phone_number: "",
        amount: subtotal,
    });
    const [addressToggle, setAddressToggle] = useState(false);
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(parseFloat(amount));
    const [selectedAddress, setSelectedAddress] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("card");
    const [editAddress, setEditAddress] = useState(false);
    const [selectedEwallet, setSelectedEwallet] = useState("PH_GCASH");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://js.xendit.co/v1/xendit.min.js";
        script.onload = () => {
            Xendit.setPublishableKey(import.meta.env.VITE_XENDIT_PUBLIC_KEY);
        };
        document.body.appendChild(script);
    }, []);

    const handleAddAddress = () => {
        clearErrors();
        post("/checkout/add/delivery-address", {
            onSuccess: () => {
                setAddressToggle(false);
                setData({
                    id: null,
                    name: "",
                    contact_number: "",
                    complete_address: "",
                    postal_code: "",
                });
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleUpdateAddress = () => {
        clearErrors();
        post("/checkout/update/delivery-address", {
            onSuccess: () => {
                setAddressToggle(false);
                setData({
                    id: null,
                    name: "",
                    contact_number: "",
                    complete_address: "",
                    postal_code: "",
                });
                setEditAddress(false);
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleEditAddress = (address) => {
        setEditAddress(true);
        setAddressToggle(true);
        setData({
            id: address.id,
            name: address.name,
            contact_number: address.contact_number,
            complete_address: address.complete_address,
            postal_code: address.postal_code,
        });
    };

    useEffect(() => {
        if (addresses.length === 0) {
            setAddressToggle(true);
        }

        if (addresses.length > 0) {
            setSelectedAddress(addresses[0].id.toString());
        }
    }, [addresses]);

    const handlePlaceOrder = () => {
        if (addresses.length === 0) {
            return toast.warning("Please add your shipping address.")
        }
        setLoading(true);
        if (selectedMethod === "card") {
            cardClearErrors();
            cardPost("/checkout/validate/card-info", {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    Xendit.card.createToken(cardData, function (err, token) {
                        if (err) {
                            toast.error(err.message);
                            return;
                        }
                        // If authentication is required (3DS), redirect
                        if (token.payer_authentication_url) {
                            window.location.href =
                                token.payer_authentication_url;
                        } else {
                            // No 3DS required, proceed directly with payment
                            axios
                                .post("/api/pay-with-card", {
                                    token_id: token.id,
                                    amount: cardData.amount,
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                        }
                    });
                },
                onFinish: () => {
                    setLoading(false);
                },
            });
        } else if (selectedMethod === "e-wallet") {
            axios
                .post("/api/pay-via-ewallet", {
                    amount: subtotal,
                    currency: "PHP",
                    checkout_method: "ONE_TIME_PAYMENT",
                    channel_code: selectedEwallet,
                    channel_properties: {
                        success_redirect_url: "http://127.0.0.1:8000",
                        failure_redirect_url: "http://127.0.0.1:8000/checkout",
                        cancel_redirect_url: "http://127.0.0.1:8000/checkout",
                    },
                })
                .then((response) => {
                    window.location.href =
                        response.data.actions.desktop_web_checkout_url;
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    return (
        <>
            {loading && <LoadingScreen />}
            <div className="flex gap-4">
                <div className="flex-1 space-y-4">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead className="flex justify-between items-center">
                                    <span>Shipping Address</span>
                                    <div>
                                        {addressToggle ? (
                                            <div className="flex gap-2">
                                                {addresses.length >= 1 && (
                                                    <Button
                                                        onClick={() => {
                                                            setAddressToggle(
                                                                false
                                                            );
                                                            clearErrors();
                                                            setData({
                                                                id: null,
                                                                name: "",
                                                                contact_number:
                                                                    "",
                                                                complete_address:
                                                                    "",
                                                                postal_code: "",
                                                            });
                                                            setEditAddress(
                                                                false
                                                            );
                                                        }}
                                                        size="sm"
                                                        variant="ghost"
                                                        disabled={processing}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={
                                                        editAddress
                                                            ? handleUpdateAddress
                                                            : handleAddAddress
                                                    }
                                                    size="sm"
                                                    disabled={processing}
                                                >
                                                    {editAddress
                                                        ? "Update"
                                                        : "Save"}
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={() =>
                                                    setAddressToggle(true)
                                                }
                                                size="sm"
                                                variant="outline"
                                            >
                                                Add new addres
                                            </Button>
                                        )}
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="p-4 space-y-2">
                                    {addressToggle ? (
                                        <div className="space-y-2">
                                            <div className="space-y-1">
                                                <Label>Full Name</Label>
                                                <Input
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Phone Number</Label>
                                                <Input
                                                    value={data.contact_number}
                                                    onChange={(e) =>
                                                        setData(
                                                            "contact_number",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.contact_number
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>
                                                    Street, Barangay, City,
                                                    Province
                                                </Label>
                                                <Textarea
                                                    value={
                                                        data.complete_address
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "complete_address",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.complete_address
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Postal Code</Label>
                                                <Input
                                                    value={data.postal_code}
                                                    onChange={(e) =>
                                                        setData(
                                                            "postal_code",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.postal_code}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        addresses.map((address, index) => (
                                            <div key={index}>
                                                <label
                                                    id={`option-${index}`}
                                                    className="cursor-pointer"
                                                >
                                                    <RadioGroup
                                                        value={selectedAddress}
                                                        onValueChange={
                                                            setSelectedAddress
                                                        }
                                                    >
                                                        <Card
                                                            className={`shadow-none flex justify-between items-center transition-all ${
                                                                selectedAddress ===
                                                                address.id.toString()
                                                                    ? "ring-1 ring-primary"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <div>
                                                                <CardHeader>
                                                                    <CardTitle className="flex gap-2 items-center">
                                                                        <span>
                                                                            Address{" "}
                                                                            {index +
                                                                                1}
                                                                        </span>
                                                                        <span
                                                                            onClick={() =>
                                                                                handleEditAddress(
                                                                                    address
                                                                                )
                                                                            }
                                                                            className="font-normal text-blue-500 hover:underline"
                                                                        >
                                                                            Edit
                                                                        </span>
                                                                        <span
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.preventDefault();
                                                                                router.post(
                                                                                    `/checkout/delete/delivery-address/${address.id}`,
                                                                                    {},
                                                                                    {
                                                                                        preserveState: true,
                                                                                        preserveScroll: true,
                                                                                    }
                                                                                );
                                                                            }}
                                                                            className="font-normal text-red-500 hover:underline"
                                                                        >
                                                                            Delete
                                                                        </span>
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <div className="flex items-center gap-2">
                                                                        <h1>
                                                                            {
                                                                                address.name
                                                                            }
                                                                        </h1>
                                                                        <div className="h-4">
                                                                            <Separator orientation="vertical" />
                                                                        </div>
                                                                        <p className="text-muted-foreground">
                                                                            {
                                                                                address.contact_number
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <h1>
                                                                        {
                                                                            address.complete_address
                                                                        }
                                                                    </h1>
                                                                    <h1>
                                                                        {
                                                                            address.postal_code
                                                                        }
                                                                    </h1>
                                                                </CardContent>
                                                            </div>
                                                            <div className="mr-6">
                                                                <RadioGroupItem
                                                                    value={address.id.toString()}
                                                                    id={`option-${index}`}
                                                                    className="pointer-events-none"
                                                                />
                                                            </div>
                                                        </Card>
                                                    </RadioGroup>
                                                </label>
                                            </div>
                                        ))
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Payment Method</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="space-y-4">
                                    <RadioGroup
                                        value={selectedMethod}
                                        onValueChange={setSelectedMethod}
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <label
                                                id="card"
                                                className="cursor-pointer"
                                            >
                                                <Card
                                                    className={`shadow-none flex justify-between items-center transition-all ${
                                                        selectedMethod ===
                                                        "card"
                                                            ? "ring-1 ring-primary"
                                                            : ""
                                                    }`}
                                                >
                                                    <div className="w-full p-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <CreditCard />
                                                            <span>
                                                                Credit Card
                                                            </span>
                                                        </div>
                                                        <RadioGroupItem
                                                            value="card"
                                                            id="card"
                                                            className="pointer-events-none"
                                                        />
                                                    </div>
                                                </Card>
                                            </label>
                                            <label
                                                id="e-wallet"
                                                className="cursor-pointer"
                                            >
                                                <Card
                                                    className={`shadow-none flex justify-between items-center transition-all ${
                                                        selectedMethod ===
                                                        "e-wallet"
                                                            ? "ring-1 ring-primary"
                                                            : ""
                                                    }`}
                                                >
                                                    <div className="w-full p-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Wallet />
                                                            <span>
                                                                E-Wallet
                                                            </span>
                                                        </div>
                                                        <RadioGroupItem
                                                            value="e-wallet"
                                                            id="e-waller"
                                                            className="pointer-events-none"
                                                        />
                                                    </div>
                                                </Card>
                                            </label>
                                        </div>
                                    </RadioGroup>
                                    {selectedMethod === "card" && (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <Input
                                                        value={
                                                            cardData.card_holder_first_name
                                                        }
                                                        onChange={(e) =>
                                                            cardSetData(
                                                                "card_holder_first_name",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="First Name"
                                                    />
                                                    <InputError
                                                        message={
                                                            cardErrors.card_holder_first_name
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Input
                                                        value={
                                                            cardData.card_holder_last_name
                                                        }
                                                        onChange={(e) =>
                                                            cardSetData(
                                                                "card_holder_last_name",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Last Name"
                                                    />
                                                    <InputError
                                                        message={
                                                            cardErrors.card_holder_last_name
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Input
                                                        value={
                                                            cardData.card_holder_email
                                                        }
                                                        onChange={(e) =>
                                                            cardSetData(
                                                                "card_holder_email",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Email Address"
                                                    />
                                                    <InputError
                                                        message={
                                                            cardErrors.card_holder_email
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Input
                                                        value={
                                                            cardData.card_holder_phone_number
                                                        }
                                                        onChange={(e) =>
                                                            cardSetData(
                                                                "card_holder_phone_number",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Phone Number"
                                                    />
                                                    <InputError
                                                        message={
                                                            cardErrors.card_holder_phone_number
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Input
                                                    value={cardData.card_number}
                                                    onChange={(e) =>
                                                        cardSetData(
                                                            "card_number",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Card Number"
                                                />
                                                <InputError
                                                    message={
                                                        cardErrors.card_number
                                                    }
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="space-y-1">
                                                        <Input
                                                            value={
                                                                cardData.card_exp_month
                                                            }
                                                            onChange={(e) =>
                                                                cardSetData(
                                                                    "card_exp_month",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="MM"
                                                        />
                                                        <InputError
                                                            message={
                                                                cardErrors.card_exp_month
                                                            }
                                                        />
                                                    </div>
                                                    <span>/</span>
                                                    <div className="space-y-1">
                                                        <Input
                                                            value={
                                                                cardData.card_exp_year
                                                            }
                                                            onChange={(e) =>
                                                                cardSetData(
                                                                    "card_exp_year",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="YYYY"
                                                        />
                                                        <InputError
                                                            message={
                                                                cardErrors.card_exp_year
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <Input
                                                        value={
                                                            cardData.card_cvn
                                                        }
                                                        onChange={(e) =>
                                                            cardSetData(
                                                                "card_cvn",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="CVV"
                                                    />
                                                    <InputError
                                                        message={
                                                            cardErrors.card_cvn
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {selectedMethod === "e-wallet" && (
                                        <div className="grid grid-cols-4 gap-2">
                                            <Card
                                                onClick={() =>
                                                    setSelectedEwallet(
                                                        "PH_GCASH"
                                                    )
                                                }
                                                className={`shadow-none cursor-pointer transition-all ${
                                                    selectedEwallet ===
                                                    "PH_GCASH"
                                                        ? "ring-1 ring-primary"
                                                        : ""
                                                }`}
                                            >
                                                <div className="h-full p-4 flex justify-center items-center">
                                                    <img
                                                        src={GcashLogo}
                                                        alt="gcash-logo"
                                                        className="w-30 object-contain"
                                                    />
                                                </div>
                                            </Card>
                                            <Card
                                                onClick={() =>
                                                    setSelectedEwallet(
                                                        "PH_PAYMAYA"
                                                    )
                                                }
                                                className={`shadow-none cursor-pointer transition-all ${
                                                    selectedEwallet ===
                                                    "PH_PAYMAYA"
                                                        ? "ring-1 ring-primary"
                                                        : ""
                                                }`}
                                            >
                                                <div className="h-full p-4 flex justify-center items-center">
                                                    <img
                                                        src={PaymayaLogo}
                                                        alt="paymaya-logo"
                                                        className="w-20 object-contain"
                                                    />
                                                </div>
                                            </Card>
                                            <Card
                                                onClick={() =>
                                                    setSelectedEwallet(
                                                        "PH_GRABPAY"
                                                    )
                                                }
                                                className={`shadow-none cursor-pointer transition-all ${
                                                    selectedEwallet ===
                                                    "PH_GRABPAY"
                                                        ? "ring-1 ring-primary"
                                                        : ""
                                                }`}
                                            >
                                                <div className="h-full p-4 flex justify-center items-center">
                                                    <img
                                                        src={GrabpayLogo}
                                                        alt="grabpay-logo"
                                                        className="w-12 object-contain"
                                                    />
                                                </div>
                                            </Card>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <img
                            src={CartEmpty}
                            alt="cart-empty"
                            className="size-40 object-contain"
                        />
                        <p className="font-medium text-muted-foreground">
                            Your shopping cart is empty
                        </p>
                        <Button onClick={() => router.visit("/books")}>
                            Go Shopping Now
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 space-y-4">
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead className="flex justify-between items-center">
                                        <span>Item Summary</span>
                                        <Button
                                            onClick={() =>
                                                router.visit("/cart")
                                            }
                                            size="sm"
                                            variant="outline"
                                        >
                                            Edit
                                        </Button>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex gap-4">
                                                <div className="bg-muted border max-h-40 max-w-40">
                                                    <img
                                                        src={`https://lh3.googleusercontent.com/d/${item.book_publication.cover_file_id}`}
                                                        alt="cover_page"
                                                        className="object-contain size-full"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col">
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between gap-4">
                                                            <h1 className="font-semibold line-clamp-2">
                                                                {
                                                                    item
                                                                        .book_publication
                                                                        .title
                                                                }
                                                            </h1>
                                                            <h1 className="font-semibold">
                                                                {formatCurrency(
                                                                    item
                                                                        .book_publication
                                                                        .hard_price *
                                                                        item.quantity
                                                                )}
                                                            </h1>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-muted-foreground italic line-clamp-2">
                                                                {
                                                                    item
                                                                        .book_publication
                                                                        .author
                                                                }
                                                            </p>
                                                            <p className="text-sm font-semibold">
                                                                {formatCurrency(
                                                                    item
                                                                        .book_publication
                                                                        .hard_price
                                                                )}
                                                            </p>
                                                            <p className="text-sm">
                                                                Qty:{" "}
                                                                <span className="font-semibold">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead>Order Totals</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="p-4">
                                        <div className="flex items-center justify-between font-semibold">
                                            <h1>Total</h1>
                                            <p>{formatCurrency(subtotal)}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Button
                            onClick={handlePlaceOrder}
                            className="w-full"
                            disabled={loading}
                        >
                            Place Order
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

Checkout.layout = (page) => <CustomerLayout children={page} />;
