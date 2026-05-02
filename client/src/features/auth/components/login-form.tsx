import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import z from 'zod';
import { Button } from '@/components/ui/button';
import HookFormInput from './hook-form-input';

const FormLoginDataSchema = z.object({
	email: z.email('Digite um email válido'),
	password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type FormLoginData = z.infer<typeof FormLoginDataSchema>;

export default function LoginForm({ ...props }: React.ComponentProps<'form'>) {
	const { handleSubmit, control } = useForm<FormLoginData>({
		resolver: zodResolver(FormLoginDataSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});
	function onSubmit(data: FormLoginData) {
		console.log(data);
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
