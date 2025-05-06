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
import { usePage } from "@inertiajs/react";

const banners = [MagazineBanner];

export default function MagazineLayout() {
    const { editors, magazines } = usePage().props;

    const contents = [
        {
            title: "Aims and Scope",
            page: AimScope,
        },
        {
            title: "Review Process",
            page: ReviewProcess,
        },
        {
            title: "Editorial Board",
            page: EditorialBoard,
            props: { editors },
        },
        {
            title: "Magazine",
            page: Magazine,
            props: { magazines },
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

MagazineLayout.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
