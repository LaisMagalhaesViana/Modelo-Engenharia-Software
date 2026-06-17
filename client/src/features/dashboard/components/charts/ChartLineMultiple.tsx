import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardErrorState from '@/features/dashboard/components/states/DashboardErrorState';
import DashboardLoadingState from '@/features/dashboard/components/states/DashboardLoadingState';
import type { Launch } from '@/features/launches/types/launches.type';

type ChartLineMultipleProps = {
	launches: Launch[];
	isLoading: boolean;
	isError: boolean;
	onRetry?: () => void;
};

type ChartPeriod = 'weekly' | 'monthly' | 'yearly';

type PeriodChartData = {
	periodKey: string;
	periodLabel: string;
	income: number;
	expenses: number;
};

const chartConfig = {
	income: {
		label: 'Receitas',
		color: '#00a83f',
	},
	expenses: {
		label: 'Despesas',
		color: '#f00019',
	},
} satisfies ChartConfig;

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
});

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
	month: 'short',
	year: '2-digit',
	timeZone: 'UTC',
});

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
	day: '2-digit',
	month: '2-digit',
	timeZone: 'UTC',
});

const periodDescriptions: Record<ChartPeriod, string> = {
	weekly: 'Variação semanal dos lançamentos',
	monthly: 'Variação mensal dos lançamentos',
	yearly: 'Variação anual dos lançamentos',
};

function parseLaunchDate(date: string) {
	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) return null;

	return parsedDate;
}

function formatDateKey(date: Date) {
	return [
		date.getUTCFullYear(),
		String(date.getUTCMonth() + 1).padStart(2, '0'),
		String(date.getUTCDate()).padStart(2, '0'),
	].join('-');
}

function getWeekStartDate(date: Date) {
	const weekStartDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	const day = weekStartDate.getUTCDay();
	const daysFromMonday = day === 0 ? 6 : day - 1;

	weekStartDate.setUTCDate(weekStartDate.getUTCDate() - daysFromMonday);

	return weekStartDate;
}

function getPeriodKey(date: Date, period: ChartPeriod) {
	if (period === 'weekly') return formatDateKey(getWeekStartDate(date));
	if (period === 'yearly') return String(date.getUTCFullYear());

	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function getPeriodLabel(periodKey: string, period: ChartPeriod) {
	if (period === 'weekly') {
		const [year, month, day] = periodKey.split('-').map(Number);
		const weekStartDate = new Date(Date.UTC(year, month - 1, day));
		const weekEndDate = new Date(weekStartDate);

		weekEndDate.setUTCDate(weekStartDate.getUTCDate() + 6);

		return `${shortDateFormatter.format(weekStartDate)} - ${shortDateFormatter.format(weekEndDate)}`;
	}

	if (period === 'yearly') return periodKey;

	const [year, month] = periodKey.split('-').map(Number);
	const date = new Date(Date.UTC(year, month - 1, 1));

	return monthFormatter.format(date).replace('.', '');
}

function addPeriod(periodKey: string, period: ChartPeriod) {
	if (period === 'weekly') {
		const [year, month, day] = periodKey.split('-').map(Number);
		const date = new Date(Date.UTC(year, month - 1, day + 7));

		return formatDateKey(date);
	}

	if (period === 'yearly') {
		return String(Number(periodKey) + 1);
	}

	const [year, month] = periodKey.split('-').map(Number);
	const date = new Date(Date.UTC(year, month, 1));

	return getPeriodKey(date, 'monthly');
}

function buildPeriodRange(periodKeys: string[], period: ChartPeriod) {
	if (periodKeys.length === 0) return [];

	const sortedPeriodKeys = [...periodKeys].sort();
	const firstPeriod = sortedPeriodKeys[0];
	const lastPeriod = sortedPeriodKeys[sortedPeriodKeys.length - 1];
	const periods: string[] = [];

	for (let periodKey = firstPeriod; periodKey <= lastPeriod; periodKey = addPeriod(periodKey, period)) {
		periods.push(periodKey);
	}

	return periods;
}

function buildChartDataByPeriod(launches: Launch[], period: ChartPeriod) {
	const periods = new Map<string, PeriodChartData>();

	for (const launch of launches) {
		const value = Number(launch.value);
		const launchDate = parseLaunchDate(launch.date);

		if (!launchDate || Number.isNaN(value)) continue;

		const periodKey = getPeriodKey(launchDate, period);
		const currentPeriod = periods.get(periodKey) ?? {
			periodKey,
			periodLabel: getPeriodLabel(periodKey, period),
			income: 0,
			expenses: 0,
		};

		if (launch.type === 'INCOME') {
			currentPeriod.income += value;
		}

		if (launch.type === 'EXPENSES') {
			currentPeriod.expenses += value;
		}

		periods.set(periodKey, currentPeriod);
	}

	return buildPeriodRange(Array.from(periods.keys()), period).map((periodKey) => {
		return (
			periods.get(periodKey) ?? {
				periodKey,
				periodLabel: getPeriodLabel(periodKey, period),
				income: 0,
				expenses: 0,
			}
		);
	});
}

export function ChartLineMultiple({ launches, isLoading, isError, onRetry }: ChartLineMultipleProps) {
	const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>('monthly');
	const chartData = useMemo(() => buildChartDataByPeriod(launches, selectedPeriod), [launches, selectedPeriod]);

	return (
		<Card className='flex min-w-0 flex-1 flex-col'>
			<CardHeader className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
				<div className='space-y-1'>
					<CardTitle>Receitas e despesas</CardTitle>
					<CardDescription>{periodDescriptions[selectedPeriod]}</CardDescription>
				</div>
				<Select
					value={selectedPeriod}
					onValueChange={(value) => setSelectedPeriod(value as ChartPeriod)}
				>
					<SelectTrigger
						className='w-full sm:w-36'
						aria-label='Filtrar período do gráfico'
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent align='end'>
						<SelectItem value='weekly'>Semanal</SelectItem>
						<SelectItem value='monthly'>Mensal</SelectItem>
						<SelectItem value='yearly'>Anual</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent>
				{isLoading && <DashboardLoadingState className='h-80' />}

				{isError && (
					<DashboardErrorState
						className='h-80'
						onRetry={onRetry}
					/>
				)}

				{!isLoading && !isError && chartData.length === 0 && (
					<div className='flex h-80 items-center justify-center text-sm text-muted-foreground'>
						Nenhum lançamento encontrado.
					</div>
				)}

				{!isLoading && !isError && chartData.length > 0 && (
					<ChartContainer
						config={chartConfig}
						className='h-80 w-full'
					>
						<LineChart
							accessibilityLayer
							data={chartData}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey='periodLabel'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => currencyFormatter.format(Number(value)).replace(',00', '')}
								width={76}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										formatter={(value, name) => (
											<div className='flex min-w-36 items-center justify-between gap-3'>
												<span className='text-muted-foreground'>
													{chartConfig[name as keyof typeof chartConfig]?.label ?? name}
												</span>
												<span className='font-mono font-medium text-foreground tabular-nums'>
													{currencyFormatter.format(Number(value))}
												</span>
											</div>
										)}
									/>
								}
							/>
							<Line
								dataKey='income'
								type='monotone'
								stroke='var(--color-income)'
								strokeWidth={2}
								dot={false}
							/>
							<Line
								dataKey='expenses'
								type='monotone'
								stroke='var(--color-expenses)'
								strokeWidth={2}
								dot={false}
							/>
						</LineChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
