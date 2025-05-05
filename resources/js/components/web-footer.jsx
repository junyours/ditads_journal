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
                        {items.map((item, index) => (
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
