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
import { Head, usePage } from "@inertiajs/react";
import AboutPublisher from "./about-publisher";
import IndexAbstract from "./index-abstract";
import Download from "./download";
import Certificate from "./certificate";
import ResearchEthics from "./research-ethics";
import SDG from "../../../../../public/images/SDG.png";

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
        <>
            <Head title="Research Journal IMRJ" />

            <div className="container mx-auto p-4 flex gap-4 max-lg:flex-col-reverse">
                <div className="flex-1">
                    <Accordion type="single" collapsible>
                        {contents.map((content, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger>
                                    {content.title}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <content.page {...(content.props || {})} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                <div className="h-fit w-full border sm:flex lg:max-w-96 lg:flex-col">
                    <div className="flex items-center justify-center">
                        <img
                            src={SDG}
                            alt="sdg-logo"
                            className="object-contain"
                        />
                    </div>
                    <p className="text-justify p-4 text-sm">
                        <span className="font-semibold">
                            Sustainability Commitment Statement
                        </span>
                        : All journals published under DIT.ADS International
                        Multidisciplinary Research Journal (DIT.ADS IMRJ) are
                        fully aligned with the 17 Sustainable Development Goals
                        (SDGs) of the United Nations. We actively encourage and
                        prioritize research that contributes to addressing
                        global challenges such as poverty eradication, quality
                        education, climate action, clean energy, sustainable
                        communities, responsible consumption, and partnerships
                        for the goals. By embedding the SDGs into our
                        publication framework, we ensure that our journals serve
                        as platforms for knowledge that transforms society,
                        promotes inclusive growth, and advances global
                        sustainability.
                    </p>
                </div>
            </div>
        </>
    );
}

JournalLayout.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
