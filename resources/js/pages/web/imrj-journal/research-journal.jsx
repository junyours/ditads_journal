import PDF from "../../../../../public/images/pdf.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { useState } from "react";
import { MoveRight } from "lucide-react";
import { router } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ResearchJournal({
    journals,
    archives,
    activeVolume,
    activeIssue,
}) {
    const [open, setOpen] = useState(false);
    const [journal, setJournal] = useState(null);
    const [selectedArchive, setSelectedArchive] = useState({
        volume: activeVolume,
        issue: activeIssue,
    });

    const handleOpen = (journal = null) => {
        if (journal) {
            setJournal(journal);
        } else {
            setJournal(null);
        }
        setOpen(!open);
    };

    const handleArchiveClick = (volume, issue) => {
        setSelectedArchive({ volume, issue });
        router.get(
            "/research-journal/imrj",
            { volume, issue },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    return (
        <>
            <div className="flex gap-4">
                <div className="space-y-4 flex-1">
                    <h1 className="font-semibold">
                        Volume {selectedArchive.volume}, Issue{" "}
                        {selectedArchive.issue}
                    </h1>
                    <div className="mx-1 lg:hidden">
                        <Select>
                            <SelectTrigger className="max-w-[300px]">
                                <SelectValue placeholder="Select Volume and Issue" />
                            </SelectTrigger>
                            <SelectContent>
                                {archives.map((archive, index) => (
                                    <SelectItem
                                        key={index}
                                        onClick={() =>
                                            handleArchiveClick(
                                                archive.volume,
                                                archive.issue
                                            )
                                        }
                                        value={archive.label}
                                    >
                                        {archive.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {journals.map((journal, index) => (
                        <div key={index} className="space-y-2 sm:px-2">
                            <div className="space-y-1">
                                <h1 className="text-blue-600 font-medium uppercase">
                                    {journal.title}
                                </h1>
                                <p className="italic text-xs">
                                    {journal.author}
                                </p>
                                <p className="text-xs font-medium">
                                    Country: {journal.country}
                                </p>
                                <div className="flex gap-1 text-xs font-medium">
                                    <p>Volume: {journal.volume},</p>
                                    <p>Issue: {journal.issue},</p>
                                    <p>
                                        {new Date(
                                            journal.published_at
                                        ).toLocaleString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <p className="text-xs font-medium">
                                    Page No.: {journal.page_number}
                                </p>
                                <p className="text-xs font-medium">
                                    DOI:{" "}
                                    <a
                                        href={journal.doi}
                                        target="_blank"
                                        className="hover:underline"
                                    >
                                        {journal.doi}
                                    </a>
                                </p>
                            </div>
                            <p className="line-clamp-3 text-justify text-muted-foreground">
                                {journal.abstract}
                            </p>
                            <div className="flex items-center">
                                <Button
                                    onClick={() => handleOpen(journal)}
                                    size="sm"
                                    variant="ghost"
                                >
                                    Read full text
                                    <MoveRight />
                                </Button>
                                <a
                                    href={`/IMRJ/${journal.pdf_file}`}
                                    target="_blank"
                                >
                                    <Button size="sm" variant="ghost">
                                        PDF open access
                                        <img src={PDF} className="size-4" />
                                    </Button>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full max-w-[300px] border h-fit p-4 rounded-lg space-y-4 hidden lg:block">
                    <h1 className="font-semibold">Quarterly Archive</h1>
                    <div>
                        {archives.map((archive, index) => (
                            <Button
                                onClick={() =>
                                    handleArchiveClick(
                                        archive.volume,
                                        archive.issue
                                    )
                                }
                                key={index}
                                size="sm"
                                variant="ghost"
                                className="justify-start text-wrap w-full"
                            >
                                {archive.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <Sheet open={open} onOpenChange={() => handleOpen()}>
                <SheetContent
                    side="bottom"
                    className="h-full overflow-y-auto space-y-4 text-sm"
                >
                    <SheetHeader>
                        <h1 className="text-blue-600 font-medium uppercase">
                            {journal?.title}
                        </h1>
                    </SheetHeader>
                    <div className="sm:flex gap-1">
                        <p className="font-bold">Author/s:</p>
                        <p>{journal?.author}</p>
                    </div>
                    <div className="sm:flex gap-1">
                        <p className="font-bold">Country:</p>
                        <p>{journal?.country}</p>
                    </div>
                    <div className="sm:flex gap-1">
                        <p className="font-bold">Volume & Issue:</p>
                        <div className="sm:flex gap-1 font-medium">
                            <p>Volume: {journal?.volume},</p>
                            <p>Issue: {journal?.issue},</p>
                            <p>
                                {new Date(journal?.published_at).toLocaleString(
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
                        <p>{journal?.page_number}</p>
                    </div>
                    <div className="sm:flex gap-1">
                        <p className="font-bold">DOI:</p>
                        <a
                            href={journal?.doi}
                            target="_blank"
                            className="hover:underline"
                        >
                            {journal?.doi}
                        </a>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold">Abstract:</h1>
                        <p
                            className="text-justify whitespace-pre-line sm:px-2"
                            dangerouslySetInnerHTML={{
                                __html: journal?.abstract.replace(
                                    /(Aims:|Methodology:|Study Design:|Results?:|Conclusion:|Keywords?:)/g,
                                    '<span class="font-semibold">$1</span>'
                                ),
                            }}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
