import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface HookFormInputProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	id: string;
	placeholder?: string;
	label: string;
	type: React.HTMLInputTypeAttribute;
}

export default function HookFormInput<T extends FieldValues>({
	control,
	type,
	id,
	name,
	placeholder,
	label,
}: HookFormInputProps<T>) {
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const isPassword = type === 'password';
	const inputType = isPassword && showPassword ? 'text' : type;
	const IconPassword = showPassword ? Eye : EyeClosed;
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={id}>{label}</FieldLabel>
					<div className='relative'>
						<Input
							id={id}
							{...field}
							aria-invalid={fieldState.invalid}
							placeholder={placeholder}
							className='h-10 focus-visible:ring-green-500'
							autoComplete='off'
							type={inputType}
						/>
						{isPassword && (
							<IconPassword
								className='absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer'
								width={18}
								onClick={() => setShowPassword(!showPassword)}
								onMouseDown={(e) => e.preventDefault()}
							/>
						)}
					</div>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
