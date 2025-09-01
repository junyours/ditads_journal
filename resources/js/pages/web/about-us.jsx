import WebLayout from "@/layouts/web-layout";
import AboutUsBanner from "../../../../public/images/about-us-banner.png";
import { Head } from "@inertiajs/react";

const banners = [AboutUsBanner];

export default function AboutUs() {
    return (
        <>
            <Head title="About Us" />

            <div className="max-w-7xl mx-auto break-words space-y-4 p-4">
                <h1 className="text-center font-semibold">
                    Zas The Digital Institute Training and Development Services
                    (DIT.ADS) offers the following services: Research
                    Consultant, Statistics and Data Analyst, Feasibility Studies
                    Consultant, Operations/Systems Analyst, Business Planning,
                    and Seminar/Training/Workshops to equip clients with the
                    necessary skills while promoting fulfillment in their
                    undertakings.
                </h1>
                <div className="space-y-4">
                    <h1 className="font-medium text-primary">History</h1>
                    <p className="text-sm text-justify">
                        Neilson and Wilson made up the name zas Digital
                        Institute Training and Development Services (DIT.ADS) on
                        June 19, 2019. The concept of the business started when
                        Neilson, the son, and Wilson, the father attended the
                        Seminar on Research held at Davao City. The two (Neilson
                        and Wilson) together with the support of the family
                        members envisioned to help the students and teachers in
                        the city of Cagayan de Oro and those who find difficulty
                        in engaging research especially when a research paper
                        required the use of descriptive and inferential
                        statistical tools. The pioneered also anticipated that
                        in the coming years digital training for research will
                        be in demand and could be easily learned by anybody
                        interested in research through the use of Statistical
                        Package for the Social Sciences (SPSS) software. SPSS is
                        software for editing and analyzing all sorts of data.
                        The pioneering leaders of the business firmly believed
                        in the concept that “Research and development (R&D) is a
                        valuable tool for growing and improving the individual
                        and the business. R&D involves researching the market
                        and the customer needs and developing new and improved
                        products and services to fit these needs. Businesses
                        that have an R&D strategy have a greater chance of
                        success than businesses that don’t. An R&D strategy can
                        lead to innovation and increased productivity and can
                        boost the business’s competitive advantage.”
                    </p>
                </div>
                <div className="space-y-4">
                    <h1 className="font-medium text-primary">
                        Business Profile
                    </h1>
                    <p className="text-sm text-justify">
                        Zas DIGITAL INSTITUTE TRAINING AND DEVELOPMENT SERVICES
                        (DIT.ADS) provides Management, Marketing, Finance,
                        Accounting, Real Estate, Environmental Planning,
                        Production Planning, Data Analysis, Data Interpretation,
                        Academic and Business Research, Hospitality consultancy,
                        and Training services. It also offers customized
                        training sessions to students, managers, and company
                        owners.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <h1 className="font-medium text-primary">Vision</h1>
                        <p className="text-sm text-justify">
                            To be the leading research institute in Mindanao by
                            2030.” To create dependable management, marketing,
                            finance, accounting, hospitality consultancy
                            business, and training services that provide
                            employment and business opportunities to common and
                            highly respected people in the community.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h1 className="font-medium text-primary">Mission</h1>
                        <p className="text-sm text-justify">
                            To provide customized training services in the
                            fields of Management, Marketing, Finance,
                            Accounting, Real Estate, Environmental Planning,
                            Production Planning, Data Analysis, and Data
                            Interpretation, Academic and Business Research,
                            Hospitality consultancy, and Training services. To
                            empower the firms and workers in their respective
                            fields and to enhance their potentials that add
                            value to their endeavors and businesses.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

AboutUs.layout = (page) => <WebLayout children={page} banners={banners} />;
