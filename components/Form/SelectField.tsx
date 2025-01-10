import React from "react";
import { Controller } from "react-hook-form";

interface SelectFieldProps {
	name: string;
	control: any;
	label: string;
	options: Record<string, string>;
	required?: boolean;
	rules?: any;
	error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
	name,
	control,
	label,
	options,
	required,
	rules,
	error,
}) => (
	<div className="flex flex-col">
		<label
			htmlFor={name}
			className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-400"
		>
			{label} {required && <span className="text-red-500">*</span>}
		</label>
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field }) => (
				<select
					{...field}
					id={name}
					className="w-full text-sm p-2 border text-gray-500 border-blue-500 rounded-md focus:outline-none focus:border-violet-500 dark:bg-gray-900 dark:text-gray-200 transition duration-200 ease-in-out"
				>
					<option className="text-gray-500" value="">
						Sélectionnez une option
					</option>
					{Object.entries(options).map(([value, label]) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</select>
			)}
		/>
		{error && <p className="text-red-600 text-sm mt-1">{error}</p>}
	</div>
);

export default SelectField;
