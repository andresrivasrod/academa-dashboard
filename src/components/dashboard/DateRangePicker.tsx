
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  value: { from: Date; to: Date };
  onChange: (range: { from: Date; to: Date }) => void;
}

const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const [date, setDate] = useState<{ from: Date; to: Date }>(value);

  const lastWeek = () => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 7);
    setDate({ from, to });
  };

  const lastMonth = () => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 30);
    setDate({ from, to });
  };

  const last3Months = () => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 90);
    setDate({ from, to });
  };

  useEffect(() => {
    onChange(date);
  }, [date, onChange]);

  return (
    <div className="flex flex-wrap gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>
              {format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from}
            selected={{ from: date.from, to: date.to }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setDate({ from: range.from, to: range.to });
              }
            }}
            numberOfMonths={2}
            className={cn("p-3 pointer-events-auto bg-gray-800 text-white")}
          />
        </PopoverContent>
      </Popover>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={lastWeek}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          Week
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={lastMonth}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          Month
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={last3Months}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          3 Months
        </Button>
      </div>
    </div>
  );
};

export default DateRangePicker;
