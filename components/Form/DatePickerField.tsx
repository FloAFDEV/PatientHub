import React from "react";
import { Controller, Control, FieldValues } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerFieldProps {
	name: string;
	control: Control<FieldValues>;
	label: string;
	rules?: Record<string, any>;
	error?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
	name,
	control,
	label,
	rules,
	error,
}) => (
	<div className="flex flex-col">
		<label
			htmlFor={name}
			className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300"
		>
			{label} <span className="text-red-500">*</span>
		</label>
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { onChange, onBlur, value } }) => (
				<DatePicker
					selected={value}
					onChange={onChange}
					onBlur={onBlur}
					dateFormat="dd/MM/yyyy"
					className="w-full p-2 border border-blue-500 rounded-md focus:outline-none focus:border-violet-500 dark:bg-gray-900 dark:text-gray-200 transition duration-200 ease-in-out text-sm"
					placeholderText="Sélectionnez une date"
				/>
			)}
		/>
		{error && <p className="text-red-600 text-sm mt-1">{error}</p>}
	</div>
);

export default DatePickerField;
