
import WebLayout from "@/layouts/web-layout";
import JournalBanner from "../../../../../public/images/journal-banner.png";
import PDF from "../../../../../public/images/pdf.png";
import { Head, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    ArrowUpRight,
    BookOpen,
    CalendarDays,
    FileText,
    Globe,
    Hash,
    UserRound,
} from "lucide-react";

const banners = [JournalBanner];

export default function ViewJournal() {
    const { journal } = usePage().props;

    const publishedDate = journal.published_at
        ? new Date(journal.published_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
          })
        : "Not specified";

    const doiUrl = journal.doi
        ? `https://doi.org/${journal.doi.replace(
              /^https?:\/\/(dx\.)?doi\.org\//,
              ""
          )}`
        : null;

    const pdfUrl = journal.pdf_file
        ? `/IMRJ/${journal.pdf_file}`
        : null;

    const details = [
        {
            label: "Author/s",
            value: journal.author,
            icon: UserRound,
        },
        {
            label: "Country",
            value: journal.country,
            icon: Globe,
        },
        {
            label: "Volume",
            value: journal.volume,
            icon: BookOpen,
        },
        {
            label: "Issue",
            value: journal.issue,
            icon: Hash,
        },
        {
            label: "Published",
            value: publishedDate,
            icon: CalendarDays,
        },
        {
            label: "Page number",
            value: journal.page_number,
            icon: FileText,
        },
    ];

    return (
        <>
            <Head title={journal.title || "Journal Article"} />

            <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <BookOpen className="size-4" />
                        <span>Journal Publication</span>
                    </div>

                    <div className="space-y-3">
                        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                            Research Article
                        </span>

                        <h1 className="max-w-4xl text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                            {journal.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                            <span>
                                {journal.author || "Author not specified"}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>{publishedDate}</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-6">
                        <section className="rounded-xl border bg-card p-5 shadow-sm sm:p-7">
                            <div className="mb-5 flex items-center gap-2">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                                    <FileText className="size-4 text-primary" />
                                </div>

                                <h2 className="text-lg font-bold">
                                    Abstract
                                </h2>
                            </div>

                            {journal.abstract ? (
                                <div
                                    className="whitespace-pre-line text-justify text-sm leading-8 text-muted-foreground [&_span]:font-semibold [&_span]:text-foreground"
                                    dangerouslySetInnerHTML={{
                                        __html: journal.abstract.replace(
                                            /(Aims:|Methodology:|Study Design:|Results?:|Conclusion:|Keywords?:)/g,
                                            '<span class="font-semibold">$1</span>'
                                        ),
                                    }}
                                />
                            ) : (
                                <p className="text-sm italic text-muted-foreground">
                                    No abstract is available for this publication.
                                </p>
                            )}
                        </section>

                        {doiUrl && (
                            <section className="rounded-xl border bg-card p-5 shadow-sm">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0 space-y-1">
                                        <p className="text-sm font-semibold">
                                            Digital Object Identifier (DOI)
                                        </p>

                                        <p className="break-all text-sm text-muted-foreground">
                                            {doiUrl}
                                        </p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <a
                                            href={doiUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Visit DOI
                                            <ArrowUpRight className="ml-2 size-4" />
                                        </a>
                                    </Button>
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="space-y-5">
                        <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                            <div className="border-b bg-muted/40 px-5 py-4">
                                <h2 className="font-bold">
                                    Publication Details
                                </h2>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Information about this article
                                </p>
                            </div>

                            <div className="divide-y px-5">
                                {details.map((detail) => {
                                    const Icon = detail.icon;

                                    return (
                                        <div
                                            key={detail.label}
                                            className="flex gap-3 py-4"
                                        >
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                                                <Icon className="size-4 text-muted-foreground" />
                                            </div>

                                            <div className="min-w-0 space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    {detail.label}
                                                </p>

                                                <p className="break-words text-sm font-semibold text-foreground">
                                                    {detail.value || "Not specified"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="rounded-xl border bg-card p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                                    <FileText className="size-5 text-primary" />
                                </div>

                                <div>
                                    <h2 className="font-bold">
                                        Full Article
                                    </h2>

                                    <p className="text-xs text-muted-foreground">
                                        Read the complete publication
                                    </p>
                                </div>
                            </div>

                            {pdfUrl ? (
                                <Button className="w-full" asChild>
                                    <a
                                        href={pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={PDF}
                                            alt=""
                                            className="mr-2 size-4"
                                        />
                                        PDF Open Access
                                        <ArrowUpRight className="ml-auto size-4" />
                                    </a>
                                </Button>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    PDF is currently unavailable.
                                </p>
                            )}

                            <p className="mt-3 text-center text-xs text-muted-foreground">
                                PDF access is subject to publication availability.
                            </p>
                        </section>
                    </aside>
                </div>
            </div>
        </>
    );
}

ViewJournal.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
