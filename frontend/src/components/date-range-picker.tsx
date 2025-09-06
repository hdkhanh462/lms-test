"use client";

import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
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

  const formatedDate = {
    from: date?.from
      ? date.from instanceof Date
        ? date.from
        : new Date(date.from)
      : undefined,
    to: date?.to
      ? date.to instanceof Date
        ? date.to
        : new Date(date.to)
      : undefined,
  };

  const displayDate =
    formatedDate.from && formatedDate.to
      ? `${formatedDate.from.toLocaleDateString()} - ${formatedDate.to.toLocaleDateString()}`
      : "Chọn ngày";

  useEffect(() => {
    setDate(value);
  }, [value]);

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
