import { configureAuth } from 'react-query-auth';
import { Navigate, useLocation } from 'react-router';
import { z } from 'zod';
import { paths } from '@/config/paths';
import type { AuthResponse } from '@/types/api';
import { api } from './api-client';

export const FormRegisterDataSchema = z.object({
	name: z.string().min(1, 'Digite um nome válido'),
	email: z.email('Digite um email válido'),
	password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
	phoneNumber: z
		.string()
		.min(10, 'Digite um telefone válido')
		.refine(
			(val) => {
				const numbers = val.replace(/\D/g, '');
				return numbers.length === 10 || numbers.length === 11;
			},
			{
				message: 'Digite um telefone brasileiro válido',
			},
		),
	monthlyIncome: z
		.string()
		.min(1, 'Digite um valor')
		.refine((val) => !Number.isNaN(Number(val)) && val.trim() !== '', {
			message: 'Digite um número válido, se estiver utilizando vírgula, use o ponto',
		})
		.refine((val) => Number(val) >= 0, { message: 'O rendimento deve ser maior ou igual a zero' }),
});

export type FormRegisterData = z.infer<typeof FormRegisterDataSchema>;

export const FormLoginDataSchema = z.object({
	email: z.email('Digite um email válido'),
	password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export type FormLoginData = z.infer<typeof FormLoginDataSchema>;

function registerWithEmailAndPassword(data: FormRegisterData): Promise<AuthResponse> {
	const payload = {
		...data,
		monthlyIncome: Number(data.monthlyIncome),
	};
	return api.post('auth/signup', payload);
}

const loginWithEmailAndPassword = (data: FormLoginData): Promise<AuthResponse> => {
	return api.post('/auth/signin', data);
};

const authConfig = {
	userFn: async () => {
		return null;
	},
	loginFn: async (data: FormLoginData) => {
		const response = await loginWithEmailAndPassword(data);
		console.log(response);
		return response;
	},
	registerFn: async (data: FormRegisterData) => {
		const response = await registerWithEmailAndPassword(data);
		return response;
	},
	logoutFn: async () => {
		return null;
	},
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } = configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const user = useUser();
	const location = useLocation();

	if (!user.data) {
		return (
			<Navigate
				to={paths.auth.login.getHref(location.pathname)}
				replace
			/>
		);
	}

	return children;
};
