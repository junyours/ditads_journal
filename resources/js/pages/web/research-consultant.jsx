import WebLayout from "@/layouts/web-layout";
import ResearchConsultantBanner from "../../../../public/images/research-consultant-banner.png";
import { usePage } from "@inertiajs/react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const banners = [ResearchConsultantBanner];

export default function ResearchConsultant() {
    const { consultants } = usePage().props;

    const positionOrder = [
        "Head of Research Consultant",
        "Associate Research Consultant",
        "Research Consultant",
    ];

    const groupedConsultants = positionOrder.map((position) => ({
        position,
        members: consultants.filter(
            (consultant) => consultant.position === position
        ),
    }));

    return (
        <div className="space-y-4">
            {groupedConsultants.map(
                ({ position, members }) =>
                    members.length > 0 && (
                        <div key={position}>
                            <h1 className="text-base font-semibold mb-2">
                                {position}
                            </h1>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {members.map((consultant, index) => (
                                    <Card key={index} className="shadow-none">
                                        <div className="h-[250px] w-full">
                                            <img
                                                src={consultant.avatar ?? User}
                                                alt="avatar"
                                                className="object-contain size-full rounded-t-lg"
                                            />
                                        </div>
                                        <CardHeader className="space-y-4">
                                            <div className="space-y-2">
                                                <div>
                                                    <h1 className="font-medium">
                                                        {consultant.name}
                                                    </h1>
                                                    <a
                                                        href={`mailto:${consultant.email}`}
                                                        className="text-xs hover:underline"
                                                    >
                                                        {consultant.email}
                                                    </a>
                                                </div>
                                                <CardTitle>
                                                    {consultant.position}
                                                </CardTitle>
                                            </div>
                                            <CardDescription>
                                                {consultant.department}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )
            )}
        </div>
    );
}

ResearchConsultant.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
