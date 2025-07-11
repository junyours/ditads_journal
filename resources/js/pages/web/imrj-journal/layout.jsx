import WebLayout from "@/layouts/web-layout";
import JournalBanner from "../../../../../public/images/journal-banner.png";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import AboutJournal from "./about-journal";
import AimScope from "./aim-scope";
import SubmissionGuideline from "./submission-guideline";
import ReviewProcess from "./review-process";
import EditorialBoard from "./editorial-board";
import ResearchJournal from "./research-journal";
import { usePage } from "@inertiajs/react";
import AboutPublisher from "./about-publisher";
import IndexAbstract from "./index-abstract";
import Download from "./download";
import Certificate from "./certificate";
import ResearchEthics from "./research-ethics";

const banners = [JournalBanner];

export default function JournalLayout() {
    const { editors, journals, archives, activeVolume, activeIssue } =
        usePage().props;

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
            title: "Certificates",
            page: Certificate,
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
            props: { journals, archives, activeVolume, activeIssue },
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
