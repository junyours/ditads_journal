import AppLayout from "@/layouts/app-layout";

export default function SaleBook() {
    return <div>sale-book</div>;
}

SaleBook.layout = (page) => (
    <AppLayout children={page} title="For Sale Books" />
);
