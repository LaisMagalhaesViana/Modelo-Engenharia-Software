import { MAX_LAUNCH_VALUE_IN_CENTS } from '../constants/moneyLimit';

export function maskMoneyInput(value: string, previousValue?: string): string {
	const isDeleting = previousValue !== undefined && value.length < previousValue.length;

	let numbers = value.replace(/\D/g, '');

	if (isDeleting) {
		const prevNumbers = previousValue?.replace(/\D/g, '') ?? '';

		if (numbers.length === prevNumbers.length) {
			numbers = numbers.slice(0, -1);
		}
	}

	if (!numbers) return '';

	if (Number(numbers) > MAX_LAUNCH_VALUE_IN_CENTS) {
		return previousValue ?? '';
	}

	const amount = Number(numbers) / 100;

	return new Intl.NumberFormat('pt-BR', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
}
