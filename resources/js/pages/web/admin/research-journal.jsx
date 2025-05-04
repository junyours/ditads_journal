import AppLayout from "@/layouts/app-layout";

export default function ResearchJournal() {
    return <div>research-journal</div>;
}

ResearchJournal.layout = (page) => (
    <AppLayout children={page} title="List of Research Journals" />
);
