import AppLayout from "@/layouts/app-layout";

export default function AssignDocument() {
    return <div>assign-document</div>;
}

AssignDocument.layout = (page) => (
    <AppLayout children={page} title="Assign Documents" />
);
