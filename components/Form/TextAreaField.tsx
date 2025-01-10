import React from "react";
import { Controller } from "react-hook-form";

interface TextAreaFieldProps {
	name: string;
	control: any;
	label: string;
	placeholder?: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
	name,
	control,
	label,
	placeholder,
}) => (
	<div className="flex flex-col">
		<label
			htmlFor={name}
			className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300"
		>
			{label}
		</label>
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<textarea
					{...field}
					id={name}
					placeholder={placeholder}
					className="w-full p-2 border border-blue-500 rounded-md focus:outline-none focus:border-violet-500 dark:bg-gray-900 dark:text-gray-200 transition duration-200 ease-in-out text-sm"
				/>
			)}
		/>
	</div>
);

export default TextAreaField;
