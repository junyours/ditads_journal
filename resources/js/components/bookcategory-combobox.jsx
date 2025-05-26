import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";
import { useForm } from "@inertiajs/react";
import InputError from "./input-error";

export default function BookCategoryCombobox({ value, setValue, options }) {
    const [open, setOpen] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
        });

    const handleAdd = () => {
        clearErrors();
        post("/admin/others/book-categories/add", {
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
        });
    };

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value
                            ? options.find((option) => option.id === value)
                                  ?.name
                            : "Select"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <div className="flex items-center">
                            <CommandInput placeholder="Search" />
                            <Button
                                onClick={() => setIsOpen(true)}
                                variant="ghost"
                                size="sm"
                                className="mr-1"
                            >
                                Add
                            </Button>
                        </div>
                        <CommandList>
                            <CommandEmpty>No search found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.id}
                                        value={option.id}
                                        onSelect={() => {
                                            setValue(option.id);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === option.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {option.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <Dialog
                open={isOpen}
                onOpenChange={() => {
                    if (!processing) {
                        setIsOpen(false);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Book Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-1">
                        <Textarea
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAdd} disabled={processing}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
