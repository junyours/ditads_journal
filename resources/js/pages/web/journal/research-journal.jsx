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
            <AccordionItem value="item-1">
                <AccordionTrigger className="hover:no-underline">
                    <h1>{journal.title}</h1>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <h1 className="font-medium">Author/s:</h1>
                            <p className="italic">{journal.author}</p>
                        </div>
                        <div className="flex max-sm:flex-col sm:gap-2 whitespace-nowrap">
                            <h1 className="font-medium">Volume & Issue:</h1>
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
                            <h1 className="font-medium">Abstract:</h1>
                            <p className="text-justify whitespace-pre-line">{journal.abstract}</p>
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
