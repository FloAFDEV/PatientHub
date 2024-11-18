import * as React from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";

function Calendar({
	className,
	...props
}: React.ComponentProps<typeof DayPicker>) {
	return (
		<DayPicker
			locale={fr}
			className={`p-4 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-lg ${className}`}
			classNames={{
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
				month: "space-y-8",
				caption: "flex justify-between items-center pt-1 relative",
				caption_label: "text-lg font-semibold",
				nav: "flex items-center space-x-4",
				nav_button:
					"h-8 w-8 bg-gray-200 dark:bg-gray-600 p-0 flex items-center justify-center rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition",
				nav_button_previous: "order-first",
				nav_button_next: "order-last",
				table: "w-full border-collapse",
				head_row: "flex",
				head_cell:
					"text-gray-600 dark:text-gray-400 rounded-md w-9 font-medium text-sm",
				row: "flex w-full",
				cell: "relative h-10 w-10 text-center text-sm p-0",
				day: "h-10 w-10 p-1 text-center font-medium text-gray-800 dark:text-gray-200 rounded-full hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors",
				day_selected:
					"bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 font-semibold rounded-full",
				day_today:
					"bg-yellow-100 text-yellow-500 text-yellow-500 dark:bg-orange-400 dark:text-white font-semibold rounded-full",
				// Appliquer les styles aux jours extérieurs
				day_outside:
					"text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 opacity-70", // Ajouter bordure et fond
				day_disabled:
					"text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed",
				day_hidden: "invisible",
			}}
			modifiers={{
				weekend: (date: Date) => [0, 6].includes(date.getDay()),
				today: (date: Date) =>
					date.toDateString() === new Date().toDateString(),
				// Modifier pour les jours extérieurs
				outside: (date: Date) => {
					const today = new Date();
					const firstDayOfMonth = new Date(
						today.getFullYear(),
						today.getMonth(),
						1
					);
					const lastDayOfMonth = new Date(
						today.getFullYear(),
						today.getMonth() + 1,
						0
					);
					return date < firstDayOfMonth || date > lastDayOfMonth;
				},
			}}
			modifiersClassNames={{
				weekend: "text-red-500 dark:text-red-500 font-semibold",
				today: "bg-yellow-100 text-yellow-700 dark:bg-orange-600 dark:text-white rounded-full font-thin",
				// Appliquer un style spécifique aux jours extérieurs
				outside:
					"text-gray-400 dark:text-gray-500 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 opacity-70", // ajouter une bordure et fond
			}}
			showOutsideDays
			disabled={(date) => date < new Date()} // Disable past dates (optional)
			{...props}
		/>
	);
}

export { Calendar };
