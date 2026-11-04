
import WebLayout from "@/layouts/web-layout";
import ResearchConsultantBanner from "../../../../public/images/research-consultant-banner.png";
import { Head, usePage } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Mail,
    Users,
    BriefcaseBusiness,
    GraduationCap,
    UserRound,
} from "lucide-react";

const banners = [ResearchConsultantBanner];

const positionOrder = [
    "Head of Research Consultant",
    "Associate Research Consultant",
    "Research Consultant",
];

const positionIcons = {
    "Head of Research Consultant": BriefcaseBusiness,
    "Associate Research Consultant": GraduationCap,
    "Research Consultant": Users,
};

const positionDescriptions = {
    "Head of Research Consultant":
        "Providing leadership, direction, and oversight for research consultancy services.",
    "Associate Research Consultant":
        "Supporting research initiatives through collaboration, expertise, and academic guidance.",
    "Research Consultant":
        "Delivering research assistance, analysis, and professional consultancy services.",
};

const getInitials = (name = "") => {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();
};

function ConsultantCard({ consultant }) {
    const hasAvatar =
        typeof consultant.avatar === "string" &&
        consultant.avatar.trim() !== "";

    return (
        <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted">
                {hasAvatar ? (
                    <img
                        src={consultant.avatar}
                        alt={consultant.name || "Research consultant"}
                        loading="lazy"
                        className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-3 bg-primary/5">
                        <div className="flex size-20 items-center justify-center rounded-full border-4 border-background bg-primary/10 text-2xl font-bold text-primary">
                            {consultant.name
                                ? getInitials(consultant.name)
                                : <UserRound className="size-8" />}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            Profile
                        </span>
                    </div>
                )}
            </div>

            <CardHeader className="flex-1 space-y-3 p-5">
                <div className="space-y-1">
                    <CardTitle className="text-base font-bold leading-snug">
                        {consultant.name || "Research Consultant"}
                    </CardTitle>

                    <CardDescription className="text-xs leading-relaxed text-primary">
                        {consultant.position}
                    </CardDescription>
                </div>

                {consultant.department && (
                    <div className="border-t pt-3">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Department
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-foreground">
                            {consultant.department}
                        </p>
                    </div>
                )}

                {consultant.email && (
                    <a
                        href={`mailto:${consultant.email}`}
                        className="inline-flex min-w-0 items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
                    >
                        <Mail className="size-4 shrink-0 text-primary" />
                        <span className="truncate">
                            {consultant.email}
                        </span>
                    </a>
                )}
            </CardHeader>
        </Card>
    );
}

export default function ResearchConsultant() {
    const { consultants = [] } = usePage().props;

    const groupedConsultants = positionOrder
        .map((position) => ({
            position,
            members: consultants.filter(
                (consultant) => consultant.position === position
            ),
        }))
        .filter(({ members }) => members.length > 0);

    const ungroupedConsultants = consultants.filter(
        (consultant) => !positionOrder.includes(consultant.position)
    );

    const totalConsultants = consultants.length;

    return (
        <>
            <Head title="Research Consultants">
                <meta
                    name="description"
                    content="Meet the DIT.ADS research consultancy team and discover the professionals supporting academic and business research."
                />
            </Head>

            <section className="container mx-auto space-y-12 px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl space-y-4 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Users className="size-4" />
                        Our Professionals
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Meet Our Research Consultants
                    </h1>

                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                        Our research consultancy team brings together
                        professionals dedicated to supporting academic and
                        business research through knowledge, collaboration,
                        and professional expertise.
                    </p>

                    <div className="flex justify-center pt-2">
                        <div className="inline-flex items-center gap-3 rounded-xl border bg-card px-5 py-3 shadow-sm">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Users className="size-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-xl font-bold tabular-nums">
                                    {totalConsultants}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Research{" "}
                                    {totalConsultants === 1
                                        ? "Consultant"
                                        : "Consultants"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {groupedConsultants.length > 0 ||
                ungroupedConsultants.length > 0 ? (
                    <div className="space-y-12">
                        {groupedConsultants.map(({ position, members }) => {
                            const Icon =
                                positionIcons[position] || Users;

                            return (
                                <section
                                    key={position}
                                    className="space-y-5"
                                >
                                    <div className="flex items-center gap-4 border-b pb-4">
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon className="size-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-lg font-bold tracking-tight sm:text-xl">
                                                {position}
                                            </h2>
                                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                                {positionDescriptions[position]}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                                            {members.length}{" "}
                                            {members.length === 1
                                                ? "Member"
                                                : "Members"}
                                        </span>
                                    </div>

                                    <div
                                        className={`grid gap-5 sm:grid-cols-2 ${
                                            position ===
                                            "Head of Research Consultant"
                                                ? "lg:grid-cols-3"
                                                : "md:grid-cols-3 lg:grid-cols-4"
                                        }`}
                                    >
                                        {members.map((consultant) => (
                                            <ConsultantCard
                                                key={consultant.id}
                                                consultant={consultant}
                                            />
                                        ))}
                                    </div>
                                </section>
                            );
                        })}

                        {ungroupedConsultants.length > 0 && (
                            <section className="space-y-5">
                                <div className="border-b pb-4">
                                    <h2 className="text-lg font-bold">
                                        Other Consultants
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Additional members of our research
                                        consultancy team.
                                    </p>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {ungroupedConsultants.map((consultant) => (
                                        <ConsultantCard
                                            key={consultant.id}
                                            consultant={consultant}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                ) : (
                    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 text-center">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Users className="size-8" />
                        </div>

                        <h2 className="text-lg font-semibold">
                            No Consultants Available
                        </h2>

                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            Our research consultancy team information is
                            currently unavailable. Please check back later.
                        </p>
                    </div>
                )}
            </section>
        </>
    );
}

ResearchConsultant.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
