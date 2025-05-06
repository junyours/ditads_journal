import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { Toaster } from "./components/ui/sonner";
import { SecurityProvider } from "./components/security-modal";

createInertiaApp({
    title: () => import.meta.env.VITE_APP_NAME,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.jsx`,
            import.meta.glob("./pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <SecurityProvider>
                    <App {...props} />
                </SecurityProvider>
                <Toaster position="top-right" />
            </>
        );
    },
    progress: {
        color: "#22c55e",
    },
});
