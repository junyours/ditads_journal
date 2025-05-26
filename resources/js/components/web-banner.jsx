import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "./ui/button";
import { usePage } from "@inertiajs/react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function WebBanner({ images }) {
    const currentPath = window.location.pathname;
    const user = usePage().props.auth.user;
    const isMobile = useIsMobile();

    return images.length > 1 ? (
        <Carousel
            opts={{
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 5000,
                    stopOnInteraction: false,
                }),
            ]}
        >
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index} className="p-0">
                        <img
                            src={image}
                            alt={`image-${index}`}
                            className="w-full object-contain"
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    ) : (
        <div className="relative">
            <img
                src={images[0]}
                alt="image-0"
                className="w-full object-contain"
            />
            {currentPath === "/research-journal" &&
                (!user || user.role === "author") && (
                    <div className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4">
                        <a href="mailto:ditadsimrj@ditadsinternationalmultidisciplinaryresearchjournal.net">
                            <Button
                                size={isMobile ? "sm" : "default"}
                                variant="outline"
                            >
                                Submit Journal via Email
                            </Button>
                        </a>
                    </div>
                )}
        </div>
    );
}
