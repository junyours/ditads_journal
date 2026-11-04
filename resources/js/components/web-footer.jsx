import { Link, usePage } from "@inertiajs/react";
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    FileCheck,
    ArrowUpRight,
} from "lucide-react";

import DitadsLogo from "./ditads-logo";
import BIR from "../../../public/images/bir.png";

const items = [
    {
        title: "Contact Us",
        icon: Mail,
        subitems: [
            {
                name: "ditads@infosheet.dev",
                type: "mailto:",
                link: true,
            },
            {
                name: "ditadsimrj@ditadsinternationalmultidisciplinaryresearchjournal.net",
                type: "mailto:",
                link: true,
            },
            {
                name: "editorinchief@ditadsjebmpa.com",
                type: "mailto:",
                link: true,
            },
            {
                name: "09171281320",
                type: "tel:",
                link: true,
            },
        ],
    },
    {
        title: "Our Location",
        icon: MapPin,
        subitems: [
            {
                name: "R188 Metro Square, Zone 2 Iponan, Cagayan de Oro City",
            },
        ],
    },
    {
        title: "Permits & Certificates",
        icon: FileCheck,
        subitems: [
            {
                name: "Business Permit Number: BP-33229 and Certificate Number: 2019-25829",
            },
            {
                name: "DTI Certificate of Business Registration No.: 1033992",
            },
            {
                name: "Philgeps No.: 201910-17877-1307663177",
            },
            {
                name: "NBDB No.: 7515",
            },
            {
                name: "CDA CTPro No.: 271",
            },
        ],
    },
    {
        title: "Follow Us",
        icon: Facebook,
        subitems: [
            {
                name: "Facebook",
                href: "https://www.facebook.com/DIT.ADS.net",
                target: "_blank",
                link: true,
            },
        ],
    },
];

export default function WebFooter() {
    const { url } = usePage();

    const isIMRJ = url.includes("research-journal/imrj");
    const isJEBMPA = url.includes("research-journal/jebmpa");

    const filteredItems = items.map((item) => {
        if (item.title !== "Contact Us") return item;

        return {
            ...item,
            subitems: item.subitems.filter((subitem) => {
                if (subitem.type === "tel:") return true;

                if (
                    subitem.name ===
                    "ditadsimrj@ditadsinternationalmultidisciplinaryresearchjournal.net"
                ) {
                    return isIMRJ;
                }

                if (subitem.name === "editorinchief@ditadsjebmpa.com") {
                    return isJEBMPA;
                }

                if (subitem.name === "ditads@infosheet.dev") {
                    return !isIMRJ && !isJEBMPA;
                }

                return false;
            }),
        };
    });

    return (
        <>
            <div className="w-full bg-white px-4 py-12 md:py-16">
    <div className="container mx-auto flex justify-center">
        <img
            src={BIR}
            alt="BIR Registration"
            className="w-full max-w-5xl h-auto object-contain"
        />
    </div>
</div>

            <footer className="bg-primary text-white">
                <div className="container mx-auto px-6 py-14 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
                        {/* Company Information */}
                        <div className="lg:col-span-3">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3"
                            >
                                <div className="flex size-16 items-center justify-center rounded-xl bg-white p-2">
                                    <DitadsLogo />
                                </div>
                            </Link>

                            <h2 className="mt-6 text-xl font-bold tracking-wide">
                                DIT.ADS
                            </h2>

                            <p className="mt-3 max-w-xs text-sm leading-7 text-white/75">
                                Digital Institute Training and Development
                                Services. Providing professional training,
                                development, and multidisciplinary research
                                services.
                            </p>

                            <a
                                href="https://www.facebook.com/DIT.ADS.net"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visit our Facebook page"
                                className="mt-6 inline-flex size-10 items-center justify-center rounded-lg border border-white/20 transition hover:bg-white hover:text-primary"
                            >
                                <Facebook size={19} />
                            </a>
                        </div>

                        {/* Footer Information */}
                        {filteredItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className={
                                        item.title === "Permits & Certificates"
                                            ? "lg:col-span-3"
                                            : "lg:col-span-2"
                                    }
                                >
                                    <div className="mb-6 flex items-center gap-2">
                                        <Icon
                                            size={18}
                                            className="text-white/80"
                                        />

                                        <h3 className="text-sm font-bold uppercase tracking-wider">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <ul className="space-y-4">
                                        {item.subitems.map((subitem) => (
                                            <li
                                                key={subitem.name}
                                                className="text-sm leading-6 text-white/75"
                                            >
                                                {subitem.link ? (
                                                    <a
                                                        href={
                                                            subitem.type
                                                                ? `${subitem.type}${subitem.name}`
                                                                : subitem.href
                                                        }
                                                        target={
                                                            subitem.target
                                                                ? "_blank"
                                                                : undefined
                                                        }
                                                        rel={
                                                            subitem.target
                                                                ? "noopener noreferrer"
                                                                : undefined
                                                        }
                                                        className="group inline-flex items-start gap-2 break-words transition hover:text-white"
                                                    >
                                                        <span className="break-all">
                                                            {subitem.name}
                                                        </span>

                                                        {subitem.target && (
                                                            <ArrowUpRight
                                                                size={14}
                                                                className="mt-1 shrink-0 opacity-0 transition group-hover:opacity-100"
                                                            />
                                                        )}
                                                    </a>
                                                ) : (
                                                    <span>{subitem.name}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    {/* IMRJ License */}
                    {isIMRJ && (
                        <div className="mt-12 rounded-xl border border-white/15 bg-white/5 p-6 text-center">
                            <p className="text-sm leading-7 text-white/75">
                                <a
                                    href="https://ditadsresearchcenter.com/research-journal/imrj"
                                    className="font-semibold text-white hover:underline"
                                >
                                    DIT.ADS International Multidisciplinary
                                    Research Journal
                                </a>{" "}
                                © 2025 by{" "}
                                <a
                                    href="https://ditadsresearchcenter.com"
                                    className="font-semibold text-white hover:underline"
                                >
                                    Digital Institute Training and Development
                                    Services
                                </a>{" "}
                                is licensed under{" "}
                                <a
                                    href="https://creativecommons.org/licenses/by-sa/4.0/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-white hover:underline"
                                >
                                    Creative Commons Attribution-ShareAlike 4.0
                                    International
                                </a>
                                <span className="ml-2 inline-flex items-center gap-1 align-middle">
                                    {["cc", "by", "sa"].map((icon) => (
                                        <img
                                            key={icon}
                                            src={`https://mirrors.creativecommons.org/presskit/icons/${icon}.svg`}
                                            alt={`Creative Commons ${icon.toUpperCase()}`}
                                            className="size-5 brightness-0 invert"
                                        />
                                    ))}
                                </span>
                            </p>
                        </div>
                    )}

                    {/* Bottom Footer */}
                    <div className="mt-12 border-t border-white/20 pt-8">
                        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                            <p className="text-sm text-white/70">
                                © {new Date().getFullYear()}{" "}
                                <Link
                                    href="/"
                                    className="font-semibold text-white transition hover:underline"
                                >
                                    {import.meta.env.VITE_APP_NAME}
                                </Link>
                                . All Rights Reserved.
                            </p>

                            <a
                                href="https://ditadsresearchcenter.com"
                                className="text-sm text-white/70 transition hover:text-white"
                            >
                                Digital Institute Training and Development
                                Services
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
