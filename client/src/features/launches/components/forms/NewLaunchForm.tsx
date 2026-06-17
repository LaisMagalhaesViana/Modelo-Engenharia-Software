import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { CircleCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useAuth } from '@/providers/AuthProvider';
import type { CategoryType } from '@/types/category';
import { type LaunchFormData, launchFormSchema } from '../../schemas/launch.schema';
import createLaunches from '../../services/createLaunches';
import type { LaunchRequestDto } from '../../types/launches.type';
import CategoryField from '../fields/CategoryField';
import DateField from '../fields/DateField';
import DescriptionField from '../fields/DescriptionField';
import LaunchTypeField from '../fields/LaunchTypeField';
import MoneyValueField from '../fields/MoneyValueField';

type ApiErrorResponse = {
	error?: string;
	message?: string;
	statusCode: number;
};

export default function NewLaunchForm() {
	const [successDialogOpen, setSuccessDialogOpen] = useState(false);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const { control, handleSubmit, reset } = useForm<LaunchFormData>({
		resolver: zodResolver(launchFormSchema),
		defaultValues: {
			type: '',
			value: '',
			date: '',
			categoryId: '',
			description: '',
		},
	});

	const launchMutation = useMutation<
		Awaited<ReturnType<typeof createLaunches>>,
		AxiosError<ApiErrorResponse>,
		LaunchRequestDto
	>({
		mutationFn: createLaunches,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['launches'] });
			launchMutation.reset();
			setSuccessDialogOpen(true);
		},
		onError: (error: AxiosError) => {
			console.error(error.response?.data);
		},
	});

	function onSubmit(data: LaunchFormData) {
		const value = Number(
			data.value
				.replace(/\./g, '')
				.replace(',', '.')
				.replace(/[^\d.-]/g, ''),
		);

		const payload: LaunchRequestDto = {
			userId: user!.id,
			categoryId: data.categoryId,
			type: data.type as CategoryType,
			value: value,
			date: data.date,
			description: data.description,
		};

		launchMutation.mutate(payload);
	}

	return (
		<Card className='flex-1 bg-transparent overflow-auto'>
			<CardContent>
				{launchMutation.isError && (
					<div className='text-red-500 text-sm mb-3'>{launchMutation.error.response?.data.message}</div>
				)}
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<LaunchTypeField control={control} />
						<MoneyValueField control={control} />
						<div className='flex flex-col gap-5 lg:flex-row'>
							<DateField control={control} />
							<CategoryField control={control} />
						</div>

						<DescriptionField control={control} />

						<div className='flex gap-2 items-center mt-2'>
							<span className='text-red-500'>*</span>
							<span className='text-secondary-foreground'>Campos obrigatórios</span>
						</div>
						<div className='flex justify-end gap-2 '>
							<Button
								type='button'
								className='h-10 cursor-pointer bg-transparent hover:bg-zinc-200 text-secondary-foreground border border-secondary-foreground dark:bg-white dark:hover:bg-zinc-300'
								onClick={() => {
									reset();

									navigate(paths.app.launches.getHref());
								}}
							>
								Cancelar
							</Button>
							<Button
								type='submit'
								disabled={launchMutation.isPending}
								className='cursor-pointer bg-[#1f7a6b] hover:bg-[#2fae8f] h-10 text-white'
							>
								{launchMutation.isPending ? <Spinner /> : 'Salvar Lançamento'}
							</Button>
						</div>
					</FieldGroup>
				</form>
			</CardContent>
			<Dialog
				open={successDialogOpen}
				onOpenChange={(open) => {
					setSuccessDialogOpen(open);

					if (!open) {
						navigate(paths.app.launches.getHref());
					}
				}}
			>
				<DialogContent className='text-center sm:max-w-md'>
					<DialogHeader className='items-center'>
						<div className='flex size-14 items-center justify-center rounded-full bg-green-100 text-green-700'>
							<CircleCheck className='size-8' />
						</div>
						<DialogTitle>Lançamento salvo com sucesso!</DialogTitle>
						<DialogDescription>O saldo foi atualizado automaticamente.</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
