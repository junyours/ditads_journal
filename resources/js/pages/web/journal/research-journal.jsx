import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import PDF from "../../../../../public/images/pdf.png";

export default function ResearchJournal({ journals }) {
    return journals.map((journal, index) => (
        <Accordion key={index} type="single" collapsible>
            <h1 className="font-semibold">
                Volume 1, Issue 1 (Current Issue) (April - June 2025)
            </h1>
            <AccordionItem value="item-1" className="sm:px-2">
                <AccordionTrigger className="hover:no-underline text-blue-600">
                    <h1>{journal.title}</h1>
                </AccordionTrigger>
                <AccordionContent className="sm:px-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <h1 className="font-bold">Author/s:</h1>
                            <p className="italic">{journal.author}</p>
                        </div>
                        <div className="flex max-sm:flex-col sm:gap-2 whitespace-nowrap">
                            <h1 className="font-bold">Volume & Issue:</h1>
                            <div className="flex gap-2">
                                <p>Volume: {journal.volume},</p>
                                <p>Issue: {journal.issue},</p>
                                <p>
                                    {new Date(
                                        journal.created_at
                                    ).toLocaleString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-bold">Abstract:</h1>
                            <p
                                className="text-justify whitespace-pre-line sm:px-2"
                                dangerouslySetInnerHTML={{
                                    __html: journal.abstract.replace(
                                        /(Aims:|Methodology:|Study Design:|Results?:|Conclusion:)/g,
                                        '<span class="font-semibold">$1</span>'
                                    ),
                                }}
                            />
                        </div>
                        <a
                            href={`/storage/journal/pdf_files/${journal.pdf_file}`}
                            target="_blank"
                            className="w-fit"
                        >
                            <div className="group flex items-center gap-2">
                                <img src={PDF} className="size-8" />
                                <span className="group-hover:underline">
                                    Read Full Document
                                </span>
                            </div>
                        </a>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ));
}
