import z from 'zod';

export const FormRegisterDataSchema = z.object({
	name: z
		.string()
		.min(2, 'Digite um nome válido')
		.regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'O nome não pode conter números ou símbolos'),
	email: z.email('Digite um email válido'),
	password: z
		.string()
		.min(8, 'A senha deve ter no mínimo 8 caracteres')
		.refine((val) => /[A-Z]/.test(val), {
			message: 'A senha deve conter pelo menos uma letra maiúscula',
		})
		.refine((val) => /[a-z]/.test(val), {
			message: 'A senha deve conter pelo menos uma letra minúscula',
		})
		.refine((val) => /[0-9]/.test(val), {
			message: 'A senha deve conter pelo menos um número',
		})
		.refine((val) => /[^A-Za-z0-9]/.test(val), {
			message: 'A senha deve conter pelo menos um símbolo (ex: !@#$%)',
		}),
	phoneNumber: z
		.string()
		.regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Digite um telefone válido')
		.optional()
		.or(z.literal('')),
	monthlyIncome: z
		.string()
		.refine((val) => {
			const clean = val.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
			return !Number.isNaN(Number(clean));
		}, 'Valor inválido')
		.refine((val) => {
			const clean = val.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
			return Number(clean) >= 0;
		}, 'O valor deve ser maior ou igual a zero')
		.optional(),
});

export type FormRegisterData = z.infer<typeof FormRegisterDataSchema>;

export const FormLoginDataSchema = z.object({
	email: z.email('Digite um email válido'),
	password: z.string(),
});

export type FormLoginData = z.infer<typeof FormLoginDataSchema>;

export const FormForgotPasswordDataSchema = z.object({
	email: z.email('Digite um email valido'),
});

export type FormForgotPasswordData = z.infer<typeof FormForgotPasswordDataSchema>;

export const FormResetPasswordDataSchema = z
	.object({
		password: z
			.string()
			.min(8, 'A senha deve ter no mínimo 8 caracteres')
			.refine((val) => /[A-Z]/.test(val), {
				message: 'A senha deve conter pelo menos uma letra maiúscula',
			})
			.refine((val) => /[a-z]/.test(val), {
				message: 'A senha deve conter pelo menos uma letra minúscula',
			})
			.refine((val) => /[0-9]/.test(val), {
				message: 'A senha deve conter pelo menos um número',
			})
			.refine((val) => /[^A-Za-z0-9]/.test(val), {
				message: 'A senha deve conter pelo menos um símbolo (ex: !@#$%)',
			}),
		confirmPassword: z.string().min(8, 'Confirme sua senha'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'As senhas devem ser iguais',
		path: ['confirmPassword'],
	});

export type FormResetPasswordData = z.infer<typeof FormResetPasswordDataSchema>;

export type AuthRegisterResponse = {
	name: string;
	id: string;
	email: string;
	createdAt: Date;
	hashedPassword: string;
	role: Role;
	monthlyIncome: number;
	phoneNumber: string;
	updatedAt: Date;
};

export type AuthLoginResponse = {
	token: string;
	user: User;
};

type Role = 'USER' | 'ADMIN';

export type User = {
	name: string;
	id: string;
	email: string;
	createdAt: Date;
	hashedPassword: string;
	role: Role;
	monthlyIncome: number;
	phoneNumber: string;
	updatedAt: Date;
};
