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

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {consultants.map((consultant, index) => (
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
                                <CardTitle className="capitalize">
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
    );
}

ResearchConsultant.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
