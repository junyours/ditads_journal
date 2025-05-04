import AppLayout from "@/layouts/app-layout";

export default function Author() {
    return <div>author</div>;
}

Author.layout = (page) => <AppLayout children={page} title="List of Authors" />;
