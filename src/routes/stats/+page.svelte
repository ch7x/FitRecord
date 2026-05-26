<script lang="ts">
	import { BarChart3, Trophy } from 'lucide-svelte';
	import IconBadge from '$lib/components/IconBadge.svelte';

	let { data } = $props();
</script>

<section class="space-y-5">
	<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
		<div class="flex items-start justify-between gap-4">
			<div>
				<p class="text-sm font-medium text-slate-500">Progress</p>
				<h1 class="mt-1 text-3xl font-semibold tracking-normal text-slate-950">统计</h1>
				<p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					先做轻量统计：训练天数、动作数量、总组数和训练部位分布。
				</p>
			</div>
			<BarChart3 class="text-slate-400" size={24} />
		</div>
	</div>

	<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
		<div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
			<div class="text-xs font-medium text-slate-500">训练天数</div>
			<div class="mt-2 text-2xl font-semibold text-slate-950">{data.totals.trainingDays}</div>
		</div>
		<div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
			<div class="text-xs font-medium text-slate-500">记录动作</div>
			<div class="mt-2 text-2xl font-semibold text-slate-950">{data.totals.exercisesLogged}</div>
		</div>
		<div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
			<div class="text-xs font-medium text-slate-500">总组数</div>
			<div class="mt-2 text-2xl font-semibold text-slate-950">{data.totals.setsLogged}</div>
		</div>
		<div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
			<div class="text-xs font-medium text-slate-500">总训练量</div>
			<div class="mt-2 text-2xl font-semibold text-slate-950">{Math.round(data.totals.totalVolume)} kg</div>
		</div>
	</div>

	<div class="grid gap-5 lg:grid-cols-2">
		<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
			<h2 class="text-lg font-semibold text-slate-950">部位分布</h2>
			<div class="mt-4 space-y-3">
				{#if data.bodyParts.length === 0}
					<p class="text-sm text-slate-500">暂无数据。</p>
				{:else}
					{#each data.bodyParts as item}
						<div>
							<div class="mb-1 flex items-center justify-between text-sm">
								<span class="font-medium text-slate-700">{item.label}</span>
								<span class="text-slate-500">{item.count}</span>
							</div>
							<div class="h-2 rounded-full bg-slate-100">
								<div
									class="h-2 rounded-full bg-slate-950"
									style={`width: ${Math.min(100, item.count * 16)}%`}
								></div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-slate-950">动作最佳</h2>
				<Trophy class="text-amber-500" size={20} />
			</div>

			{#if data.bestExercises.length === 0}
				<p class="text-sm text-slate-500">暂无数据。</p>
			{:else}
				<div class="space-y-3">
					{#each data.bestExercises as exercise}
						<div class="rounded-lg border border-slate-200 p-3">
							<div class="flex items-center justify-between gap-3">
								<div>
									<div class="font-semibold text-slate-950">{exercise.name}</div>
									<div class="mt-2 flex flex-wrap gap-2">
										<IconBadge name={exercise.equipment} label={exercise.equipmentLabel} />
										<IconBadge name={exercise.bodyPart} label={exercise.bodyPartLabel} tone="blue" />
									</div>
								</div>
								<div class="text-right text-sm">
									<div class="font-semibold text-slate-950">{exercise.bestWeight ?? 0} kg</div>
									<div class="text-xs text-slate-500">最高重量</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>

