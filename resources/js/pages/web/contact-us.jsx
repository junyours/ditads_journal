import WebLayout from "@/layouts/web-layout";
import ContactUsBanner from "../../../../public/images/contact-us-banner.png";
import { Head } from "@inertiajs/react";
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    ArrowUpRight,
    Navigation,
} from "lucide-react";

const banners = [ContactUsBanner];

const contactDetails = [
    {
        icon: Phone,
        title: "Phone Number",
        description: "Give us a call for inquiries and assistance.",
        value: "0917 128 1320",
        href: "tel:09171281320",
    },
    {
        icon: Mail,
        title: "General Inquiries",
        description: "Send us your questions and concerns.",
        value: "ditads@infosheet.dev",
        href: "mailto:ditads@infosheet.dev",
    },
    {
        icon: Mail,
        title: "Research Journal",
        description: "For journal-related questions and submissions.",
        value: "ditadsimrj@ditadsinternationalmultidisciplinaryresearchjournal.net",
        href: "mailto:ditadsimrj@ditadsinternationalmultidisciplinaryresearchjournal.net",
    },
];

export default function ContactUs() {
    return (
        <>
            <Head title="Contact Us" />

            <main className="bg-background">
                <section className="container mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                            <Mail className="h-4 w-4" />
                            Get in Touch
                        </span>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            We'd Love to Hear From You
                        </h1>

                        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                            Have questions about our services, research
                            consultancy, or training programs? Reach out to us
                            through any of the contact details below.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {contactDetails.map((contact) => {
                            const Icon = contact.icon;

                            return (
                                <a
                                    key={contact.title}
                                    href={contact.href}
                                    className="group flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                                >
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                        <Icon className="h-6 w-6" />
                                    </div>

                                    <h2 className="text-lg font-semibold">
                                        {contact.title}
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {contact.description}
                                    </p>

                                    <div className="mt-5 flex items-start justify-between gap-3 border-t pt-4">
                                        <span className="break-all text-sm font-medium text-primary">
                                            {contact.value}
                                        </span>

                                        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
                                    </div>
                                </a>
                            );
                        })}
                    </div>

                    <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
                        <div className="flex flex-col justify-center rounded-2xl bg-primary p-7 text-white sm:p-10">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
                                <MapPin className="h-7 w-7" />
                            </div>

                            <span className="text-sm font-semibold uppercase tracking-widest text-white/70">
                                Visit Our Office
                            </span>

                            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                                Find Us Here
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-white/80 sm:text-base">
                                We welcome clients, researchers, students, and
                                partners who wish to learn more about our
                                services.
                            </p>

                            <div className="mt-8 flex items-start gap-4 border-t border-white/20 pt-6">
                                <MapPin className="mt-1 h-5 w-5 shrink-0" />

                                <div>
                                    <p className="font-semibold">
                                        Office Address
                                    </p>
                                    <p className="mt-2 text-sm leading-7 text-white/80">
                                        METRO SQUARE R118 ZONE 2, IPONAN,
                                        CAGAYAN DE ORO CITY
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-4">
                                <Clock className="h-5 w-5 shrink-0" />
                                <p className="text-sm text-white/80">
                                    Contact us for inquiries and appointments.
                                </p>
                            </div>

                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Metro+Square+Iponan+Cagayan+de+Oro+City"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-8 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
                            >
                                <Navigation className="h-4 w-4" />
                                Get Directions
                                <ArrowUpRight className="h-4 w-4" />
                            </a>
                        </div>

                        <div className="min-h-[350px] overflow-hidden rounded-2xl border bg-muted shadow-sm lg:min-h-[500px]">
                            <iframe
                                title="DIT.ADS Office Location - Metro Square Iponan"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.0376374267407!2d124.59567327352237!3d8.49572149711157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fff3bb5ad3a1dd%3A0xd7dd14c89de28c9b!2sMetro%20Square!5e0!3m2!1sen!2sph!4v1745471228277!5m2!1sen!2sph"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="h-full min-h-[350px] w-full lg:min-h-[500px]"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

ContactUs.layout = (page) => (
    <WebLayout children={page} banners={banners} />
);