import { type Control, Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { LaunchFormData } from '../../schemas/launch.schema';

interface DescriptionFieldProps {
	control: Control<LaunchFormData>;
}

export default function DescriptionField({ control }: DescriptionFieldProps) {
	return (
		<Controller
			control={control}
			name='description'
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel>
						Descrição <span className='text-red-500'>*</span>
					</FieldLabel>

					<Input
						{...field}
						type='text'
						className='focus-visible:ring-[#1f7a6b] dark:bg-transparent h-14'
						placeholder='Ex: Compra no supermercado Pão de Açúcar'
						maxLength={100}
					/>

					<div className='flex justify-between'>
						<div>{fieldState.invalid && <FieldError errors={[fieldState.error]} />}</div>
						<div className='text-xs text-muted-foreground text-right'>
							{field.value?.length || 0}/100 caracteres
						</div>
					</div>
				</Field>
			)}
		/>
	);
}
