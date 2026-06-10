import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import HookFormInput from '@/features/auth/components/hook-form-input';
import { resetPassword } from '@/lib/api-client';
import { type FormResetPasswordData, FormResetPasswordDataSchema } from '@/types/user';

type PasswordRequirement = {
	label: string;
	isValid: boolean;
};

function PasswordRequirementItem({ label, isValid }: PasswordRequirement) {
	const Icon = isValid ? CheckCircle2 : Circle;

	return (
		<li className={isValid ? 'flex items-center gap-2 text-[#1f7a6b]' : 'flex items-center gap-2 text-muted-foreground'}>
			<Icon className='size-4 shrink-0' />
			<span>{label}</span>
		</li>
	);
}

export default function ResetPasswordRoute() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
	const { handleSubmit, control, watch } = useForm<FormResetPasswordData>({
		resolver: zodResolver(FormResetPasswordDataSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});
	const password = watch('password');
	const confirmPassword = watch('confirmPassword');
	const passwordRequirements: PasswordRequirement[] = [
		{ label: 'Mínimo de 8 caracteres', isValid: password.length >= 8 },
		{ label: 'Uma letra maiúscula', isValid: /[A-Z]/.test(password) },
		{ label: 'Uma letra minúscula', isValid: /[a-z]/.test(password) },
		{ label: 'Um número', isValid: /[0-9]/.test(password) },
		{ label: 'Um símbolo', isValid: /[^A-Za-z0-9]/.test(password) },
		{
			label: 'Senhas iguais',
			isValid: confirmPassword.length > 0 && password === confirmPassword,
		},
	];

	const resetPasswordMutation = useMutation({
		mutationFn: resetPassword,
	});

	function onSubmit(data: FormResetPasswordData) {
		if (!token) return;
		resetPasswordMutation.mutate({ ...data, token });
	}

	return (
		<div className='h-lvh flex items-center justify-center bg-background text-foreground lg:p-4 select-none'>
			<div className='p-4 h-full flex flex-col rounded-2xl lg:w-1/2'>
				<div className='flex flex-col justify-center items-center'>
					<div className='lg:max-w-96'>
						<div className='self-start mb-7'>
							<img
								src='/icone-marca.svg'
								alt=''
								width={50}
							/>
						</div>
						<div className='mb-12'>
							<h1 className='text-4xl font-semibold'>Nova senha</h1>
							<p className='sm:text-xl'>Crie uma nova senha para voltar a acessar sua conta.</p>
						</div>
						{!token ? (
							<p className='text-destructive text-sm'>Link de recuperação inválido ou incompleto.</p>
						) : (
							<form
								onSubmit={handleSubmit(onSubmit)}
								className='space-y-4'
							>
								<HookFormInput
									control={control}
									id='password'
									name='password'
									placeholder='Digite sua nova senha'
									type='password'
									label='Nova senha'
								/>
								<HookFormInput
									control={control}
									id='confirmPassword'
									name='confirmPassword'
									placeholder='Confirme sua nova senha'
									type='password'
									label='Confirmar senha'
								/>
								<div className='rounded-lg border bg-muted/30 p-3 text-sm'>
									<p className='mb-2 font-medium text-foreground'>Verificação da senha</p>
									<ul className='grid gap-1.5'>
										{passwordRequirements.map((requirement) => (
											<PasswordRequirementItem
												key={requirement.label}
												{...requirement}
											/>
										))}
									</ul>
								</div>
								{resetPasswordMutation.isSuccess && (
									<p className='text-sm text-[#1f7a6b]'>Senha redefinida com sucesso.</p>
								)}
								{resetPasswordMutation.isError && (
									<p className='text-destructive text-sm'>
										{(resetPasswordMutation.error as AxiosError<{ message: string }>)?.response?.data?.message ??
											'Erro ao redefinir senha. Tente novamente.'}
									</p>
								)}
								<Button
									type='submit'
									disabled={resetPasswordMutation.isPending || resetPasswordMutation.isSuccess}
									className='w-full cursor-pointer mt-2 mb-4 bg-[#1f7a6b] hover:bg-[#2fae8f] h-10 text-white'
								>
									{resetPasswordMutation.isPending ? <Spinner /> : 'Redefinir senha'}
								</Button>
							</form>
						)}
						<Link
							to={paths.auth.login.getHref()}
							className='inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
						>
							<ArrowLeft size={16} />
							Voltar para o login
						</Link>
					</div>
				</div>
			</div>
			<div
				className='hidden min-h-full w-1/2 lg:flex flex-col justify-between p-9 bg-cover bg-center box-border rounded-2xl'
				style={{ backgroundImage: "url('/mesh-276.png')" }}
			>
				<h1 className='text-4xl font-bold text-white self-end'>Siscodep</h1>
				<div className='text-end'>
					<p className='text-white text-xl'>Proteja seu acesso.</p>
					<h2 className='text-2xl font-bold text-white'>
						Defina uma senha segura e continue acompanhando suas finanças com praticidade.
					</h2>
				</div>
			</div>
		</div>
	);
}
