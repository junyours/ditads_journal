import AppLayout from "@/layouts/app-layout";

export default function BuyBook() {
  return (
    <div>buy-book</div>
  )
}

BuyBook.layout = (page) => (
    <AppLayout children={page} title="Order Book" />
);
