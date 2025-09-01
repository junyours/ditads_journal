import WebLayout from "@/layouts/web-layout";
import { useState } from "react";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import EventBanner from "../../../../public/images/event-banner.png";
import { Head, usePage } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Calendar, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const banners = [EventBanner];

export default function Event() {
    const { events } = usePage().props;
    const [open, setOpen] = useState(false);
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    const [event, setEvent] = useState(null);

    const handleOpen = (event = null) => {
        if (event) {
            setEvent(event);
        } else {
            setEvent(null);
        }
        setOpen(!open);
    };

    return (
        <>
            <Head title="Events" />

            <div className="container mx-auto p-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event, index) => (
                        <Card key={index} className="flex flex-col shadow-none">
                            <CardHeader className="p-4">
                                <div className="flex gap-2 items-center text-primary">
                                    <Calendar size={16} />
                                    <span className="text-xs">
                                        {formatDate(event.date)}
                                    </span>
                                </div>
                                <div className="h-[200px] w-full">
                                    <img
                                        src={`https://lh3.googleusercontent.com/d/${event.image_file_id}`}
                                        alt={`image-${index}`}
                                        className="object-cover size-full"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4 px-4">
                                <CardTitle className="break-words line-clamp-3">
                                    {event.title}
                                </CardTitle>
                                <div className="line-clamp-6">
                                    <FroalaEditorView model={event.content} />
                                </div>
                            </CardContent>
                            <CardFooter className="px-4 pb-4">
                                <Button
                                    onClick={() => handleOpen(event)}
                                    variant="ghost"
                                    size="sm"
                                >
                                    Read more
                                    <MoveRight />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            <Sheet open={open} onOpenChange={() => handleOpen()}>
                <SheetContent
                    side="bottom"
                    className="h-full overflow-y-auto text-sm"
                >
                    <div className="space-y-4">
                        <SheetHeader>
                            <div className="flex gap-2 items-center text-primary">
                                <Calendar size={16} />
                                <span className="text-xs">
                                    {formatDate(event?.date)}
                                </span>
                            </div>
                        </SheetHeader>
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="space-y-4">
                                <img
                                    src={`https://lh3.googleusercontent.com/d/${event?.image_file_id}`}
                                    alt={`image`}
                                    className="object-contain size-full"
                                />
                                <SheetTitle>{event?.title}</SheetTitle>
                            </div>
                            <FroalaEditorView model={event?.content} />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}

Event.layout = (page) => <WebLayout children={page} banners={banners} />;
