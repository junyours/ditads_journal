import WebLayout from "@/layouts/web-layout";
import DitadsBanner from "../../../../public/images/ditads-banner.svg";
import JournalBanner from "../../../../public/images/journal-banner.png";
import MagazineBanner from "../../../../public/images/magazine-banner.png";
import JEBMPABanner from "../../../../public/images/jebmpa-banner.png";
import { Head } from "@inertiajs/react";

const banners = [DitadsBanner, MagazineBanner, JournalBanner, JEBMPABanner];

export default function Welcome() {
    return (
        <>
            <Head title="Welcome | ZAS Digital Institute Training and Development Services">
                <meta
                    name="description"
                    content="DIT.ADS provides research consultancy, statistics and data analysis, feasibility studies, business planning, seminars, and workshops in Cagayan de Oro and beyond."
                />
                <meta
                    property="og:title"
                    content="ZAS Digital Institute Training and Development Services"
                />
                <meta
                    property="og:description"
                    content="Empowering students, teachers, and businesses through research, consultancy, training, and development services."
                />
                <meta property="og:type" content="website" />
            </Head>
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-center font-black text-4xl text-primary">
                    ZAS DIGITAL INSTITUTE TRAINING AND DEVELOPMENT SERVICES
                </h1>
                <br />
                <p className="text-justify">
                    DIT.ADS (Digital Institute Training and Development
                    Services), founded by Neilson and Wilson on June 19, 2019,
                    provides a wide range of services, including research
                    consultancy, statistics and data analysis, feasibility
                    studies, business planning, and seminars/workshops. The
                    institute was born out of a vision to help students and
                    teachers in Cagayan de Oro with research, particularly when
                    using descriptive and inferential statistical tools like
                    SPSS software. DIT.ADS offers specialized services in
                    Management, Marketing, Finance, Accounting, Real Estate,
                    Environmental Planning, Data Analysis, Academic and Business
                    Research, and Hospitality Consultancy, along with customized
                    training sessions for students, managers, and business
                    owners. Its mission is to empower firms and individuals
                    across these fields to enhance their potential and add value
                    to their endeavors. By 2030, DIT.ADS aims to be the leading
                    research institute in Mindanao, fostering employment and
                    business opportunities while contributing to the growth of
                    various sectors. Additionally, DIT.ADS is a recognized
                    publisher of educational content, supporting research,
                    development, and training initiatives.
                </p>
            </div>
        </>
    );
}

Welcome.layout = (page) => <WebLayout children={page} banners={banners} />;
