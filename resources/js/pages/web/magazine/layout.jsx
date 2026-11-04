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
import {
    BookOpen,
    Target,
    Eye,
    History,
    Building2,
    ShieldCheck,
    Users,
    FileText,
    BookMarked,
    Sparkles,
    Library,
    ArrowRight,
} from "lucide-react";

const banners = [MagazineBanner];

export default function MagazineLayout() {
    const { editors, magazines, archives, activeVolume, activeIssue } =
        usePage().props;

    const contents = [
        {
            title: "About the Magazine",
            description: "Discover the publication and its purpose.",
            icon: BookOpen,
            page: AboutMagazine,
        },
        {
            title: "About the Logo",
            description: "Learn about the meaning behind our identity.",
            icon: Eye,
            page: AboutLogo,
        },
        {
            title: "Origin of the Magazine",
            description: "Explore the history and beginnings of the magazine.",
            icon: History,
            page: OriginMagazine,
        },
        {
            title: "Aims and Scope",
            description: "Explore our editorial focus and coverage.",
            icon: Target,
            page: AimScope,
        },
        {
            title: "About the Publisher",
            description: "Learn more about the publishing institution.",
            icon: Building2,
            page: AboutPublisher,
        },
        {
            title: "Review Process",
            description: "Understand our content evaluation process.",
            icon: ShieldCheck,
            page: ReviewProcess,
        },
        {
            title: "Application as Content Editors / Reviewers",
            description: "Apply to become part of our editorial team.",
            icon: Users,
            page: ApplicationContent,
        },
        {
            title: "Editorial Board",
            description: "Meet the people behind the publication.",
            icon: Users,
            page: EditorialBoard,
            props: { editors },
        },
        {
            title: "Published Magazine",
            description: "Browse current and archived magazine issues.",
            icon: Library,
            page: Magazine,
            props: { magazines, archives, activeVolume, activeIssue },
        },
    ];

    return (
        <>
            <Head title="Magazine" />

            <main className="min-h-screen bg-muted/30">
                <section className="border-b bg-background">
                    <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
                        <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
                            <div>
                                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                                    <Sparkles className="h-4 w-4" />
                                    DIT.ADS Publication
                                </span>

                                <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                                    Discover Our{" "}
                                    <span className="text-primary">
                                        Magazine
                                    </span>
                                </h1>

                                <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                                    Explore our magazine, discover its
                                    background and editorial direction, meet our
                                    editorial team, and browse published issues.
                                    Learn more about our publication and the
                                    people who contribute to it.
                                </p>

                                <div className="mt-7 flex flex-wrap gap-3">
                                    <a
                                        href="#published-magazine"
                                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                                    >
                                        Browse Publications
                                        <ArrowRight className="h-4 w-4" />
                                    </a>

                                    <a
                                        href="#magazine-information"
                                        className="inline-flex items-center gap-2 rounded-lg border bg-background px-5 py-3 text-sm font-semibold transition hover:bg-muted"
                                    >
                                        Learn More
                                    </a>
                                </div>
                            </div>

                            <div className="relative mx-auto w-full max-w-md">
                                <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />

                                <div className="relative overflow-hidden rounded-2xl border bg-card p-3 shadow-xl">
                                    <img
                                        src={MagazineBanner}
                                        alt="DIT.ADS Magazine"
                                        className="h-64 w-full rounded-xl object-cover sm:h-80"
                                    />

                                    <div className="p-4">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                                            DIT.ADS
                                        </p>
                                        <h2 className="mt-2 text-xl font-bold">
                                            Magazine Publications
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Knowledge, ideas, and meaningful
                                            contributions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="magazine-information"
                    className="container mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16"
                >
                    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                        <div>
                            <div className="mb-7">
                                <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                                    Explore
                                </span>

                                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                                    Magazine Information
                                </h2>

                                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                                    Browse the sections below to learn about our
                                    magazine, its history, editorial standards,
                                    and published works.
                                </p>
                            </div>

                            <div className="rounded-2xl border bg-card p-3 shadow-sm sm:p-5">
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full"
                                >
                                    {contents.map((content, index) => {
                                        const Icon = content.icon;
                                        const Page = content.page;

                                        return (
                                            <AccordionItem
                                                key={content.title}
                                                value={`item-${index}`}
                                                className="border-b last:border-b-0"
                                                id={
                                                    content.title ===
                                                    "Published Magazine"
                                                        ? "published-magazine"
                                                        : undefined
                                                }
                                            >
                                                <AccordionTrigger className="gap-4 rounded-lg px-3 py-5 text-left transition hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-muted/50">
                                                    <div className="flex min-w-0 items-center gap-4">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                            <Icon className="h-5 w-5" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <h3 className="text-sm font-semibold sm:text-base">
                                                                {content.title}
                                                            </h3>

                                                            <p className="mt-1 text-xs font-normal text-muted-foreground sm:text-sm">
                                                                {
                                                                    content.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>

                                                <AccordionContent className="px-3 pb-6 pt-3">
                                                    <div className="border-t pt-5">
                                                        <Page
                                                            {...(content.props ||
                                                                {})}
                                                        />
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>
                            </div>
                        </div>

                        <aside className="space-y-5">
                            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <BookMarked className="h-6 w-6" />
                                </div>

                                <h3 className="text-lg font-bold">
                                    Explore Our Publications
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                    Access our published magazine issues and
                                    explore the ideas, stories, and
                                    contributions featured in each edition.
                                </p>

                                <a
                                    href="#published-magazine"
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                                >
                                    View Publications
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>

                            <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                                    <FileText className="h-6 w-6" />
                                </div>

                                <h3 className="text-lg font-bold">
                                    Become a Contributor
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-primary-foreground/80">
                                    Interested in contributing to our magazine?
                                    Explore the application section to learn
                                    about becoming a content editor or reviewer.
                                </p>

                                <a
                                    href="#magazine-information"
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground underline-offset-4 hover:underline"
                                >
                                    Explore Opportunities
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </>
    );
}

MagazineLayout.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
