export default function Magazine({ magazines }) {
    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {magazines.map((magazine, index) => (
                <img
                    key={index}
                    src={magazine.cover_page}
                    alt="magazine"
                    className="object-contain size-80"
                />
            ))}
        </div>
    );
}
