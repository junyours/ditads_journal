import React, { useState, useMemo } from "react";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export default function Dashboard() {
    const { chartData = [] } = usePage().props;

    const years = Array.from(
        new Set(chartData.map((item) => new Date(item.date).getFullYear()))
    ).sort((a, b) => b - a);

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(String(currentYear));

    const monthlyData = useMemo(() => {
        const data = Array(12)
            .fill(0)
            .map((_, index) => ({
                month: monthLabels[index],
                imrj: 0,
                jebmpa: 0,
            }));

        chartData.forEach((item) => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth();

            if (String(year) === selectedYear) {
                data[month].imrj += item.imrj || 0;
                data[month].jebmpa += item.jebmpa || 0;
            }
        });

        return data;
    }, [chartData, selectedYear]);

    const chartConfig = {
        imrj: {
            label: "IMRJ",
        },
        jebmpa: {
            label: "JEBMPA",
        },
    };

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Research Journals</CardTitle>
                    <CardDescription>
                        Showing journal publications for {selectedYear}
                    </CardDescription>
                </div>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={monthlyData}>
                        <linearGradient
                            id="fillIMRJ"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        ></linearGradient>
                        <linearGradient
                            id="fillJEBMPA"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        ></linearGradient>

                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            minTickGap={0}
                            padding={{ left: 5, right: 5 }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => value}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="imrj"
                            type="natural"
                            fill="#CDB797"
                            stroke="#CDB797"
                            stackId="a"
                        />
                        <Area
                            dataKey="jebmpa"
                            type="natural"
                            fill="#96AEA6"
                            stroke="#96AEA6"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

Dashboard.layout = (page) => <AppLayout children={page} title="Dashboard" />;
