import { Link } from "@inertiajs/react";
import DitadsLogo from "./ditads-logo";

const items = [
    {
        title: "Contact Us",
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
        title: "Address",
        subitems: [
            {
                name: "R188 Metro Square, Zone 2 Iponan, Cagayan de Oro City",
            },
        ],
    },
    {
        title: "Permits/Certificates",
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
        ],
    },
    {
        title: "Follow Us",
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
    const currentPath = window.location.pathname;

    const filteredItems = items.map((item) => {
        if (item.title === "Contact Us") {
            return {
                ...item,
                subitems: item.subitems.filter((subitem) => {
                    if (subitem.type === "tel:") return true;

                    // Only show IMRJ email if on the IMRJ page
                    if (
                        subitem.name ===
                        "ditadsimrj@ditadsinternationalmultidisciplinaryresearchjournal.net"
                    ) {
                        return currentPath.includes("research-journal/imrj");
                    }

                    // Only show JEBMPA email if on the JEBMPA page
                    if (subitem.name === "editorinchief@ditadsjebmpa.com") {
                        return currentPath.includes("research-journal/jebmpa");
                    }

                    // Show default email on all other pages
                    if (subitem.name === "ditads@infosheet.dev") {
                        return (
                            !currentPath.includes("research-journal/imrj") &&
                            !currentPath.includes("research-journal/jebmpa")
                        );
                    }

                    return false;
                }),
            };
        }
        return item;
    });

    return (
        <footer className="bg-primary">
            <div className="container mx-auto px-4 py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <Link href="/" className="flex items-center">
                            <div className="size-16 me-3">
                                <DitadsLogo />
                            </div>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        {filteredItems.map((item, index) => (
                            <div key={index} className="space-y-6">
                                <h2 className="text-sm font-semibold uppercase">
                                    {item.title}
                                </h2>
                                <ul className="font-medium space-y-3">
                                    {item.subitems.map((subitem, subIndex) =>
                                        subitem.link ? (
                                            <li key={subIndex}>
                                                <a
                                                    href={
                                                        subitem.type
                                                            ? subitem.type +
                                                              subitem.name
                                                            : subitem.href
                                                    }
                                                    target={
                                                        subitem.target
                                                            ? "_blank"
                                                            : "_self"
                                                    }
                                                    className="hover:underline break-words"
                                                >
                                                    {subitem.name}
                                                </a>
                                            </li>
                                        ) : (
                                            <p key={subIndex}>{subitem.name}</p>
                                        )
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                {currentPath === "/research-journal/imrj" && (
                    <div className="text-center mt-4">
                        <a
                            href="https://ditadsresearchcenter.com/research-journal/imrj"
                            className="hover:underline"
                        >
                            DIT.ADS International Multidisciplinary Research
                            Journal
                        </a>{" "}
                        © 2025 by{" "}
                        <a
                            href="https://ditadsresearchcenter.com"
                            className="hover:underline"
                        >
                            Digital Institute Training and Development Services
                        </a>{" "}
                        is licensed under{" "}
                        <a
                            href="https://creativecommons.org/licenses/by-sa/4.0/"
                            target="_blank"
                            className="hover:underline"
                        >
                            Creative Commons Attribution-ShareAlike 4.0
                            International
                        </a>
                        <img
                            src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
                            className="w-4 h-4 inline-block ml-1"
                        />
                        <img
                            src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
                            className="w-4 h-4 inline-block ml-1"
                        />
                        <img
                            src="https://mirrors.creativecommons.org/presskit/icons/sa.svg"
                            className="w-4 h-4 inline-block ml-1"
                        />
                    </div>
                )}
                <hr className="my-6 border-t sm:mx-auto lg:my-8" />
                <div className="flex justify-center">
                    <span className="text-sm">
                        © {new Date().getFullYear()}{" "}
                        <a href="/" className="hover:underline">
                            {import.meta.env.VITE_APP_NAME}
                        </a>
                        . All Rights Reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
}
