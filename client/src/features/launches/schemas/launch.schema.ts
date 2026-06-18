import z from 'zod';
import { MAX_LAUNCH_VALUE_IN_CENTS, MAX_LAUNCH_VALUE_LABEL } from '../constants/moneyLimit';
import { normalizeMoneyInputToCents } from '../utils/normalizeMoneyInputToCents';

function getTodayDateInputValue() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export const launchFormSchema = z.object({
	type: z.string().min(1, 'Selecione o tipo'),
	value: z
		.string()
		.min(1, 'Informe um valor válido')
		.refine((value) => normalizeMoneyInputToCents(value) > 0, {
			message: 'Informe um valor válido',
		})
		.refine((value) => normalizeMoneyInputToCents(value) <= MAX_LAUNCH_VALUE_IN_CENTS, {
			message: `O valor deve ser menor ou igual a ${MAX_LAUNCH_VALUE_LABEL}`,
		}),
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
