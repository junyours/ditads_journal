import AppLayout from "@/layouts/app-layout";

export default function JEPMPA() {
    return <div>jepmpa</div>;
}

JEPMPA.layout = (page) => (
    <AppLayout
        children={page}
        title="List of DIT.ADS Journal of Economics, Business Management, and Public Administration"
    />
);
