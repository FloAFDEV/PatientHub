import * as React from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";

function Calendar({ className, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      locale={fr}
      className={`p-3 bg-white dark:bg-gray-800 rounded-lg ${className}`}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-gray-500 dark:text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative",
        day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors",
        day_selected: "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
        day_today: "bg-gray-100 dark:bg-gray-700 font-semibold",
        day_outside: "text-gray-400 dark:text-gray-500 opacity-50",
        day_disabled: "text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed",
        day_hidden: "invisible",
      }}
      showOutsideDays={true}
      disabled={(date) => date < new Date() || date.getDay() === 0}
      {...props}
    />
  );
}

export { Calendar };