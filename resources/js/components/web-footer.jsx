import { Link } from "@inertiajs/react";
import DitadsLogo from "./ditads-logo";

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
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase">
                                Contact Us
                            </h2>
                            <ul className="font-medium">
                                <li className="mb-4">
                                    <a
                                        href={`mailto:${
                                            import.meta.env.VITE_APP_EMAIL
                                        }`}
                                        className="hover:underline break-words"
                                    >
                                        {import.meta.env.VITE_APP_EMAIL}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={`tel:${
                                            import.meta.env.VITE_APP_PHONE
                                        }`}
                                        className="hover:underline break-words"
                                    >
                                        {import.meta.env.VITE_APP_PHONE}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase">
                                Address
                            </h2>
                            <ul className="font-medium">
                                <li className="mb-4">
                                    <a
                                        href="#"
                                        className="hover:underline break-words"
                                    >
                                        R188 Metro Square, Zone 2 Iponan,
                                        Cagayan de Oro City
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase">
                                Permits/Certificates
                            </h2>
                            <ul className="font-medium">
                                <li className="mb-4">
                                    <a
                                        href="#"
                                        className="hover:underline break-words"
                                    >
                                        Business Permit Number: BP-33229 and
                                        Certificate Number: 2019-25829
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:underline break-words"
                                    >
                                        DTI Certificate of Business Registration
                                        No. 1033992
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:underline break-words"
                                    >
                                        Philgeps No.:201910-17877-1307663177
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:underline break-words"
                                    >
                                        NBDB No.:7515
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase">
                                Follow us
                            </h2>
                            <ul className="font-medium">
                                <li className="mb-4">
                                    <a
                                        href={import.meta.env.VITE_APP_FACEBOOK}
                                        target="_blank"
                                        className="hover:underline break-words"
                                    >
                                        Facebook
                                    </a>
                                </li>
                            </ul>
                        </div>
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
