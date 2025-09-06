"use client";

import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { vi } from "react-day-picker/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";

type DatePickerProps = {
  value?: DateRange;
  onChange?: (value?: DateRange) => void;
};

export function DateRangePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>(value);
  const displayDate = date?.from
    ? date.to
      ? `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
      : date.from.toLocaleDateString()
    : "Chọn ngày";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="justify-between font-normal"
        >
          {displayDate}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          locale={vi}
          selected={date}
          onSelect={(date) => {
            onChange?.(date);
            setDate(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
