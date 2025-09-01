import WebLayout from "@/layouts/web-layout";
import MagazineBanner from "../../../../../public/images/magazine-banner.png";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import AimScope from "./aim-scope";
import ReviewProcess from "./review-process";
import EditorialBoard from "./editorial-board";
import Magazine from "./magazine";
import { Head, usePage } from "@inertiajs/react";
import AboutMagazine from "./about-magazine";
import AboutPublisher from "./about-publisher";
import AboutLogo from "./about-logo";
import OriginMagazine from "./origin-magazine";
import ApplicationContent from "./application-content";

const banners = [MagazineBanner];

export default function MagazineLayout() {
    const { editors, magazines, archives, activeVolume, activeIssue } =
        usePage().props;

    const contents = [
        {
            title: "About the Magazine",
            page: AboutMagazine,
        },
        {
            title: "About the Logo",
            page: AboutLogo,
        },
        {
            title: "Origin of the Magazine",
            page: OriginMagazine,
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
            title: "Review Process",
            page: ReviewProcess,
        },
        {
            title: "Application as Content Editors / Reviewers",
            page: ApplicationContent,
        },
        {
            title: "Editorial Board",
            page: EditorialBoard,
            props: { editors },
        },
        {
            title: "Published Magazine",
            page: Magazine,
            props: { magazines, archives, activeVolume, activeIssue },
        },
    ];

    return (
        <>
            <Head title="Magazine" />

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
        </>
    );
}

MagazineLayout.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
