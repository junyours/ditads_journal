import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "./ui/button";
import { router, usePage } from "@inertiajs/react";

export default function WebBanner({ images }) {
    const currentPath = window.location.pathname;
    const user = usePage().props.auth.user;

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
                    <div className="absolute right-4 bottom-4">
                        <Button
                            onClick={() =>
                                router.visit("/author/journal/requests")
                            }
                        >
                            Submit Journal
                        </Button>
                    </div>
                )}
        </div>
    );
}
