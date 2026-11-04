import WebLayout from "@/layouts/web-layout";
import AboutUsBanner from "../../../../public/images/about-us-banner.png";

import { Head } from "@inertiajs/react";

import {
    BookOpen,
    Target,
    Lightbulb,
    Building2,
    GraduationCap,
    ChartNoAxesCombined,
    BriefcaseBusiness,
    Users,
    CalendarDays,
    Microscope,
    ArrowRight,
    Award,
    Quote,
} from "lucide-react";

const banners = [AboutUsBanner];

const services = [
    {
        icon: Microscope,
        title: "Research Consultancy",
        description:
            "Professional assistance in academic and business research.",
    },
    {
        icon: ChartNoAxesCombined,
        title: "Statistics and Data Analysis",
        description:
            "Statistical analysis, data interpretation, and SPSS training.",
    },
    {
        icon: BriefcaseBusiness,
        title: "Business Planning",
        description:
            "Business planning, feasibility studies, and strategic development.",
    },
    {
        icon: Building2,
        title: "Operations and Systems Analysis",
        description:
            "Assessment and improvement of business operations and systems.",
    },
    {
        icon: GraduationCap,
        title: "Seminars and Training",
        description:
            "Customized training programs, seminars, and professional workshops.",
    },
    {
        icon: Users,
        title: "Professional Consultancy",
        description:
            "Specialized consultancy for individuals, businesses, and organizations.",
    },
];

