import React from "react";
import { Controller } from "react-hook-form";

interface FormFieldProps {
	name: string;
	control: any;
	label: string;
	placeholder?: string;
	required?: boolean;
	rules?: any;
	error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
	name,
	control,
	label,
	placeholder,
	required,
	rules,
	error,
}) => (
	<div className="flex flex-col">
		<label
			htmlFor={name}
			className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300"
		>
			{label} {required && <span className="text-red-500">*</span>}
		</label>
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field }) => (
				<input
					{...field}
					id={name}
					placeholder={placeholder}
					className="w-full text-sm p-2 border border-blue-500 rounded-md focus:outline-none focus:border-violet-500 dark:bg-gray-900 dark:text-gray-200 transition duration-200 ease-in-out"
				/>
			)}
		/>
		{error && <p className="text-red-600 text-sm mt-1">{error}</p>}
	</div>
);

export default FormField;
