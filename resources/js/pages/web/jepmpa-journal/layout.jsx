import WebLayout from "@/layouts/web-layout";
import JournalBanner from "../../../../../public/images/jebmpa-banner.png";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { usePage } from "@inertiajs/react";
import EditorialBoard from "./editorial-board";
import AboutJournal from "./about-journal";
import AimScope from "./aim-scope";
import AboutPublisher from "./about-publisher";
import SubmissionGuideline from "./submission-guideline";
import ResearchEthics from "./research-ethics";
import Download from "./download";
import ReviewProcess from "./review-process";
import IndexAbstract from "./index-abstract";
import ResearchJournal from "./research-journal";

const banners = [JournalBanner];

export default function JournalLayout() {
    const { editors } = usePage().props;

    const contents = [
        {
            title: "About the Journal",
            page: AboutJournal,
        },
        {
            title: "Aims and Scope",
            page: AimScope,
        },
        {
            title: "About the Publisher",
            page: AboutPublisher,
        },
        {
            title: "Submission Guidelines",
            page: SubmissionGuideline,
        },
        {
            title: "Research Ethics",
            page: ResearchEthics,
        },
        {
            title: "Downloads",
            page: Download,
        },
        {
            title: "Review Process",
            page: ReviewProcess,
        },
        {
            title: "Indexing and Abstracting",
            page: IndexAbstract,
        },
        {
            title: "Editorial Board",
            page: EditorialBoard,
            props: { editors },
        },
        {
            title: "Research Journal",
            page: ResearchJournal,
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <Accordion type="single" collapsible>
                {contents.map((content, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{content.title}</AccordionTrigger>
                        <AccordionContent>
                            <content.page {...(content.props || {})} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

JournalLayout.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
