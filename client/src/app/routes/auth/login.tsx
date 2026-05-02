import { Link } from 'react-router';
import LoginForm from '@/features/auth/components/login-form';

export default function LoginRoute() {
	return (
		<div className='h-lvh flex items-center justify-center bg-[#f7f9f8] lg:p-4 select-none'>
			<div className='p-4 h-full flex flex-col rounded-2xl lg:w-1/2'>
				<div className='flex flex-col justify-center items-center'>
					<div className='lg:max-w-96'>
						<div className='self-start mb-7'>Ícone do app</div>
						<div className='mb-16'>
							<h1 className='text-4xl font-semibold'>Bem vindo de volta</h1>
							<p className='sm:text-xl'>
								Acesse sua conta para continuar acompanhando suas finanças e seu progresso
							</p>
						</div>
						<LoginForm />
						<div className='w-full flex justify-center gap-1'>
							<p className='text-sm'>Ainda não possui uma conta?</p>
							<Link
								to={'/auth/register'}
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
				<div className='text-white font-bold text-2xl text-end'>Ícone do app</div>
				<div className='text-end'>
					<p className='text-white text-xl'>Lorem ipsum</p>
					<h2 className='text-2xl font-bold text-white'>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta in sequi labore tenetur non.
						Modi, labore voluptatibus ad quisquam consequuntur ab earum illo magni perferendis neque autem
						enim, amet aspernatur!
					</h2>
				</div>
			</div>
		</div>
	);
}
