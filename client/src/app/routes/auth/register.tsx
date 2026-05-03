import { Link, useNavigate, useSearchParams } from 'react-router';
import { paths } from '@/config/paths';
import RegisterForm from '@/features/auth/components/register-form';

export default function RegisterRoute() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get('redirectTo');
	return (
		<div className='h-lvh flex items-center justify-center lg:p-4 select-none'>
			<div
				className='hidden  min-h-full w-1/2 lg:flex flex-col justify-between p-9 bg-cover bg-center  box-border rounded-2xl'
				style={{ backgroundImage: "url('/mesh-276.png')" }}
			>
				<h1 className='text-4xl font-bold text-white'>Siscodep</h1>
				<div>
					<p className='text-white text-xl'>Controle suas finanças de forma simples e eficiente.</p>
					<h2 className='text-2xl font-bold text-white'>
						Registre suas receitas, acompanhe detalhadamente suas despesas, entenda para onde seu dinheiro
						está indo e tome decisões mais inteligentes para alcançar seus objetivos financeiros com mais
						segurança.
					</h2>
				</div>
			</div>
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
							<h1 className='text-4xl font-semibold'>Criar nova conta</h1>
							<p className='sm:text-xl'>
								Comece agora a organizar suas finanças e acompanhar seu progresso
							</p>
						</div>
						<RegisterForm
							onSuccess={() => {
								navigate(`${redirectTo ? `${redirectTo}` : paths.auth.login.getHref()}`, {
									replace: true,
								});
							}}
						/>
						<div className='w-full flex justify-center gap-1'>
							<p className='text-sm'>Já possui uma conta?</p>
							<Link
								to={paths.auth.login.getHref(redirectTo)}
								className='text-sm font-bold text-[#1f7a6b]'
							>
								Login
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
