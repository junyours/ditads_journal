import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import User from "../../../../../public/images/user.png";

export default function EditorialBoard({ editors }) {
    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {editors.map((editor, index) => (
                <Card key={index} className="shadow-none">
                    <div className="h-[250px] w-full">
                        <img
                            src={editor.avatar ?? User}
                            alt="avatar"
                            className="object-contain size-full rounded-t-lg"
                        />
                    </div>
                    <CardHeader className="space-y-4">
                        <div className="space-y-2">
                            <div>
                                <h1 className="font-medium">{editor.name}</h1>
                                <a
                                    href={`mailto:${editor.email}`}
                                    className="text-xs hover:underline"
                                >
                                    {editor.email}
                                </a>
                            </div>
                            <CardTitle>
                                {editor.position}
                            </CardTitle>
                        </div>
                        <CardDescription>{editor.department}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}
