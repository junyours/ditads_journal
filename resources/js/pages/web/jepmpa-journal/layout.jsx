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

const banners = [JournalBanner];

export default function JournalLayout() {
    const { editors } = usePage().props;

    const contents = [
        {
            title: "About the Journal",
            page: AboutJournal,
        },
        {
            title: "Editorial Board",
            page: EditorialBoard,
            props: { editors },
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
