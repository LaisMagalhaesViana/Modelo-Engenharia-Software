import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
import HookFormInput from './hook-form-input';

const FormRegisterDataSchema = z.object({
	name: z.string().min(1, 'Digite um nome válido'),
	email: z.email('Digite um email válido'),
	password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
	monthlyIncome: z
		.string()
		.min(1, 'Digite um valor')
		.refine((val) => !Number.isNaN(Number(val)) && val.trim() !== '', {
			message: 'Digite um número válido, se estiver utilizando vírgula, use o ponto',
		})
		.refine((val) => Number(val) >= 0, { message: 'O rendimento deve ser maior ou igual a zero' }),
});

type FormRegisterData = z.infer<typeof FormRegisterDataSchema>;

export default function RegisterForm({ ...props }: React.ComponentProps<'form'>) {
	const { handleSubmit, control } = useForm<FormRegisterData>({
		resolver: zodResolver(FormRegisterDataSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			monthlyIncome: '',
		},
	});
	function onSubmit(data: FormRegisterData) {
		const payload = {
			...data,
			monthlyIncome: Number(data.monthlyIncome),
		};
		console.log(payload);
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
				id='monthlyIncome'
				name='monthlyIncome'
				placeholder='Digite seus ganhos mensais'
				type='text'
				label='Ganhos mensais'
			/>
			<Button
				type='submit'
				className='w-full cursor-pointer mt-4 mb-4 bg-green-600 hover:bg-green-500 h-10 text-white'
			>
				Comece agora
			</Button>
		</form>
	);
}
