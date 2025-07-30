import CustomerLayout from "@/layouts/customer-layout";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";
import CartEmpty from "../../../../../public/images/cart-empty.png";

export default function Cart() {
    const { carts } = usePage().props;
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(parseFloat(amount));

    const subtotal = carts.reduce((total, cart) => {
        return total + cart.book_publication.hard_price * cart.quantity;
    }, 0);

    const handleIncrement = (cart_id) => {
        router.post(
            "/cart/increment",
            { cart_id },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleDecrement = (cart_id) => {
        router.post(
            "/cart/decrement",
            { cart_id },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <div className="p-4">
            {carts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4">
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
                <div className="flex gap-4">
                    <div className="flex-1 bg-background rounded-xl p-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-full text-center">
                                        Items
                                    </TableHead>
                                    <TableHead className="w-60 text-center">
                                        Price
                                    </TableHead>
                                    <TableHead className="w-60 text-center">
                                        Quantity
                                    </TableHead>
                                    <TableHead className="w-60 text-center">
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {carts.map((cart, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex gap-4">
                                                <div className="bg-muted border max-h-40 max-w-40">
                                                    <img
                                                        src={`https://lh3.googleusercontent.com/d/${cart.book_publication.cover_file_id}`}
                                                        alt="cover_page"
                                                        className="object-contain size-full"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col gap-2 justify-between">
                                                    <div className="space-y-4">
                                                        <h1 className="font-semibold line-clamp-2">
                                                            {
                                                                cart
                                                                    .book_publication
                                                                    .title
                                                            }
                                                        </h1>
                                                        <p className="text-sm text-muted-foreground italic line-clamp-2">
                                                            {
                                                                cart
                                                                    .book_publication
                                                                    .author
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            method="post"
                                                            href={`/cart/remove/${cart.id}`}
                                                            className="underline text-destructive"
                                                        >
                                                            Remove
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {formatCurrency(
                                                cart.book_publication.hard_price
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <div className="flex">
                                                    <Button
                                                        onClick={() =>
                                                            handleDecrement(
                                                                cart.id
                                                            )
                                                        }
                                                        size="icon"
                                                        variant="outline"
                                                        className="rounded-r-none"
                                                        disabled={
                                                            cart.quantity <= 1
                                                                ? true
                                                                : false
                                                        }
                                                    >
                                                        <Minus />
                                                    </Button>
                                                    <div className="min-w-10 px-2 border flex justify-center items-center">
                                                        <span>
                                                            {cart.quantity}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        onClick={() =>
                                                            handleIncrement(
                                                                cart.id
                                                            )
                                                        }
                                                        size="icon"
                                                        variant="outline"
                                                        className="rounded-l-none"
                                                    >
                                                        <Plus />
                                                    </Button>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {formatCurrency(
                                                cart.book_publication
                                                    .hard_price * cart.quantity
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="h-fit w-96 space-y-4 bg-background p-4 rounded-xl">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order Summary</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="p-4">
                                        <div className="flex items-center justify-between font-semibold">
                                            <h1>Estimated Total</h1>
                                            <p>{formatCurrency(subtotal)}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Button
                            onClick={() => router.visit("/checkout")}
                            className="w-full"
                        >
                            Checkout
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

Cart.layout = (page) => <CustomerLayout children={page} />;
