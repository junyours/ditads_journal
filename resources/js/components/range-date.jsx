import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function RangeDatePicker({
    value,
    onChange,
    disabled,
    numberOfMonths = 2,
    placeholder = "Select date range",
}) {
    // Convert value to Calendar expected structure
    const selectedRange = {
        from: value?.from_date ? new Date(value.from_date) : undefined,
        to: value?.to_date ? new Date(value.to_date) : undefined,
    };

    const displayLabel =
        selectedRange.from && selectedRange.to
            ? `${format(selectedRange.from, "LLL dd, yyyy")} - ${format(
                  selectedRange.to,
                  "LLL dd, yyyy"
              )}`
            : placeholder;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedRange.from && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {displayLabel}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    numberOfMonths={numberOfMonths}
                    selected={selectedRange}
                    onSelect={(range) => {
                        onChange({
                            from_date: range?.from || null,
                            to_date: range?.to || null,
                        });
                    }}
                    defaultMonth={selectedRange.from}
                    disabled={disabled}
                    className="rounded-lg border shadow-sm"
                />
            </PopoverContent>
        </Popover>
    );
}
