
import WebLayout from "@/layouts/web-layout";
import { useMemo, useState } from "react";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import EventBanner from "../../../../public/images/event-banner.png";
import { Head, usePage } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { CalendarDays, ArrowRight, CalendarX2, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const banners = [EventBanner];

const formatDate = (date) => {
    if (!date) return "Date to be announced";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date to be announced";
    }

    return parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const getEventImage = (imageFileId) => {
    return imageFileId
        ? `https://lh3.googleusercontent.com/d/${imageFileId}`
        : null;
};

const getDateParts = (date) => {
    if (!date) return { month: "TBA", day: "--", year: "" };

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return { month: "TBA", day: "--", year: "" };
    }

    return {
        month: parsedDate.toLocaleDateString("en-US", {
            month: "short",
        }),
        day: parsedDate.toLocaleDateString("en-US", {
            day: "2-digit",
        }),
        year: parsedDate.getFullYear(),
    };
};

export default function Event() {
    const { events = [] } = usePage().props;
    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const sortedEvents = useMemo(() => {
        return [...events].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();

            return (
                (Number.isNaN(dateB) ? 0 : dateB) -
                (Number.isNaN(dateA) ? 0 : dateA)
            );
        });
    }, [events]);

    const handleOpen = (event) => {
        setSelectedEvent(event);
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(value);

        if (!value) {
            setSelectedEvent(null);
        }
    };

    return (
        <>
            <Head title="Events">
                <meta
                    name="description"
                    content="Explore the latest events, activities, seminars, and programs organized by DIT.ADS."
                />
            </Head>

            <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto mb-10 max-w-3xl space-y-3 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        <CalendarDays className="size-4" />
                        DIT.ADS Activities
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Events and Activities
                    </h1>

                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                        Stay updated with our latest events, programs,
                        seminars, and activities. Discover the moments and
                        initiatives that bring our community together.
                    </p>
                </div>

                {sortedEvents.length > 0 ? (
                    <>
                        <div className="mb-6 flex items-center justify-between border-b pb-4">
                            <div>
                                <h2 className="font-semibold text-foreground">
                                    Latest Events
                                </h2>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Explore our latest activities and
                                    announcements.
                                </p>
                            </div>

                            <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                                {sortedEvents.length}{" "}
                                {sortedEvents.length === 1 ? "Event" : "Events"}
                            </span>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {sortedEvents.map((event) => {
                                const date = getDateParts(event.date);
                                const image = getEventImage(
                                    event.image_file_id
                                );

                                return (
                                    <Card
                                        key={event.id}
                                        className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={event.title || "Event"}
                                                    loading="lazy"
                                                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex size-full items-center justify-center">
                                                    <CalendarDays className="size-12 text-muted-foreground/40" />
                                                </div>
                                            )}

                                            <div className="absolute left-4 top-4 flex min-w-14 flex-col items-center rounded-lg border bg-background/95 px-3 py-2 text-center shadow-sm backdrop-blur">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                                    {date.month}
                                                </span>
                                                <span className="text-xl font-bold leading-tight text-foreground">
                                                    {date.day}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {date.year}
                                                </span>
                                            </div>
                                        </div>

                                        <CardHeader className="space-y-3 px-5 pb-2 pt-5">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <CalendarDays className="size-3.5 text-primary" />
                                                {formatDate(event.date)}
                                            </div>

                                            <h3 className="line-clamp-2 min-h-12 text-lg font-semibold leading-snug tracking-tight text-foreground">
                                                {event.title}
                                            </h3>
                                        </CardHeader>

                                        <CardContent className="flex-1 px-5 pb-4">
                                            <div className="line-clamp-4 overflow-hidden text-sm leading-relaxed text-muted-foreground [&_img]:hidden [&_p]:mb-2 [&_a]:text-primary">
                                                <FroalaEditorView
                                                    model={event.content || ""}
                                                />
                                            </div>
                                        </CardContent>

                                        <CardFooter className="border-t px-5 py-4">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="group/button h-auto p-0 font-semibold text-primary hover:bg-transparent hover:text-primary"
                                                onClick={() =>
                                                    handleOpen(event)
                                                }
                                            >
                                                Read full story
                                                <ArrowRight className="ml-2 size-4 transition-transform group-hover/button:translate-x-1" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 text-center">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                            <CalendarX2 className="size-8 text-primary" />
                        </div>

                        <h2 className="text-lg font-semibold text-foreground">
                            No Events Available
                        </h2>

                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            There are currently no events to display. Please
                            check back later for upcoming activities and
                            announcements.
                        </p>
                    </div>
                )}
            </section>

            <Sheet open={open} onOpenChange={handleClose}>
                <SheetContent
                    side="bottom"
                    className="h-[95svh] overflow-y-auto rounded-t-2xl p-0"
                >
                    {selectedEvent && (
                        <article className="mx-auto w-full max-w-5xl pb-12">
                            <SheetHeader className="sticky top-0 z-20 border-b bg-background/95 px-5 py-4 text-left backdrop-blur sm:px-8">
                                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                                    <CalendarDays className="size-4" />
                                    {formatDate(selectedEvent.date)}
                                </div>

                                <SheetTitle className="pr-8 text-xl font-bold leading-tight sm:text-2xl">
                                    {selectedEvent.title}
                                </SheetTitle>
                            </SheetHeader>

                            <div className="space-y-8 px-5 pt-6 sm:px-8">
                                {getEventImage(
                                    selectedEvent.image_file_id
                                ) && (
                                    <div className="overflow-hidden rounded-xl bg-muted">
                                        <img
                                            src={getEventImage(
                                                selectedEvent.image_file_id
                                            )}
                                            alt={
                                                selectedEvent.title || "Event"
                                            }
                                            className="max-h-[520px] w-full object-contain"
                                        />
                                    </div>
                                )}

                                <div className="mx-auto max-w-3xl">
                                    <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock3 className="size-4 text-primary" />
                                        Published on{" "}
                                        {formatDate(selectedEvent.date)}
                                    </div>

                                    <div className="prose prose-sm max-w-none break-words text-foreground dark:prose-invert sm:prose-base [&_img]:h-auto [&_img]:max-w-full [&_p]:leading-7">
                                        <FroalaEditorView
                                            model={selectedEvent.content || ""}
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
}

Event.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);
