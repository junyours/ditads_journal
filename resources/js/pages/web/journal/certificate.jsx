import ISI from "../../../../../public/images/certificates/isi.png";

const images = [ISI];

export default function Certificate() {
    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
                <div
                    key={index}
                    className="size-full border p-4 flex items-center"
                >
                    <img
                        src={image}
                        alt={`certificate-${index}`}
                        className="object-contain"
                    />
                </div>
            ))}
        </div>
    );
}
