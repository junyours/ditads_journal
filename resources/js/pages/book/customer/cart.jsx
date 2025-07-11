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
import { Separator } from "@/components/ui/separator";
import { router } from "@inertiajs/react";

export default function Cart() {
  const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(parseFloat(amount));

    return (
        <div className="flex gap-4">
            <div className="flex-1">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead className="w-96 text-center">
                                Items
                            </TableHead>
                            <TableHead className="w-52 text-center">
                                Price
                            </TableHead>
                            <TableHead className="w-40 text-center">
                                Quantity
                            </TableHead>
                            <TableHead className="w-40 text-center">
                                Total
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
                                    <div className="flex-1 flex flex-col gap-2 justify-between">
                                        <div className="space-y-4">
                                            <h1 className="font-semibold line-clamp-2">
                                                Sample
                                            </h1>
                                            <p className="text-sm text-muted-foreground italic line-clamp-2">
                                                Sample
                                            </p>
                                        </div>
                                        <span className="underline">
                                            Remove
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                {formatCurrency(1000)}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
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
                            </TableCell>
                            <TableCell className="text-center">
                                {formatCurrency(1000)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div className="w-96 space-y-4">
              <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>
                                Order Summary
                            </TableHead>
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
                                <div className="flex items-center justify-between">
                                    <h1 className="font-semibold">Estimated Total</h1>
                                    <p>{formatCurrency(1000)}</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Button onClick={() => router.visit('/checkout')} className="w-full">Checkout</Button>
            </div>
        </div>
    );
}

Cart.layout = (page) => <CustomerLayout children={page} />;
