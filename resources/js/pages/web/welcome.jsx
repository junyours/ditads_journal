import WebLayout from "@/layouts/web-layout";
import DitadsBanner from "../../../../public/images/ditads-banner.png";
import JournalBanner from "../../../../public/images/journal-banner.png";
import MagazineBanner from "../../../../public/images/magazine-banner.png";

const banners = [DitadsBanner, JournalBanner, MagazineBanner];

export default function Welcome() {
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-center font-black text-4xl text-primary">
                DIGITAL INSTITUTE TRAINING AND DEVELOPMENT SERVICES
            </h1>
            <br />
            <p className="text-justify">
                The Researcher’s Toolkit: A Step-by-Step Guidebook is a
                comprehensive resource thatequips researchers with essential
                skills and strategies for conducting effective and efficient
                research in today’s dynamic environments. In an era
                characterized by rapid technological advancements and the
                overwhelming availability of information, researchers face
                unique challenges and opportunities. This guidebook addresses
                these contemporary issues by providing practical advice,
                detailed step-by-step instructions, and illustrative examples
                tailored to the needs of modern research practices.
            </p>
        </div>
    );
}

Welcome.layout = (page) => <WebLayout children={page} banners={banners} />;
