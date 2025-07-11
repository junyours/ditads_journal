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
import { router } from "@inertiajs/react";
import axios from "axios";
import { CreditCard, Wallet } from "lucide-react";
import GcashLogo from "../../../../../public/images/e-wallet/gcash-logo.svg";
import GrabpayLogo from "../../../../../public/images/e-wallet/grabpay-logo.svg";
import PaymayaLogo from "../../../../../public/images/e-wallet/paymaya-logo.svg";

export default function Checkout() {
    const [addressToggle, setAddressToggle] = useState(false);
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(parseFloat(amount));


    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://js.xendit.co/v1/xendit.min.js";
        script.onload = () => {
            Xendit.setPublishableKey(import.meta.env.VITE_XENDIT_PUBLIC_KEY);
        };
        document.body.appendChild(script);
    }, []);

    const handlePlaceOrder = () => {
        // axios
        //     .post("/api/pay-via-ewallet", {
        //         amount: parseInt(1000),
        //         currency: "PHP",
        //         checkout_method: "ONE_TIME_PAYMENT",
        //         channel_code: "PH_GCASH",
        //         channel_properties: {
        //             success_redirect_url: "http://127.0.0.1:8000",
        //             failure_redirect_url: "http://127.0.0.1:8000",
        //             cancel_redirect_url: "http://127.0.0.1:8000",
        //         },
        //     })
        //     .then((response) => {
        //         window.location.href =
        //             response.data.actions.desktop_web_checkout_url;
        //     });

        const cardData = {
        card_number: '5123450000000008',
        card_exp_month: '01',
        card_exp_year: '2037',
        card_cvn: '100',
        card_holder_first_name: 'Al',
        card_holder_last_name: 'Gaid',
        card_holder_email: 'al@gmail.com',
        card_holder_phone_number: '+639123456789',
        amount: 1000,
    };

    Xendit.card.createToken(cardData, function (err, token) {
    if (err) {
        alert("Tokenization failed: " + err.message);
        return;
    }

    // Tokenization succeeded, now authenticate
    Xendit.card.authenticateToken(
        {
            amount: 1000,
            token_id: token.id,
        },
        function (authErr, authResult) {
            if (authErr) {
                alert("Authentication failed: " + authErr.message);
                return;
            }

            // Now send token_id and authentication_id to your backend
            axios
                .post("/api/pay-with-card", {
                    token_id: token.id,
                    authentication_id: authResult.id,
                    amount: 1000,
                })
                .then((res) => {
                    alert("Payment success!");
                    console.log(res.data);
                })
                .catch((err) => {
                    console.error(err);
                    alert("Payment failed.");
                });
        }
    );
});

    };

    return (
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
                                            <Button
                                                onClick={() =>
                                                    setAddressToggle(false)
                                                }
                                                size="sm"
                                                variant="ghost"
                                            >
                                                Cancel
                                            </Button>
                                            <Button size="sm">Save</Button>
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
                                            <Input />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Phone Number</Label>
                                            <Input />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>
                                                Street, Barangay, City, Province
                                            </Label>
                                            <Textarea />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Postal Code</Label>
                                            <Input />
                                        </div>
                                    </div>
                                ) : (
                                    <RadioGroup defaultValue="option-one">
                                        <Card className="shadow-none flex justify-between items-center ring-1 ring-primary">
                                            <div>
                                                <CardHeader>
                                                    <CardTitle className="flex gap-2 items-center">
                                                        <span>Address 1</span>
                                                        <span className="font-normal text-blue-500 hover:underline">
                                                            Edit
                                                        </span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex items-center gap-2">
                                                        <h1>Al Gaid</h1>
                                                        <div className="h-4">
                                                            <Separator orientation="vertical" />
                                                        </div>
                                                        <p className="text-muted-foreground">
                                                            09123456789
                                                        </p>
                                                    </div>
                                                    <h1>
                                                        Zone 4, Kibaghot,
                                                        Laguindingan, Misamis
                                                        Oriental
                                                    </h1>
                                                    <h1>9019</h1>
                                                </CardContent>
                                            </div>
                                            <div className="mr-6">
                                                <RadioGroupItem
                                                    value="option-one"
                                                    id="option-one"
                                                />
                                            </div>
                                        </Card>
                                    </RadioGroup>
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
                                <RadioGroup defaultValue="option-one">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Card className="shadow-none ring-1 ring-primary">
                                            <div className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard />
                                                    <span>Credit Card</span>
                                                </div>
                                                <RadioGroupItem
                                                    value="option-one"
                                                    id="option-one"
                                                />
                                            </div>
                                        </Card>
                                        <Card className="shadow-none">
                                            <div className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Wallet />
                                                    <span>E-Wallet</span>
                                                </div>
                                                <RadioGroupItem
                                                    value="option-two"
                                                    id="option-two"
                                                />
                                            </div>
                                        </Card>
                                    </div>
                                </RadioGroup>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input placeholder="First Name"/>
                                        <Input placeholder="Last Name"/>
                                        <Input placeholder="Email Address"/>
                                        <Input placeholder="Phone Number"/>
                                    </div>
                                    <Input placeholder="Card Number"/>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center gap-2">
                                            <Input placeholder="MM"/>
                                            <span>/</span>
                                            <Input placeholder="YYYY"/>
                                        </div>
                                        <Input placeholder="CVV"/>
                                    </div>
                                </div>
                                {/* <div className="grid grid-cols-4 gap-2">
                                    <Card className="shadow-none">
                                        <div className="h-full p-4 flex justify-center items-center">
                                            <img
                                                src={GcashLogo}
                                                alt="gcash-logo"
                                                className="w-30 object-contain"
                                            />
                                        </div>
                                    </Card>
                                    <Card className="shadow-none">
                                        <div className="h-full p-4 flex justify-center items-center">
                                            <img
                                                src={PaymayaLogo}
                                                alt="paymaya-logo"
                                                className="w-20 object-contain"
                                            />
                                        </div>
                                    </Card>
                                    <Card className="shadow-none">
                                        <div className="h-full p-4 flex justify-center items-center">
                                            <img
                                                src={GrabpayLogo}
                                                alt="grabpay-logo"
                                                className="w-12 object-contain"
                                            />
                                        </div>
                                    </Card>
                                </div> */}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div className="flex-1 space-y-4">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead className="flex justify-between items-center">
                                <span>Item Summary</span>
                                <Button
                                    onClick={() => router.visit("/cart")}
                                    size="sm"
                                    variant="outline"
                                >
                                    Edit
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <div className="flex gap-4">
                                    <div className="bg-muted border max-h-40 max-w-40">
                                        <img
                                            src={`https://lh3.googleusercontent.com/d/1Q2ppWR8m-lnT6eAM2ojyikGHFd81oHGd`}
                                            alt="cover_page"
                                            className="object-contain size-full"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="space-y-4">
                                            <div className="flex justify-between gap-4">
                                                <h1 className="font-semibold">
                                                    Sample
                                                </h1>
                                                <h1 className="font-semibold">
                                                    {formatCurrency(1000)}
                                                </h1>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground italic">
                                                    Sample
                                                </p>
                                                <p className="text-sm font-semibold">
                                                    {formatCurrency(1000)}
                                                </p>
                                                <p className="text-sm">
                                                    Qty:{" "}
                                                    <span className="font-semibold">
                                                        1
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
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
                            <TableCell className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h1>Subtotal</h1>
                                    <p>{formatCurrency(1000)}</p>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between font-semibold">
                                    <h1>Total</h1>
                                    <p>{formatCurrency(1000)}</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Button onClick={handlePlaceOrder} className="w-full">
                    Place Order
                </Button>
            </div>
        </div>
    );
}

Checkout.layout = (page) => <CustomerLayout children={page} />;
