import React from "react";

interface ActionButtonProps {
	onClick: () => void;
	icon: React.ReactNode;
	text: string;
	color: "blue" | "green" | "red";
}

const ActionButton: React.FC<ActionButtonProps> = React.memo(
	({ onClick, icon, text, color }) => {
		const colorClasses = {
			blue: "bg-white dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-blue-500 dark:hover:text-gray-900 border-2 border-blue-500 hover:bg-blue-500 hover:border-blue-600 text-blue-600 hover:text-white",
			green: "bg-white dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-green-500 dark:hover:text-gray-900 border-2 border-green-500 hover:bg-green-500 hover:border-green-600 text-green-600 hover:text-white",
			red: "bg-white dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-red-500 dark:hover:text-gray-900 border-2 border-red-500 hover:bg-red-500 hover:border-red-600 text-red-600 hover:text-white",
		};

		return (
			<button
				onClick={onClick}
				className={`${colorClasses[color]} px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300 text-sm sm:text-base min-w-[120px] sm:min-w-[150px]`}
			>
				{icon}
				<span className="ml-2">{text}</span>
			</button>
		);
	}
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
