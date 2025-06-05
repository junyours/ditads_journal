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
        <div className="container mx-auto p-4 space-y-4">
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
            <div className="text-center">
                <a
                    href="https://ditadsresearchcenter.com/research-journal"
                    className="hover:underline"
                >
                    DIT.ADS International Multidisciplinary Research Journal
                </a>{" "}
                © 2025 by{" "}
                <a
                    href="https://ditadsresearchcenter.com"
                    className="hover:underline"
                >
                    Digital Institute Training and Development Services
                </a>{" "}
                is licensed under{" "}
                <a
                    href="https://creativecommons.org/licenses/by-sa/4.0/"
                    target="_blank"
                    className="hover:underline"
                >
                    Creative Commons Attribution-ShareAlike 4.0 International
                </a>
                <img
                    src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
                    className="w-4 h-4 inline-block ml-1"
                />
                <img
                    src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
                    className="w-4 h-4 inline-block ml-1"
                />
                <img
                    src="https://mirrors.creativecommons.org/presskit/icons/sa.svg"
                    className="w-4 h-4 inline-block ml-1"
                />
            </div>
        </div>
    );
}

JournalLayout.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
