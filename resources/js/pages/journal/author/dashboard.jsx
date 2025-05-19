import AppLayout from "@/layouts/app-layout";

export default function Dashboard() {
    return <div>dashboard</div>;
}

Dashboard.layout = (page) => <AppLayout children={page} title="Dashboard" />;
