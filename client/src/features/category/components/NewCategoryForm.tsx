import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/providers/AuthProvider';
import { type CategoryFormData, CategoryFormSchema } from '../schemas/category.schema';
import createCategory from '../services/createCategory';
import type { CategoryRequestDto } from '../types/category.type';

import CategoryColorField from './fields/CategoryColorField';
import CategoryNameField from './fields/CategoryNameField';
import CategoryTypeField from './fields/CategoryTypeField';

type ApiErrorResponse = {
	message?: string;
};

export default function NewCategoryForm() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { control, handleSubmit, reset } = useForm<CategoryFormData>({
		resolver: zodResolver(CategoryFormSchema),
		defaultValues: {
			name: '',
			color: '',
			type: '',
		},
	});

	const categoryMutation = useMutation<
		Awaited<ReturnType<typeof createCategory>>,
		AxiosError<ApiErrorResponse>,
		CategoryRequestDto
	>({
		mutationFn: createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			categoryMutation.reset();
		},
		onError: (error: AxiosError) => {
			console.error(error.response?.data);
		},
	});

	function onSubmit(data: CategoryFormData) {
		categoryMutation.mutate({ name: data.name, categoryType: data.type, color: data.color, userId: user!.id });
		reset();
	}
	return (
		<Card className='bg-transparent overflow-auto'>
			<CardContent>
				{categoryMutation.isError && (
					<div className='text-red-500 text-sm mb-3'>
						{categoryMutation.error.response?.data.message ?? 'Erro ao criar categoria, tente novamente'}
					</div>
				)}
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<CategoryNameField control={control} />
						<div className='flex flex-col gap-5 lg:flex-row'>
							<CategoryTypeField control={control} />
							<CategoryColorField control={control} />
						</div>
						<div className='flex gap-2 items-center mt-2'>
							<span className='text-red-500'>*</span>
							<span className='text-secondary-foreground'>Campos obrigatórios</span>
						</div>
						<Button
							type='submit'
							className='cursor-pointer bg-[#1f7a6b] hover:bg-[#2fae8f] h-10 text-white'
						>
							{categoryMutation.isPending ? <Spinner /> : 'Criar Categoria'}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
