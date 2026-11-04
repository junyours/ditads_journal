import WebLayout from "@/layouts/web-layout";
import DitadsBanner from "../../../../public/images/ditads-banner.png";
import JournalBanner from "../../../../public/images/journal-banner.png";
import MagazineBanner from "../../../../public/images/magazine-banner.png";
import JEBMPABanner from "../../../../public/images/jebmpa-banner.png";
import { Head } from "@inertiajs/react";
import {
    ArrowDown,
    ArrowRight,
    BookOpen,
    BriefcaseBusiness,
    ChartNoAxesCombined,
    GraduationCap,
    Microscope,
    Target,
    CalendarDays,
    Building2,
    Lightbulb,
} from "lucide-react";

const banners = [DitadsBanner, MagazineBanner, JournalBanner, JEBMPABanner];

const services = [
    {
        icon: Microscope,
        title: "Research Consultancy",
    },
    {
        icon: ChartNoAxesCombined,
        title: "Statistics and Data Analysis",
    },
    {
        icon: Building2,
        title: "Feasibility Studies",
    },
    {
        icon: BriefcaseBusiness,
        title: "Business Planning",
    },
    {
        icon: GraduationCap,
        title: "Seminars and Training",
    },
    {
        icon: BookOpen,
        title: "Academic and Business Research",
    },
];

