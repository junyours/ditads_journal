import AppLayout from "@/layouts/app-layout";

export default function BookCategory() {
    return <div>book-category</div>;
}

BookCategory.layout = (page) => (
    <AppLayout children={page} title="Book Categories" />
);
