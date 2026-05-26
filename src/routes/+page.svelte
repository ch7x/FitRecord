<script lang="ts">
	import { ArrowRight, CalendarDays, Dumbbell, Plus } from 'lucide-svelte';

	let { data } = $props();
</script>

<section class="space-y-5">
	<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p class="text-sm font-medium text-slate-500">今天训练</p>
				<h1 class="mt-1 text-3xl font-semibold tracking-normal text-slate-950">选择日期开始记录</h1>
				<p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					先进入某一天，再添加动作和多组重量次数。结构轻，但后面统计很顺。
				</p>
			</div>

			<a
				href={`/day/${data.today}`}
				class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
			>
				<Plus size={17} />
				记录今天
			</a>
		</div>

		<form method="POST" action="?/openDate" class="mt-5 flex flex-col gap-3 sm:max-w-md sm:flex-row">
			<label class="flex-1">
				<span class="mb-1 block text-xs font-medium text-slate-500">训练日期</span>
				<input
					name="date"
					type="date"
					value={data.today}
					class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-950"
				/>
			</label>
			<button
				class="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 hover:bg-slate-50"
			>
				<CalendarDays size={17} />
				打开
			</button>
		</form>
	</div>

	<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="text-lg font-semibold text-slate-950">最近记录</h2>
				<p class="text-sm text-slate-500">按日期倒序展示最近 12 天。</p>
			</div>
			<Dumbbell class="text-slate-400" size={20} />
		</div>

		{#if data.recentDays.length === 0}
			<div class="rounded-lg border border-dashed border-slate-300 p-8 text-center">
				<p class="font-medium text-slate-700">还没有训练记录</p>
				<p class="mt-1 text-sm text-slate-500">先从今天开始记一条。</p>
			</div>
		{:else}
			<div class="grid gap-3">
				{#each data.recentDays as day}
					<a
						href={`/day/${day.date}`}
						class="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
					>
						<div>
							<div class="font-semibold text-slate-950">{day.date}</div>
							<div class="mt-1 text-sm text-slate-500">
								{day.exerciseCount} 个动作 · {day.setCount} 组 · {Math.round(day.volume)} kg 总量
							</div>
						</div>
						<ArrowRight size={18} class="text-slate-400" />
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

