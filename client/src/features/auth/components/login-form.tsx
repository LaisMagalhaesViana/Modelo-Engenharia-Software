import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { type FormLoginData, FormLoginDataSchema, useLogin } from '@/lib/auth';
import HookFormInput from './hook-form-input';

interface LoginFormProps extends React.ComponentProps<'form'> {
	onSuccess: () => void;
}

export default function LoginForm({ onSuccess, ...props }: LoginFormProps) {
	const login = useLogin({
		onSuccess,
	});
	const { handleSubmit, control } = useForm<FormLoginData>({
		resolver: zodResolver(FormLoginDataSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});
	function onSubmit(data: FormLoginData) {
		login.mutate(data);
	}
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			{...props}
			className='space-y-4'
		>
			<HookFormInput
				control={control}
				id='email'
				name='email'
				placeholder='Digite seu email'
				type='email'
				label='Email'
			/>
			<HookFormInput
				control={control}
				id='password'
				name='password'
				placeholder='Digite sua senha'
				type='password'
				label='Senha'
			/>
			<Link
				to={'/auth/forgot-password'}
				className='text-end w-full block text-sm'
			>
				Esqueceu a senha?
			</Link>
			<Button
				type='submit'
				className='w-full cursor-pointer mt-4 mb-4 bg-[#1f7a6b] hover:bg-[#2fae8f] h-10 text-white'
			>
				Entrar
			</Button>
		</form>
	);
}
