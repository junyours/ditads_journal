import WebBanner from "@/components/web-banner";
import WebFooter from "@/components/web-footer";
import WebHeader from "@/components/web-header";

export default function WebLayout({ children, banners = [] }) {
    return (
        <div className="flex min-h-svh flex-col overflow-x-clip bg-background">
            <WebHeader />

            <main className="flex-1">
                {banners.length > 0 && (
                    <section aria-label="Featured banners">
                        <WebBanner images={banners} />
                    </section>
                )}

                <div className="min-w-0">{children}</div>
            </main>

            <WebFooter />
        </div>
    );
}