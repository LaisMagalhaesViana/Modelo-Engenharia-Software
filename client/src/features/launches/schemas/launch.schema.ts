import z from 'zod';

function getTodayDateInputValue() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export const launchFormSchema = z.object({
	type: z.string().min(1, 'Selecione o tipo'),
	value: z.string().min(0.01, 'Informe um valor válido'),
	date: z
		.string()
		.min(1, 'Informe a data')
		.refine((date) => date <= getTodayDateInputValue(), {
			message: 'A data não pode ser maior que hoje',
		}),
	categoryId: z.string().min(1, 'Selecione uma categoria'),
	description: z
		.string()
		.min(3, 'Insira uma descrição valida')
		.max(100, 'A descrição deve ter no máximo 100 caracteres'),
});

export type LaunchFormData = z.infer<typeof launchFormSchema>;
