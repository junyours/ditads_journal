import AccountLayout from "@/layouts/book/account-layout";
import CustomerLayout from "@/layouts/customer-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Order() {
    return (
        <div className="p-4">
            <Tabs defaultValue="preparing" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="preparing">Preparing</TabsTrigger>
                    <TabsTrigger value="to-ship">To Ship</TabsTrigger>
                    <TabsTrigger value="to-receive">To Receive</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="preparing"></TabsContent>
                <TabsContent value="to-ship"></TabsContent>
                <TabsContent value="to-receive"></TabsContent>
                <TabsContent value="completed"></TabsContent>
            </Tabs>
        </div>
    );
}

Order.layout = (page) => (
    <CustomerLayout>
        <AccountLayout children={page} />
    </CustomerLayout>
);
