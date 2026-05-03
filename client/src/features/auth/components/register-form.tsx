import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { type FormRegisterData, FormRegisterDataSchema, useRegister } from '@/lib/auth';
import HookFormInput from './hook-form-input';

interface RegisterFormProps extends React.ComponentProps<'form'> {
	onSuccess: () => void;
}

export default function RegisterForm({ onSuccess, ...props }: RegisterFormProps) {
	const registering = useRegister({ onSuccess });

	const { handleSubmit, control } = useForm<FormRegisterData>({
		resolver: zodResolver(FormRegisterDataSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			monthlyIncome: '',
		},
	});
	async function onSubmit(data: FormRegisterData) {
		registering.mutate(data);
	}
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			{...props}
			className='space-y-4'
		>
			<HookFormInput
				control={control}
				id='name'
				name='name'
				placeholder='Digite seu nome'
				type='text'
				label='Nome'
			/>
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
			<HookFormInput
				control={control}
				id='phoneNumber'
				name='phoneNumber'
				placeholder='(71) 99999-9999'
				type='text'
				label='Telefone'
			/>
			<HookFormInput
				control={control}
				id='monthlyIncome'
				name='monthlyIncome'
				placeholder='Digite seus ganhos mensais'
				type='text'
				label='Ganhos mensais'
			/>
			<Button
				type='submit'
				className='w-full cursor-pointer mt-4 mb-4 bg-[#1f7a6b] hover:bg-[#2fae8f] h-10 text-white'
			>
				Comece agora
			</Button>
		</form>
	);
}
