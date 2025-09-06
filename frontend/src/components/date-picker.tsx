"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { vi } from "react-day-picker/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  value?: Date;
  onChange?: (value: Date | undefined) => void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="justify-between font-normal"
        >
          {date ? date.toLocaleDateString() : "Chọn ngày"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          locale={vi}
          onSelect={(date) => {
            const formattedDate = date ? date.toLocaleDateString("vi-VN") : "";
            console.log("Selected date:", formattedDate);
            onChange?.(date || undefined);
            setDate(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
