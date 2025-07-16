import AccountLayout from "@/layouts/book/account-layout";
import CustomerLayout from "@/layouts/customer-layout";

export default function Profile() {
    return <div>my-account</div>;
}

Profile.layout = (page) => (
    <CustomerLayout>
        <AccountLayout children={page} />
    </CustomerLayout>
);
