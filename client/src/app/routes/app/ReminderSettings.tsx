import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BellRing, CheckCircle2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import getReminderConfig from '@/features/notifications/services/getReminderConfig';
import updateReminderConfig from '@/features/notifications/services/updateReminderConfig';
import type { ReminderFrequency } from '@/features/notifications/types/notification.type';

const frequencyLabels: Record<ReminderFrequency, string> = {
	DAILY: 'Diariamente',
	WEEKLY: 'Semanalmente',
	MONTHLY: 'Mensalmente',
};

function formatNextRun(value: string | null | undefined) {
	if (!value) return 'Sem próximo envio';

	const nextRunDate = new Date(value);
	const time = nextRunDate.toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
	});

	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	if (nextRunDate.toDateString() === today.toDateString()) {
		return `Hoje às ${time}`;
	}

	if (nextRunDate.toDateString() === tomorrow.toDateString()) {
		return `Amanhã às ${time}`;
	}

	const date = nextRunDate.toLocaleDateString('pt-BR');

	return `${date} às ${time}`;
}

export default function ReminderSettingsRoute() {
	const queryClient = useQueryClient();
	const [active, setActive] = useState(false);
	const [frequency, setFrequency] = useState<ReminderFrequency>('DAILY');
	const [time, setTime] = useState('08:00');
	const [showSavedPopup, setShowSavedPopup] = useState(false);
	const [savedPopupDescription, setSavedPopupDescription] = useState('');
	const reminderConfigQuery = useQuery({
		queryKey: ['notifications', 'reminder-config'],
		queryFn: getReminderConfig,
	});
	const updateConfigMutation = useMutation({
		mutationFn: updateReminderConfig,
		onSuccess: (_data, variables) => {
			void queryClient.invalidateQueries({
				queryKey: ['notifications', 'reminder-config'],
			});
			setSavedPopupDescription(
				variables.active
					? 'Você receberá um email no horário definido.'
					: 'Você não receberá mais lembretes.',
			);
			setShowSavedPopup(true);
		},
	});

	useEffect(() => {
		const config = reminderConfigQuery.data?.data;

		if (!config) return;

		setActive(config.active);
		setFrequency(config.frequency);
		setTime(config.time);
	}, [reminderConfigQuery.data?.data]);

	useEffect(() => {
		if (!showSavedPopup) return;

		const timeoutId = window.setTimeout(() => {
			setShowSavedPopup(false);
		}, 4000);

		return () => window.clearTimeout(timeoutId);
	}, [showSavedPopup]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		updateConfigMutation.mutate({ active, frequency, time });
	};

	return (
		<div className='p-4 sm:p-6 flex flex-col flex-1 min-w-0 space-y-4'>
			{showSavedPopup ? (
				<div
					role='status'
					aria-live='polite'
					className='fixed top-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-lg border border-[#2fae8f]/30 bg-background p-4 text-sm shadow-lg ring-1 ring-foreground/5 sm:top-6 sm:right-6'
				>
					<div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#1f7a6b] text-white'>
						<CheckCircle2 className='size-4' />
					</div>
					<div className='min-w-0'>
						<p className='font-semibold text-foreground'>Lembrete salvo</p>
						<p className='mt-1 text-secondary-foreground'>{savedPopupDescription}</p>
					</div>
				</div>
			) : null}

			<div>
				<h1 className='text-foreground font-bold text-xl'>Lembretes</h1>
				<p className='text-sm text-secondary-foreground'>Configure quando o Siscodep deve lembrar você.</p>
			</div>

			<Card className='max-w-2xl rounded-lg'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<BellRing className='size-5 text-[#1f7a6b]' />
						<span>Configuração de lembrete</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{reminderConfigQuery.isLoading ? (
						<div className='flex items-center gap-2 py-6'>
							<Spinner />
							<p>Carregando configuração</p>
						</div>
					) : (
						<form
							className='space-y-5'
							onSubmit={handleSubmit}
						>
							<div className='flex items-center justify-between gap-4 rounded-lg border p-3'>
								<div>
									<Label htmlFor='reminder-active'>Lembrete ativo</Label>
									<p className='mt-1 text-sm text-secondary-foreground'>
										Quando ativo, o sistema gera uma notificação e envia um e-mail no horário
										definido.
									</p>
								</div>
								<Switch
									id='reminder-active'
									checked={active}
									onCheckedChange={setActive}
								/>
							</div>

							<div className='grid gap-4 sm:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='reminder-frequency'>Frequência</Label>
									<Select
										value={frequency}
										onValueChange={(value) => setFrequency(value as ReminderFrequency)}
									>
										<SelectTrigger
											id='reminder-frequency'
											className='h-10 w-full'
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{Object.entries(frequencyLabels).map(([value, label]) => (
													<SelectItem
														key={value}
														value={value}
													>
														{label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='reminder-time'>Horário</Label>
									<Input
										id='reminder-time'
										type='time'
										className='h-10'
										value={time}
										onChange={(event) => setTime(event.target.value)}
									/>
								</div>
							</div>

							<div className='rounded-lg bg-muted/40 p-3 text-sm text-secondary-foreground'>
								Proximo envio: {formatNextRun(reminderConfigQuery.data?.data.nextRunAt)}
							</div>

							<div className='flex justify-end'>
								<Button
									type='submit'
									className='h-10 cursor-pointer bg-[#1f7a6b] px-4 text-white hover:bg-[#2fae8f]'
									disabled={updateConfigMutation.isPending}
								>
									<Save className='size-4' />
									<span>{updateConfigMutation.isPending ? 'Salvando' : 'Salvar lembrete'}</span>
								</Button>
							</div>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