export default function AboutUs() {
    return (
        <>
            <Head title="About Us">
                <meta
                    name="description"
                    content="Learn about Zas Digital Institute Training and Development Services (DIT.ADS), its history, business profile, vision, mission, and professional research and training services."
                />
            </Head>

            <main className="overflow-hidden bg-gray-50/70">
                {/* Hero Section */}
                <section className="relative overflow-hidden border-b bg-white">
                    <div className="absolute -right-40 -top-40 size-[450px] rounded-full bg-primary/5 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 size-[450px] rounded-full bg-primary/5 blur-3xl" />

                    <div className="container relative mx-auto px-6 py-20 md:py-28 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                <Building2 size={15} />
                                Get to Know Us
                            </span>

                            <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                                About
                                <span className="text-primary">
                                    {" "}
                                    DIT.ADS
                                </span>
                            </h1>

                            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
                                Zas Digital Institute Training and Development
                                Services (DIT.ADS) provides research
                                consultancy, statistical analysis, feasibility
                                studies, business planning, and professional
                                training services designed to equip individuals
                                and organizations with the knowledge and skills
                                needed for growth and development.
                            </p>

                            <div className="mt-10 flex flex-wrap justify-center gap-3">
                                <a
                                    href="#history"
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-1"
                                >
                                    Discover Our Story
                                    <ArrowRight size={17} />
                                </a>

                                <a
                                    href="#mission-vision"
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-7 py-3.5 text-sm font-bold text-gray-700 transition hover:border-primary hover:text-primary"
                                >
                                    Our Mission & Vision
                                </a>
                            </div>

                            <div className="mt-16 grid gap-4 sm:grid-cols-3">
                                {[
                                    {
                                        value: "2019",
                                        label: "Year Established",
                                    },
                                    {
                                        value: "Research",
                                        label: "Core Expertise",
                                    },
                                    {
                                        value: "2030",
                                        label: "Vision Target",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                                    >
                                        <h3 className="text-2xl font-black text-primary">
                                            {item.value}
                                        </h3>
                                        <p className="mt-2 text-sm font-medium text-gray-500">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* History */}
                <section
                    id="history"
                    className="scroll-mt-20 bg-gray-50 py-20 md:py-28"
                >
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="grid items-start gap-12 lg:grid-cols-12">
                            <div className="lg:col-span-4">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                    Where It All Began
                                </span>

                                <h2 className="mt-4 text-3xl font-black leading-tight text-gray-900 md:text-5xl">
                                    Our
                                    <span className="text-primary">
                                        {" "}
                                        History
                                    </span>
                                </h2>

                                <p className="mt-5 leading-8 text-gray-500">
                                    Built on a vision to make research,
                                    education, and professional development
                                    more accessible.
                                </p>

                                <div className="mt-8 rounded-2xl bg-primary p-7 text-white shadow-lg shadow-primary/20">
                                    <div className="flex size-12 items-center justify-center rounded-xl bg-white/15">
                                        <CalendarDays size={25} />
                                    </div>

                                    <p className="mt-5 text-sm font-medium text-white/70">
                                        Officially Established
                                    </p>

                                    <h3 className="mt-1 text-3xl font-black">
                                        June 19, 2019
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-white/80">
                                        Founded by Neilson and Wilson with the
                                        support and vision of their family.
                                    </p>
                                </div>
                            </div>

                            <div className="lg:col-span-8">
                                <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm md:p-10">
                                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <BookOpen size={28} />
                                    </div>

                                    <h3 className="mt-7 text-2xl font-black text-gray-900">
                                        The Beginning of DIT.ADS
                                    </h3>

                                    <div className="mt-6 space-y-5 text-justify text-sm leading-8 text-gray-600 md:text-base">
                                        <p>
                                            Neilson and Wilson established the
                                            name Zas Digital Institute Training
                                            and Development Services (DIT.ADS)
                                            on June 19, 2019. The concept of the
                                            business started when Neilson, the
                                            son, and Wilson, the father,
                                            attended a Seminar on Research held
                                            in Davao City.
                                        </p>

                                        <p>
                                            Together with the support of their
                                            family members, they envisioned
                                            helping students and teachers in
                                            Cagayan de Oro City, particularly
                                            those who experience difficulties
                                            conducting research that requires
                                            descriptive and inferential
                                            statistical tools.
                                        </p>

                                        <p>
                                            The pioneers also anticipated that
                                            digital training for research would
                                            become increasingly important and
                                            could be easily learned by anyone
                                            interested in research through
                                            software such as the Statistical
                                            Package for the Social Sciences
                                            (SPSS), which supports the editing
                                            and analysis of different types of
                                            data.
                                        </p>

                                        <div className="rounded-2xl border-l-4 border-primary bg-primary/5 p-6">
                                            <Quote
                                                size={25}
                                                className="text-primary"
                                            />

                                            <p className="mt-3 font-semibold italic leading-8 text-gray-800">
                                                "Research and development (R&D)
                                                is a valuable tool for growing
                                                and improving the individual
                                                and the business."
                                            </p>
                                        </div>

                                        <p>
                                            The pioneering leaders firmly
                                            believed that research and
                                            development can lead to innovation,
                                            increased productivity, improved
                                            services, and stronger competitive
                                            advantages. This belief continues
                                            to guide the institute's commitment
                                            to research, training, and
                                            development.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Business Profile */}
                <section className="bg-white py-20 md:py-28">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                What We Do
                            </span>

                            <h2 className="mt-4 text-3xl font-black text-gray-900 md:text-5xl">
                                Business Profile
                            </h2>

                            <p className="mt-5 text-base leading-8 text-gray-500">
                                DIT.ADS provides multidisciplinary professional
                                services designed to support individuals,
                                students, businesses, and organizations in
                                achieving their goals.
                            </p>
                        </div>

                        <div className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => {
                                const Icon = service.icon;

                                return (
                                    <div
                                        key={service.title}
                                        className="group rounded-2xl border border-gray-100 bg-gray-50 p-8 transition duration-300 hover:-translate-y-2 hover:border-primary/30 hover:bg-white hover:shadow-xl"
                                    >
                                        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                                            <Icon size={27} />
                                        </div>

                                        <h3 className="mt-7 text-lg font-bold text-gray-900">
                                            {service.title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-gray-500">
                                            {service.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-gray-100 bg-gray-50 p-7 text-center md:p-10">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Award size={25} />
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-gray-900">
                                Multidisciplinary Expertise
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-gray-500">
                                Our services cover Management, Marketing,
                                Finance, Accounting, Real Estate, Environmental
                                Planning, Production Planning, Data Analysis,
                                Data Interpretation, Academic and Business
                                Research, and Hospitality Consultancy.
                            </p>

                            <p className="mt-3 text-sm leading-7 text-gray-500">
                                We also offer customized training sessions
                                designed for students, managers, and company
                                owners.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission and Vision */}
                <section
                    id="mission-vision"
                    className="scroll-mt-20 bg-gray-50 py-20 md:py-28"
                >
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="mx-auto mb-14 max-w-2xl text-center">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                Our Direction
                            </span>

                            <h2 className="mt-4 text-3xl font-black text-gray-900 md:text-5xl">
                                Mission and Vision
                            </h2>

                            <p className="mt-5 leading-8 text-gray-500">
                                The principles that guide our commitment to
                                research, education, and professional growth.
                            </p>
                        </div>

                        <div className="grid gap-7 md:grid-cols-2">
                            {/* Vision */}
                            <div className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:p-10">
                                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Lightbulb size={32} />
                                </div>

                                <h3 className="mt-7 text-2xl font-black text-gray-900">
                                    Our Vision
                                </h3>

                                <p className="mt-5 text-sm leading-8 text-gray-600 md:text-base">
                                    To be the leading research institute in
                                    Mindanao by 2030. To create dependable
                                    management, marketing, finance,
                                    accounting, hospitality consultancy,
                                    business, and training services that
                                    provide employment and business
                                    opportunities to common and highly
                                    respected people in the community.
                                </p>

                                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary">
                                    <Target size={18} />
                                    Leading Research Institute by 2030
                                </div>
                            </div>

                            {/* Mission */}
                            <div className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:p-10">
                                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Target size={32} />
                                </div>

                                <h3 className="mt-7 text-2xl font-black text-gray-900">
                                    Our Mission
                                </h3>

                                <p className="mt-5 text-sm leading-8 text-gray-600 md:text-base">
                                    To provide customized training services in
                                    the fields of Management, Marketing,
                                    Finance, Accounting, Real Estate,
                                    Environmental Planning, Production
                                    Planning, Data Analysis, Data
                                    Interpretation, Academic and Business
                                    Research, Hospitality Consultancy, and
                                    Training services.
                                </p>

                                <p className="mt-4 text-sm leading-8 text-gray-600 md:text-base">
                                    To empower firms and workers in their
                                    respective fields and enhance their
                                    potentials to add value to their endeavors
                                    and businesses.
                                </p>

                                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary">
                                    <GraduationCap size={19} />
                                    Empowering People and Businesses
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-primary py-20 md:py-24">
                    <div className="container mx-auto px-6 text-center lg:px-8">
                        <div className="mx-auto max-w-3xl">
                            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white">
                                <GraduationCap size={32} />
                            </div>

                            <h2 className="mt-7 text-3xl font-black leading-tight text-white md:text-5xl">
                                Grow Your Knowledge. Develop Your Potential.
                            </h2>

                            <p className="mt-5 leading-8 text-white/80">
                                Let DIT.ADS support your research, professional
                                development, and business goals through
                                reliable consultancy and customized training
                                services.
                            </p>

                            <a
                                href="mailto:ditads@infosheet.dev"
                                className="mt-9 inline-flex items-center gap-3 rounded-lg bg-white px-8 py-4 text-sm font-bold text-primary shadow-xl transition hover:-translate-y-1 hover:bg-gray-100"
                            >
                                Get in Touch
                                <ArrowRight size={18} />
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

AboutUs.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);