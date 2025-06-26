import { Button } from "@/components/ui/button";

export default function Magazine({ magazines }) {
    return (
        <div className="flex gap-4">
            <div className="space-y-4 flex-1">
                <h1 className="font-semibold">Volume 1, Issue 1</h1>
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
                <Button
                    size="sm"
                    variant="ghost"
                    className="justify-start text-wrap w-full"
                >
                    Volume 1, Issue 1 (January - March 2025)
                </Button>
            </div>
        </div>
    );
}
