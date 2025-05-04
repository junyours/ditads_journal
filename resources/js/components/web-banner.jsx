import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function WebBanner({ images }) {
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
        <img src={images[0]} alt="image-0" className="w-full object-contain" />
    );
}
