import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Magazine({
    magazines,
    archives,
    activeVolume,
    activeIssue,
}) {
    const [selectedArchive, setSelectedArchive] = useState({
        volume: activeVolume,
        issue: activeIssue,
    });

    const handleArchiveClick = (volume, issue) => {
        setSelectedArchive({ volume, issue });
        router.get(
            "/magazine",
            { volume, issue },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    return (
        <div className="flex gap-4">
            <div className="space-y-4 flex-1">
                <h1 className="font-semibold">
                    Volume {selectedArchive.volume}, Issue{" "}
                    {selectedArchive.issue}
                </h1>
                <div className="mx-1 lg:hidden">
                    <Select>
                        <SelectTrigger className="max-w-[300px]">
                            <SelectValue placeholder="Select Volume and Issue" />
                        </SelectTrigger>
                        <SelectContent>
                            {archives.map((archive, index) => (
                                <SelectItem
                                    key={index}
                                    onClick={() =>
                                        handleArchiveClick(
                                            archive.volume,
                                            archive.issue
                                        )
                                    }
                                    value={archive.label}
                                >
                                    {archive.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {magazines.map((magazine, index) => (
                        <a
                            key={index}
                            href={`/view-magazine/${magazine.pdf_file}`}
                            target="_blank"
                        >
                            <img
                                src={`https://lh3.googleusercontent.com/d/${magazine.cover_file_id}`}
                                alt={`magazine-${index}`}
                                className="object-contain size-80"
                            />
                        </a>
                    ))}
                </div>
            </div>
            <div className="w-full max-w-[300px] border h-fit p-4 rounded-lg space-y-4 hidden lg:block">
                <h1 className="font-semibold">Quarterly Archive</h1>
                <div>
                    {archives.map((archive, index) => (
                        <Button
                            onClick={() =>
                                handleArchiveClick(
                                    archive.volume,
                                    archive.issue
                                )
                            }
                            key={index}
                            size="sm"
                            variant="ghost"
                            className="justify-start text-wrap w-full"
                        >
                            {archive.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
