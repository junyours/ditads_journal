import WebLayout from "@/layouts/web-layout";
import JournalBanner from "../../../../../public/images/jebmpa-banner.png";
import { Head, usePage } from "@inertiajs/react";
import PDF from "../../../../../public/images/pdf.png";
import { Button } from "@/components/ui/button";

const banners = [JournalBanner];

export default function ViewJournal() {
    const { journal } = usePage().props;

    const authors = journal.author.split(",").map((a) => a.trim());

    const pubDate = new Date(journal.published_at)
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "/");

    return (
        <>
            <Head>
                <meta name="citation_title" content={journal.title} />
                {authors.map((author, index) => (
                    <meta key={index} name="citation_author" content={author} />
                ))}
                <meta name="citation_publication_date" content={pubDate} />
                <meta name="citation_volume" content={journal.volume} />
                <meta name="citation_issue" content={journal.issue} />
                <meta
                    name="citation_journal_title"
                    content="Journal of Economics, Business Management, and Public Administration"
                />
                <meta
                    name="citation_pdf_url"
                    content={`https://ditadsresearchcenter.com/JEBMPA/${journal.pdf_file}`}
                />
            </Head>
            <div className="container mx-auto p-4 space-y-6">
                <h1 className="text-blue-600 font-medium uppercase">
                    {journal.title}
                </h1>
                <div className="sm:flex gap-1">
                    <p className="font-bold">Author/s:</p>
                    <p>{journal.author}</p>
                </div>
                <div className="sm:flex gap-1">
                    <p className="font-bold">Country:</p>
                    <p>{journal.country}</p>
                </div>
                <div className="sm:flex gap-1">
                    <p className="font-bold">Volume & Issue:</p>
                    <div className="sm:flex gap-1 font-medium">
                        <p>Volume: {journal.volume},</p>
                        <p>Issue: {journal.issue},</p>
                        <p>
                            {new Date(journal.published_at).toLocaleString(
                                "en-US",
                                {
                                    month: "long",
                                    year: "numeric",
                                }
                            )}
                        </p>
                    </div>
                </div>
                <div className="sm:flex gap-1">
                    <p className="font-bold">Page No.:</p>
                    <p>{journal.page_number}</p>
                </div>
                <div className="sm:flex gap-1">
                    <p className="font-bold">DOI:</p>
                    <a
                        href={journal.doi}
                        target="_blank"
                        className="hover:underline"
                    >
                        {journal.doi}
                    </a>
                </div>
                <div className="sm:flex gap-1 items-center">
                    <p className="font-bold">PDF:</p>
                    <a href={`/IMRJ/${journal.pdf_file}`} target="_blank">
                        <Button size="sm" variant="ghost">
                            PDF open access
                            <img src={PDF} className="size-4" />
                        </Button>
                    </a>
                </div>
                <div className="flex flex-col gap-1">
                    <h1 className="font-bold">Abstract:</h1>
                    <p
                        className="text-justify whitespace-pre-line sm:px-2"
                        dangerouslySetInnerHTML={{
                            __html: journal.abstract.replace(
                                /(Aims:|Methodology:|Study Design:|Results?:|Conclusion:|Keywords?:)/g,
                                '<span class="font-semibold">$1</span>'
                            ),
                        }}
                    />
                </div>
            </div>
        </>
    );
}

ViewJournal.layout = (page) => <WebLayout children={page} banners={banners} />;
