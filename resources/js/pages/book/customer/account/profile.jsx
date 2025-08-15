import AccountLayout from "@/layouts/book/account-layout";
import CustomerLayout from "@/layouts/customer-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { usePage } from "@inertiajs/react";

export default function Profile() {
    const user = usePage().props.auth.user;

    return (
        <div className="p-4">
            <Tabs defaultValue="personal" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="personal">
                        Personal Information
                    </TabsTrigger>
                    <TabsTrigger value="e-book">My E-Books</TabsTrigger>
                </TabsList>
                <TabsContent value="personal">
                    <div className="grid grid-cols-3 gap-4">
                        <Input value={user.name} readOnly/>
                        <Input value={user.email}/>
                    </div>
                </TabsContent>
                <TabsContent value="e-book">
                    
                </TabsContent>
            </Tabs>
        </div>
    );
}

Profile.layout = (page) => (
    <CustomerLayout>
        <AccountLayout children={page} />
    </CustomerLayout>
);
