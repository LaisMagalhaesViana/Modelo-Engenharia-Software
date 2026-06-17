import { useQuery } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react';
import { useMemo, useState } from 'react';
import NewLaunchButton from '@/components/NewLaunchButton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryChartPie } from '@/features/dashboard/components/charts/CategoryChartPie';
import { ChartLineMultiple } from '@/features/dashboard/components/charts/ChartLineMultiple';
import InfosArticle from '@/features/dashboard/components/InfosArticle';
import RecentLaunchesCard from '@/features/dashboard/components/RecentLaunchesCard';
import listAllLaunches from '@/features/launches/services/listAllLaunches';
import type { Launch } from '@/features/launches/types/launches.type';

type PeriodFilter = {
	month: string;
	year: string;
};

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
	month: 'long',
	timeZone: 'UTC',
});

function getLaunches(data: unknown): Launch[] {
	if (Array.isArray(data)) return data;

	if (data && typeof data === 'object') {
		const responseData = data as {
			data?: unknown;
			launches?: unknown;
			transactions?: unknown;
		};

		if (Array.isArray(responseData.data)) return responseData.data;
		if (Array.isArray(responseData.launches)) return responseData.launches;
		if (Array.isArray(responseData.transactions)) return responseData.transactions;
	}

	return [];
}

function getCurrentPeriod(): PeriodFilter {
	const currentDate = new Date();

	return {
		month: String(currentDate.getMonth() + 1).padStart(2, '0'),
		year: String(currentDate.getFullYear()),
	};
}

function getLaunchPeriod(launch: Launch) {
	return {
		month: launch.date.slice(5, 7),
		year: launch.date.slice(0, 4),
	};
}

function getMonthLabel(month: string) {
	const date = new Date(Date.UTC(2026, Number(month) - 1, 1));

	return monthFormatter.format(date);
}

function getPeriodDescription(filter: PeriodFilter) {
	return `${getMonthLabel(filter.month)} de ${filter.year}`;
}

function buildYearOptions(launches: Launch[], selectedYear: string) {
	const years = new Set<string>([selectedYear]);

	for (const launch of launches) {
		const { year } = getLaunchPeriod(launch);

		if (year) years.add(year);
	}

	return Array.from(years).sort((firstYear, secondYear) => Number(secondYear) - Number(firstYear));
}

function buildMonthOptions(launches: Launch[], selectedYear: string, selectedMonth: string) {
	const months = new Set<string>([selectedMonth]);

	for (const launch of launches) {
		const { month, year } = getLaunchPeriod(launch);

		if (year === selectedYear && month) {
			months.add(month);
		}
	}

	return Array.from(months).sort((firstMonth, secondMonth) => Number(firstMonth) - Number(secondMonth));
}

function filterLaunchesByPeriod(launches: Launch[], filter: PeriodFilter) {
	return launches.filter((launch) => {
		const { month, year } = getLaunchPeriod(launch);

		return month === filter.month && year === filter.year;
	});
}

function getPreviousPeriod(filter: PeriodFilter): PeriodFilter {
	const previousMonth = new Date(Date.UTC(Number(filter.year), Number(filter.month) - 2, 1));

	return {
		month: String(previousMonth.getUTCMonth() + 1).padStart(2, '0'),
		year: String(previousMonth.getUTCFullYear()),
	};
}

function filterLaunchesUntilPeriod(launches: Launch[], filter: PeriodFilter) {
	const lastDayOfSelectedMonth = new Date(Date.UTC(Number(filter.year), Number(filter.month), 0, 23, 59, 59, 999));

	return launches.filter((launch) => {
		const launchDate = new Date(launch.date);

		if (Number.isNaN(launchDate.getTime())) return false;

		return launchDate.getTime() <= lastDayOfSelectedMonth.getTime();
	});
}

