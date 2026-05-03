import { Link, useNavigate, useSearchParams } from 'react-router';
import { paths } from '@/config/paths';
import LoginForm from '@/features/auth/components/login-form';

export default function LoginRoute() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get('redirectTo');
	return (
		<div className='h-lvh flex items-center justify-center bg-[#f7f9f8] lg:p-4 select-none'>
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
						<div className='mb-16'>
							<h1 className='text-4xl font-semibold'>Bem vindo de volta</h1>
							<p className='sm:text-xl'>
								Acesse sua conta para continuar acompanhando suas finanças e seu progresso
							</p>
						</div>
						<LoginForm
							onSuccess={() => {
								navigate(`${redirectTo ? `${redirectTo}` : paths.app.root.getHref()}`, {
									replace: true,
								});
							}}
						/>
						<div className='w-full flex justify-center gap-1'>
							<p className='text-sm'>Ainda não possui uma conta?</p>
							<Link
								to={paths.auth.register.getHref(redirectTo)}
								className='text-sm font-bold text-[#1f7a6b]'
							>
								Cadastrar-se
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div
				className='hidden  min-h-full w-1/2 lg:flex flex-col justify-between p-9 bg-cover bg-center  box-border rounded-2xl'
				style={{ backgroundImage: "url('/mesh-276.png')" }}
			>
				<h1 className='text-4xl font-bold text-white self-end'>Siscodep</h1>
				<div className='text-end'>
					<p className='text-white text-xl'>Continue de onde parou.</p>
					<h2 className='text-2xl font-bold text-white'>
						Acompanhe seus gastos, visualize seus ganhos e mantenha o controle total da sua vida financeira
						em um só lugar, com praticidade e clareza.
					</h2>
				</div>
			</div>
		</div>
	);
}
