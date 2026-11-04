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
import ReviewProcess from "./review-process";
import IndexAbstract from "./index-abstract";
import ResearchJournal from "./research-journal";

import SDG4 from "../../../../../public/images/SDG-4.png";
import JEBMPA from "../../../../../public/images/jebmpa.png";

import { Button } from "@/components/ui/button";

import {
    BookOpen,
    Target,
    Building2,
    FileText,
    ShieldCheck,
    ClipboardCheck,
    Globe,
    Users,
    Library,
    Send,
    ArrowUpRight,
    Mail,
    Quote,
    CheckCircle2,
    BriefcaseBusiness,
    TrendingUp,
} from "lucide-react";

const banners = [JournalBanner];

export default function JournalLayout() {
    const {
        editors,
        journals,
        archives,
        activeVolume,
        activeIssue,
    } = usePage().props;

    const contents = [
        {
            title: "About the Journal",
            icon: BookOpen,
            page: AboutJournal,
        },
        {
            title: "Aims and Scope",
            icon: Target,
            page: AimScope,
        },
        {
            title: "About the Publisher",
            icon: Building2,
            page: AboutPublisher,
        },
        {
            title: "Submission Guidelines",
            icon: FileText,
            page: SubmissionGuideline,
        },
        {
            title: "Research Ethics",
            icon: ShieldCheck,
            page: ResearchEthics,
        },
        {
            title: "Review Process",
            icon: ClipboardCheck,
            page: ReviewProcess,
        },
        {
            title: "Indexing and Abstracting",
            icon: Globe,
            page: IndexAbstract,
        },
        {
            title: "Editorial Board",
            icon: Users,
            page: EditorialBoard,
            props: { editors },
        },
        {
            title: "Research Journal",
            icon: Library,
            page: ResearchJournal,
            props: {
                journals,
                archives,
                activeVolume,
                activeIssue,
            },
        },
    ];

    return (
        <>
            <Head title="DIT.ADS Journal of Economics, Business Management, and Public Administration">
                <meta
                    name="description"
                    content="Explore DIT.ADS Journal of Economics, Business Management, and Public Administration (JEBMPA), including its aims and scope, submission guidelines, research ethics, peer review process, editorial board, and publications."
                />
            </Head>

            <main className="min-h-screen bg-gray-50/70">
                {/* Journal Header */}
                <section className="relative isolate overflow-hidden border-b bg-white">
                    <div className="absolute -right-40 -top-40 size-[450px] rounded-full bg-primary/5 blur-3xl" />

                    <div className="container relative mx-auto px-5 py-12 md:px-8 md:py-16">
                        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:gap-12">
                            {/* Journal Logo */}
                            <div className="flex size-44 shrink-0 items-center justify-center rounded-3xl border border-gray-100 bg-white p-4 shadow-lg shadow-gray-200/50 sm:size-52">
                                <img
                                    src={JEBMPA}
                                    alt="DIT.ADS JEBMPA Logo"
                                    className="size-full object-contain"
                                />
                            </div>

                            {/* Journal Details */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary">
                                    <BookOpen size={14} />
                                    Academic Research Publication
                                </div>

                                <h1 className="mt-5 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                                    DIT.ADS JEBMPA
                                </h1>

                                <p className="mt-3 max-w-2xl text-lg font-semibold leading-relaxed text-gray-700">
                                    DIT.ADS Journal of Economics, Business
                                    Management, and Public Administration
                                </p>

                                <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
                                    <span className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600">
                                        E-ISSN: 3082-6004
                                    </span>

                                    <span className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600">
                                        P-ISSN: 3082-5997
                                    </span>
                                </div>

                                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                                    <a href="mailto:editorinchief@ditadsjebmpa.com">
                                        <Button className="h-12 w-full gap-2 px-7 font-bold shadow-lg shadow-primary/20 sm:w-auto">
                                            <Send size={17} />
                                            Submit Your Paper
                                            <ArrowUpRight size={16} />
                                        </Button>
                                    </a>

                                    <a href="#journal-information">
                                        <Button
                                            variant="outline"
                                            className="h-12 w-full px-7 font-semibold sm:w-auto"
                                        >
                                            Explore Journal
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section
                    id="journal-information"
                    className="container mx-auto scroll-mt-24 px-5 py-12 md:px-8 md:py-16"
                >
                    <div className="grid items-start gap-8 lg:grid-cols-12">
                        {/* Journal Information */}
                        <div className="min-w-0 lg:col-span-8">
                            <div className="mb-7">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                    Journal Information
                                </span>

                                <h2 className="mt-2 text-2xl font-black text-gray-900 md:text-3xl">
                                    Explore Our Journal
                                </h2>

                                <p className="mt-2 text-sm leading-7 text-gray-500">
                                    Discover our publication policies,
                                    editorial standards, research guidelines,
                                    and published scholarly works.
                                </p>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="px-5 md:px-7"
                                >
                                    {contents.map((content, index) => {
                                        const Icon = content.icon;

                                        return (
                                            <AccordionItem
                                                key={content.title}
                                                value={`item-${index}`}
                                                className="border-b border-gray-100 last:border-b-0"
                                            >
                                                <AccordionTrigger className="gap-4 py-5 text-left text-sm font-bold text-gray-800 hover:no-underline hover:text-primary [&[data-state=open]>div>div]:bg-primary [&[data-state=open]>div>div]:text-white">
                                                    <div className="flex min-w-0 items-center gap-4">
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors">
                                                            <Icon size={19} />
                                                        </div>

                                                        <span>
                                                            {content.title}
                                                        </span>
                                                    </div>
                                                </AccordionTrigger>

                                                <AccordionContent className="pb-6 pt-2">
                                                    <div className="pl-0 text-sm leading-7 text-gray-600 md:pl-14">
                                                        <content.page
                                                            {...(
                                                                content.props ||
                                                                {}
                                                            )}
                                                        />
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
                            {/* SDG 4 Card */}
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-100 p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Globe size={20} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-gray-900">
                                                Sustainability Commitment
                                            </h3>

                                            <p className="text-xs text-gray-500">
                                                United Nations Sustainable
                                                Development Goals
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="overflow-hidden rounded-xl bg-gray-50 p-3">
                                        <img
                                            src={SDG4}
                                            alt="United Nations Sustainable Development Goal 4"
                                            className="h-auto w-full object-contain"
                                        />
                                    </div>

                                    <div className="mt-5 space-y-4 text-sm leading-7 text-gray-600">
                                        <p>
                                            <strong className="text-gray-900">
                                                Sustainability Commitment
                                            </strong>
                                        </p>

                                        <p className="text-justify">
                                            The DIT.ADS Journal of Economics,
                                            Business Management, and Public
                                            Administration (DIT.ADS JEBMPA) is
                                            firmly committed to advancing the
                                            United Nations' Sustainable
                                            Development Goals, with a focused
                                            alignment on SDG 8 (Decent Work and
                                            Economic Growth), SDG 9 (Industry,
                                            Innovation and Infrastructure), SDG
                                            12 (Responsible Consumption and
                                            Production), and SDG 17
                                            (Partnerships for the Goals).
                                        </p>

                                        <p className="text-justify">
                                            The journal serves as a platform
                                            for research that promotes
                                            inclusive economic development,
                                            fosters innovation, advocates for
                                            sustainable business and consumption
                                            practices, and strengthens
                                            collaborative governance.
                                        </p>

                                        <p className="text-justify">
                                            Through this commitment, DIT.ADS
                                            JEBMPA empowers scholars,
                                            practitioners, and policymakers to
                                            generate knowledge that drives
                                            progress toward a more resilient,
                                            sustainable, and interconnected
                                            world.
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary/5 p-4">
                                        <CheckCircle2
                                            size={20}
                                            className="mt-0.5 shrink-0 text-primary"
                                        />

                                        <p className="text-xs leading-6 text-gray-600">
                                            Promoting sustainable economic
                                            growth, innovation, responsible
                                            practices, and global partnerships.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Research Focus */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <BriefcaseBusiness size={24} />
                                </div>

                                <h3 className="mt-5 text-xl font-black text-gray-900">
                                    Research for Progress
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-gray-500">
                                    Advancing knowledge in economics,
                                    business management, public administration,
                                    and sustainable development through
                                    multidisciplinary scholarly research.
                                </p>

                                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary">
                                    <TrendingUp size={17} />
                                    Innovation and Development
                                </div>
                            </div>

                            {/* Submission Card */}
                            <div className="overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-lg shadow-primary/20">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-white/15">
                                    <Quote size={24} />
                                </div>

                                <h3 className="mt-5 text-xl font-black">
                                    Have Research to Share?
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-white/80">
                                    Share your scholarly work and contribute to
                                    the advancement of economics, business
                                    management, and public administration.
                                </p>

                                <a href="mailto:editorinchief@ditadsjebmpa.com">
                                    <Button
                                        variant="secondary"
                                        className="mt-6 h-11 w-full gap-2 font-bold"
                                    >
                                        <Mail size={16} />
                                        Contact the Editor
                                    </Button>
                                </a>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </>
    );
}

JournalLayout.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);