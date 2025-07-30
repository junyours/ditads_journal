import AccountLayout from "@/layouts/book/account-layout";
import CustomerLayout from "@/layouts/customer-layout";

export default function Order() {
    return <div className="p-4">

    </div>;
}

Order.layout = (page) => (
    <CustomerLayout>
        <AccountLayout children={page} />
    </CustomerLayout>
);