export default function Welcome() {
    return (
        <>
            <Head title="Welcome">
                <meta
                    name="description"
                    content="DIT.ADS provides research consultancy, statistics and data analysis, feasibility studies, business planning, seminars, and workshops in Cagayan de Oro and beyond."
                />
            </Head>

            <main className="bg-background">
                {/* Hero */}
                <section className="relative isolate overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background" />

                    <div className="container mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
                        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="max-w-2xl">
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    Research • Training • Development
                                </div>

                                <h1 className="text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
                                    ZAS DIGITAL INSTITUTE{" "}
                                    <span className="text-primary">
                                        TRAINING AND DEVELOPMENT SERVICES
                                    </span>
                                </h1>

                                <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground">
                                    Empowering individuals and organizations
                                    through research, professional consultancy,
                                    data analysis, and customized training
                                    programs.
                                </p>

                                <div className="mt-9 flex flex-wrap items-center gap-4">
                                    <a
                                        href="#about"
                                        className="inline-flex items-center gap-3 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
                                    >
                                        Discover DIT.ADS
                                        <ArrowRight className="h-4 w-4" />
                                    </a>

                                    <a
                                        href="#services"
                                        className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-semibold transition hover:text-primary"
                                    >
                                        Explore Services
                                        <ArrowDown className="h-4 w-4" />
                                    </a>
                                </div>

                                <div className="mt-12 flex items-center gap-5 border-t pt-7">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <CalendarDays className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold">
                                            Established June 19, 2019
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Founded by Neilson and Wilson
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -inset-5 rounded-[2rem] bg-primary/10 blur-3xl" />

                                <div className="relative overflow-hidden rounded-2xl border bg-card p-2 shadow-2xl">
                                    <img
                                        src={DitadsBanner}
                                        alt="DIT.ADS"
                                        className="h-[320px] w-full rounded-xl object-cover sm:h-[440px]"
                                    />
                                </div>

                                <div className="absolute -bottom-6 -left-5 hidden rounded-xl border bg-card p-5 shadow-xl sm:block md:-left-10">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Target className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black">
                                                2030
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Our Vision Target
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About */}
                <section
                    id="about"
                    className="border-y bg-muted/30 py-16 md:py-24"
                >
                    <div className="container mx-auto max-w-7xl px-4 md:px-8">
                        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                                    About the Institute
                                </p>

                                <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                                    Knowledge That Creates Opportunities.
                                </h2>

                                <div className="mt-6 h-1 w-16 rounded-full bg-primary" />
                            </div>

                            <div className="space-y-5 text-sm leading-8 text-muted-foreground sm:text-base">
                                <p>
                                    DIT.ADS (Digital Institute Training and
                                    Development Services), founded by Neilson
                                    and Wilson on June 19, 2019, provides a
                                    wide range of services, including research
                                    consultancy, statistics and data analysis,
                                    feasibility studies, business planning, and
                                    seminars and workshops.
                                </p>

                                <p>
                                    The institute was born out of a vision to
                                    help students and teachers in Cagayan de Oro
                                    with research, particularly when using
                                    descriptive and inferential statistical
                                    tools like SPSS software.
                                </p>

                                <p>
                                    DIT.ADS offers specialized services in
                                    Management, Marketing, Finance, Accounting,
                                    Real Estate, Environmental Planning, Data
                                    Analysis, Academic and Business Research,
                                    and Hospitality Consultancy, along with
                                    customized training sessions for students,
                                    managers, and business owners.
                                </p>

                                <p>
                                    Its mission is to empower firms and
                                    individuals across these fields to enhance
                                    their potential and add value to their
                                    endeavors. By 2030, DIT.ADS aims to be the
                                    leading research institute in Mindanao,
                                    fostering employment and business
                                    opportunities while contributing to the
                                    growth of various sectors.
                                </p>

                                <p>
                                    Additionally, DIT.ADS is a recognized
                                    publisher of educational content,
                                    supporting research, development, and
                                    training initiatives.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section
                    id="services"
                    className="container mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24"
                >
                    <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                                What We Do
                            </p>
                            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                                Our Core Services
                            </h2>
                        </div>

                        <p className="max-w-md text-sm leading-7 text-muted-foreground">
                            Providing professional support and development
                            opportunities across academic, business, and
                            organizational fields.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => {
                            const Icon = service.icon;

                            return (
                                <div
                                    key={service.title}
                                    className="group flex items-center gap-5 rounded-xl border bg-card p-5 transition duration-300 hover:border-primary/40 hover:bg-primary/[0.03]"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="mb-1 text-xs font-semibold text-primary">
                                            0{index + 1}
                                        </p>
                                        <h3 className="font-semibold">
                                            {service.title}
                                        </h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Publications */}
                <section className="bg-muted/30 py-16 md:py-24">
                    <div className="container mx-auto max-w-7xl px-4 md:px-8">
                        <div className="mb-10 text-center">
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                                Our Publications
                            </p>

                            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                                Sharing Knowledge and Research
                            </h2>

                            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                                Discover our publications and explore the
                                research, ideas, and educational content we
                                share with our community.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            {[
                                {
                                    title: "DIT.ADS Magazine",
                                    image: MagazineBanner,
                                    description:
                                        "Explore our magazine and its published editions.",
                                    href: "/magazine",
                                },
                                {
                                    title: "IMRJ Journal",
                                    image: JournalBanner,
                                    description:
                                        "Discover multidisciplinary research and scholarly works.",
                                    href: "/research-journal/imrj",
                                },
                                {
                                    title: "JEBMPA Journal",
                                    image: JEBMPABanner,
                                    description:
                                        "Explore research in economics, business management, and public administration.",
                                    href: "/research-journal/jebmpa",
                                },
                            ].map((publication) => (
                                <a
                                    key={publication.title}
                                    href={publication.href}
                                    className="group overflow-hidden rounded-xl border bg-card transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={publication.image}
                                            alt={publication.title}
                                            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-lg font-bold">
                                            {publication.title}
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {publication.description}
                                        </p>

                                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                                            Explore
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission and Vision */}
                <section className="container mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border bg-card p-8 md:p-10">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Target className="h-6 w-6" />
                            </div>

                            <h2 className="mt-6 text-2xl font-bold">
                                Our Mission
                            </h2>

                            <p className="mt-4 text-sm leading-8 text-muted-foreground">
                                To provide customized training sessions and
                                dependable consultancy services that empower
                                firms and individuals, enhance their potential,
                                and add value to their endeavors across various
                                academic and professional disciplines.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-primary p-8 text-primary-foreground md:p-10">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                                <Lightbulb className="h-6 w-6" />
                            </div>

                            <h2 className="mt-6 text-2xl font-bold">
                                Our Vision
                            </h2>

                            <p className="mt-4 text-sm leading-8 text-primary-foreground/85">
                                To become the leading research institute in
                                Mindanao by 2030, providing dependable
                                consultancy, business, and training services
                                while fostering employment and business
                                opportunities.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="container mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
                    <div className="relative overflow-hidden rounded-2xl bg-foreground px-6 py-12 text-background sm:px-12 md:py-16">
                        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border-[40px] border-background/5" />

                        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
                            <div className="max-w-xl">
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground/60">
                                    Let's Work Together
                                </p>

                                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                                    Have a Project or Research in Mind?
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-background/70">
                                    Connect with DIT.ADS and discover how our
                                    research, consultancy, and training
                                    services can support your goals.
                                </p>
                            </div>

                            <a
                                href="/contact-us"
                                className="inline-flex shrink-0 items-center justify-center gap-3 rounded-lg bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                            >
                                Contact Us
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

Welcome.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);