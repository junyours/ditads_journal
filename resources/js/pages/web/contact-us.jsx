import WebLayout from "@/layouts/web-layout";
import ContactUsBanner from "../../../../public/images/contact-us-banner.png";
import { Mail, Phone } from "lucide-react";

const banners = [ContactUsBanner];

export default function ContactUs() {
    return (
        <div className="max-w-7xl mx-auto space-y-4">
            <h1 className="text-center font-semibold">
                METRO SQUARE R118 ZONE 2, IPONAN, CDO CITY
            </h1>
            <div className="grid sm:grid-cols-2 gap-4 place-items-center">
                <div className="flex flex-col items-center gap-1">
                    <Phone className="text-primary" />
                    <a
                        href={`tel:${import.meta.env.VITE_APP_PHONE}`}
                        className="font-medium hover:underline"
                    >
                        {import.meta.env.VITE_APP_PHONE}
                    </a>
                </div>
                <div className="flex flex-col items-center">
                    <Mail className="text-primary" />
                    <a
                        href={`mailto:${import.meta.env.VITE_APP_EMAIL}`}
                        className="font-medium hover:underline"
                    >
                        {import.meta.env.VITE_APP_EMAIL}
                    </a>
                </div>
            </div>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.0376374267407!2d124.59567327352237!3d8.49572149711157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fff3bb5ad3a1dd%3A0xd7dd14c89de28c9b!2sMetro%20Square!5e0!3m2!1sen!2sph!4v1745471228277!5m2!1sen!2sph"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                className="w-full h-[500px]"
            />
        </div>
    );
}

ContactUs.layout = (page) => <WebLayout children={page} banners={banners} />;
