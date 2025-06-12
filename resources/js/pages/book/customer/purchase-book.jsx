import AppLayout from "@/layouts/app-layout";

export default function PurchaseBook() {
    return <div>purchase-book</div>;
}

PurchaseBook.layout = (page) => (
    <AppLayout children={page} title="Purchase Books" />
);
