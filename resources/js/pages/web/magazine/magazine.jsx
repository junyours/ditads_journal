import { router } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

export default function Magazine({ magazines }) {
    const [loading, setLoading] = useState(false);

    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {magazines.map((magazine, index) => (
                <div
                    key={index}
                    onClick={async () => {
                        if (!loading) {
                            setLoading(true);
                            const res = await axios.get("/api/magazine-hash", {
                                params: {
                                    cover_file_id: magazine.cover_file_id,
                                },
                            });

                            const hash = res.data.hash;
                            router.visit(`/flip-magazine/${hash}`, {
                                onFinish: () => {
                                    setLoading(false);
                                },
                            });
                        }
                    }}
                    className={`relative ${!loading ? "cursor-pointer" : ""}`}
                >
                    <img
                        src={`https://lh3.googleusercontent.com/d/${magazine.cover_file_id}`}
                        alt={`magazine-${index}`}
                        className="object-contain size-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        {loading && <ClipLoader color="green" />}
                    </div>
                </div>
            ))}
        </div>
    );
}
