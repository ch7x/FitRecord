<script lang="ts">
	import { ChevronLeft, ChevronRight, Plus } from 'lucide-svelte';

	let { data } = $props();

	const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
</script>

<section class="space-y-5">
	<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
			<div>
				<p class="text-sm font-medium text-slate-500">训练日历</p>
				<h1 class="mt-1 text-3xl font-semibold tracking-normal text-slate-950">
					{data.calendar.label}
				</h1>
				<p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					按月查看每天练了什么。点击任意日期进入详情，添加动作和组数。
				</p>
			</div>

			<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div class="inline-flex h-11 items-center rounded-lg border border-slate-300 bg-white shadow-sm">
					<a
						href={`/?month=${data.calendar.previousMonth}`}
						class="inline-flex size-10 items-center justify-center text-slate-600 hover:text-slate-950"
						aria-label="上个月"
					>
						<ChevronLeft size={18} />
					</a>
					<div class="min-w-28 px-3 text-center text-sm font-semibold text-slate-950">
						{data.calendar.label}
					</div>
					<a
						href={`/?month=${data.calendar.nextMonth}`}
						class="inline-flex size-10 items-center justify-center text-slate-600 hover:text-slate-950"
						aria-label="下个月"
					>
						<ChevronRight size={18} />
					</a>
				</div>

				<a
					href={`/day/${data.today}`}
					class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
				>
					<Plus size={17} />
					记录今天
				</a>
			</div>
		</div>

		<div class="mt-5 grid gap-3 sm:grid-cols-3">
			<div class="rounded-lg bg-slate-50 p-3">
				<div class="text-xs font-medium text-slate-500">本月训练</div>
				<div class="mt-1 text-xl font-semibold text-slate-950">{data.calendar.summary.trainingDays} 天</div>
			</div>
			<div class="rounded-lg bg-slate-50 p-3">
				<div class="text-xs font-medium text-slate-500">本月组数</div>
				<div class="mt-1 text-xl font-semibold text-slate-950">{data.calendar.summary.setCount} 组</div>
			</div>
			<div class="rounded-lg bg-slate-50 p-3">
				<div class="text-xs font-medium text-slate-500">本月训练量</div>
				<div class="mt-1 text-xl font-semibold text-slate-950">{Math.round(data.calendar.summary.volume)} kg</div>
			</div>
		</div>

	</div>

	<div class="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
		<div class="grid grid-cols-7 border-b border-slate-200 pb-2 text-center text-sm font-semibold text-slate-500">
			{#each weekdays as weekday}
				<div>{weekday}</div>
			{/each}
		</div>

		<div class="mt-2 grid gap-1 sm:gap-2">
			{#each data.calendar.weeks as week}
				<div class="grid grid-cols-7 gap-1 sm:gap-2">
					{#each week as day}
						<a
							href={`/day/${day.date}`}
							class={`group min-h-28 rounded-lg border p-2 transition sm:min-h-36 ${
								day.isCurrentMonth
									? 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
									: 'border-slate-100 bg-slate-50/70 text-slate-300'
							} ${day.isToday ? 'ring-2 ring-slate-950 ring-offset-2' : ''}`}
						>
							<div class="flex items-center justify-between">
								<span
									class={`text-lg font-semibold ${
										day.isCurrentMonth ? 'text-slate-950' : 'text-slate-300'
									}`}
								>
									{day.isToday ? '今' : day.day}
								</span>
								{#if day.exerciseCount > 0}
									<span class="hidden rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 sm:inline">
										{day.exerciseCount} 动作
									</span>
								{/if}
							</div>

							{#if day.exerciseCount > 0}
								<div class="mt-3 space-y-1.5">
									<div class="truncate rounded bg-sky-100 px-1.5 py-1 text-center text-[11px] font-semibold text-sky-900 sm:text-xs">
										{day.exerciseCount} 动作 · {day.setCount} 组
									</div>
									<div class="truncate rounded bg-lime-100 px-1.5 py-1 text-center text-[11px] font-semibold text-lime-900 sm:text-xs">
										{Math.round(day.volume)}kg
									</div>
									<div class="line-clamp-2 rounded bg-yellow-100 px-1.5 py-1 text-center text-[11px] font-semibold leading-4 text-yellow-950 sm:text-xs">
										{day.bodyPartLabels.join('、') || '未分类'}
									</div>
								</div>
							{:else}
								<div class="mt-8 hidden text-center text-xs text-slate-300 group-hover:text-slate-400 sm:block">
									添加记录
								</div>
							{/if}
						</a>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</section>
