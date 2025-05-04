import WebBanner from "@/components/web-banner";
import WebFooter from "@/components/web-footer";
import WebHeader from "@/components/web-header";

export default function WebLayout({ children, banners }) {
    return (
        <>
            <div className="min-h-svh">
                <WebHeader />
                <main>
                    <WebBanner images={banners || []} />
                    <div className="container mx-auto p-4">{children}</div>
                </main>
            </div>
            <WebFooter />
        </>
    );
}
