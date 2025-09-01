import WebLayout from "@/layouts/web-layout";
import JournalBanner from "../../../../../public/images/jebmpa-banner.png";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Head, usePage } from "@inertiajs/react";
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
import SDG4 from "../../../../../public/images/SDG-4.png";

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
        // {
        //     title: "Downloads",
        //     page: Download,
        // },
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
            <Head title="Research Journal JEBMPA" />

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
                            src={SDG4}
                            alt="sdg-4-logo"
                            className="object-contain"
                        />
                    </div>
                    <p className="text-justify p-4 text-sm">
                        <span className="font-semibold">
                            Sustainability Commitment Statement
                        </span>
                        : The DIT.ADS Journal of Economics, Business Management,
                        and Public Administration (DIT.ADS JEBMPA) is firmly
                        committed to advancing the United Nations’ Sustainable
                        Development Goals, with a focused alignment on SDG 8
                        (Decent Work and Economic Growth), SDG 9 (Industry,
                        Innovation and Infrastructure), SDG 12 (Responsible
                        Consumption and Production), and SDG 17 (Partnership for
                        the Goals). The journal serves as a platform for
                        research that promotes inclusive economic development,
                        fosters innovation, advocates for sustainable business
                        and consumption practices, and strengthens collaborative
                        governance. Through this commitment, DIT.ADS JEBMPA
                        empowers scholars, practitioners, and policymakers to
                        generate knowledge that drives progress toward a more
                        resilient, sustainable, and interconnected world.
                    </p>
                </div>
            </div>
        </>
    );
}

JournalLayout.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
