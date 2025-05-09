
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto w-full", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-6 w-6 sm:h-7 sm:w-7 bg-transparent p-0 opacity-50 hover:opacity-100 dark:border-gray-700 dark:hover:bg-gray-800"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full justify-between",
        head_cell:
          "text-muted-foreground rounded-md w-full font-normal text-[0.7rem] xs:text-xs sm:text-[0.8rem] flex-1 text-center",
        row: "flex w-full mt-2 justify-between",
        cell: "relative p-0 text-center text-xs sm:text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md flex-1 dark:[&:has([aria-selected])]:bg-gray-800",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 p-0 font-normal aria-selected:opacity-100 dark:hover:bg-gray-800 dark:hover:text-white"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground dark:bg-primary dark:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground dark:bg-gray-700 dark:text-gray-100",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30 dark:text-gray-500",
        day_disabled: "text-muted-foreground opacity-50 dark:text-gray-600",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground dark:aria-selected:bg-gray-800 dark:aria-selected:text-gray-300",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