export default function DashboardRoute() {
	const currentPeriod = useMemo(() => getCurrentPeriod(), []);
	const [periodFilter, setPeriodFilter] = useState<PeriodFilter>(currentPeriod);
	const launchQuery = useQuery({
		queryKey: ['launches'],
		queryFn: listAllLaunches,
	});

	const launches = getLaunches(launchQuery.data?.data);
	const yearOptions = useMemo(() => buildYearOptions(launches, periodFilter.year), [launches, periodFilter.year]);
	const monthOptions = useMemo(
		() => buildMonthOptions(launches, periodFilter.year, periodFilter.month),
		[launches, periodFilter.month, periodFilter.year],
	);
	const filteredLaunches = useMemo(() => filterLaunchesByPeriod(launches, periodFilter), [launches, periodFilter]);
	const previousPeriod = useMemo(() => getPreviousPeriod(periodFilter), [periodFilter]);
	const previousLaunches = useMemo(
		() => filterLaunchesByPeriod(launches, previousPeriod),
		[launches, previousPeriod],
	);
	const balanceLaunches = useMemo(() => filterLaunchesUntilPeriod(launches, periodFilter), [launches, periodFilter]);
	const handleRetryLaunches = () => {
		void launchQuery.refetch();
	};

	return (
		<div className='flex-1 min-w-0 p-4 sm:p-5 space-y-3'>
			<div className='flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between'>
				<div>
					<h1 className='text-[20px] font-bold leading-6 text-foreground'>Dashboard</h1>
					<p className='mt-1 text-sm text-[#466184] capitalize dark:text-secondary-foreground'>
						Resumo financeiro - {getPeriodDescription(periodFilter)}
					</p>
				</div>

				<div className='grid w-full grid-cols-1 gap-2 min-[520px]:grid-cols-2 xl:w-auto xl:grid-cols-[10rem_10rem_auto_auto]'>
					<Select
						value={periodFilter.month}
						onValueChange={(month) => setPeriodFilter((filter) => ({ ...filter, month }))}
					>
						<SelectTrigger className='w-full data-[size=default]:h-12 py-0'>
							<SelectValue placeholder='Mês' />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{monthOptions.map((month) => (
									<SelectItem
										key={month}
										value={month}
										className='capitalize'
									>
										{getMonthLabel(month)}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>

					<Select
						value={periodFilter.year}
						onValueChange={(year) => setPeriodFilter((filter) => ({ ...filter, year }))}
					>
						<SelectTrigger className='w-full data-[size=default]:h-12 px-6 py-0'>
							<SelectValue placeholder='Ano' />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{yearOptions.map((year) => (
									<SelectItem
										key={year}
										value={year}
									>
										{year}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>

					<Button
						type='button'
						variant='outline'
						className='w-full cursor-pointer h-12 px-6 py-0 flex items-center xl:w-auto'
						onClick={() => setPeriodFilter(currentPeriod)}
					>
						<CalendarDays className='size-4' />
						<span>Mês atual</span>
					</Button>
					<NewLaunchButton className='w-full h-12 py-0 xl:w-auto' />
				</div>
			</div>

			<InfosArticle
				launches={filteredLaunches}
				previousLaunches={previousLaunches}
				balanceLaunches={balanceLaunches}
				isLoading={launchQuery.isLoading}
				isError={launchQuery.isError}
			/>
			<div className='grid gap-3 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]'>
				<CategoryChartPie
					launches={filteredLaunches}
					isLoading={launchQuery.isLoading}
					isError={launchQuery.isError}
					onRetry={handleRetryLaunches}
				/>
				<ChartLineMultiple
					launches={launches}
					isLoading={launchQuery.isLoading}
					isError={launchQuery.isError}
					onRetry={handleRetryLaunches}
				/>
			</div>
			<RecentLaunchesCard
				launches={launches}
				isLoading={launchQuery.isLoading}
				isError={launchQuery.isError}
				onRetry={handleRetryLaunches}
			/>
		</div>
	);
}
