<script lang="ts">
	import { Dumbbell, Search } from 'lucide-svelte';
	import IconBadge from '$lib/components/IconBadge.svelte';

	let { data } = $props();
</script>

<section class="space-y-5">
	<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
		<div class="flex items-start justify-between gap-4">
			<div>
				<p class="text-sm font-medium text-slate-500">Exercise library</p>
				<h1 class="mt-1 text-3xl font-semibold tracking-normal text-slate-950">动作库</h1>
				<p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					这里会自动收集你记录过的动作，后续统计和历史查询都会基于它。
				</p>
			</div>
			<Dumbbell class="text-slate-400" size={24} />
		</div>
	</div>

	<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
		<div class="mb-4 flex items-center gap-2 text-sm text-slate-500">
			<Search size={16} />
			<span>共 {data.exercises.length} 个动作</span>
		</div>

		{#if data.exercises.length === 0}
			<div class="rounded-lg border border-dashed border-slate-300 p-8 text-center">
				<p class="font-medium text-slate-700">动作库还是空的</p>
				<p class="mt-1 text-sm text-slate-500">去某一天添加动作后，这里会自动出现。</p>
			</div>
		{:else}
			<div class="grid gap-3 md:grid-cols-2">
				{#each data.exercises as exercise}
					<article class="rounded-lg border border-slate-200 p-4">
						<div class="flex items-start justify-between gap-3">
							<div>
								<h2 class="font-semibold text-slate-950">{exercise.name}</h2>
								<div class="mt-2 flex flex-wrap gap-2">
									<IconBadge name={exercise.equipment} label={exercise.equipmentLabel} />
									<IconBadge name={exercise.bodyPart} label={exercise.bodyPartLabel} tone="blue" />
								</div>
							</div>
							<div class="text-right text-sm">
								<div class="font-semibold text-slate-950">{exercise.workoutCount}</div>
								<div class="text-xs text-slate-500">次记录</div>
							</div>
						</div>
						<div class="mt-4 grid grid-cols-2 gap-2 text-sm">
							<div class="rounded-lg bg-slate-50 p-3">
								<div class="text-xs text-slate-500">总组数</div>
								<div class="mt-1 font-semibold text-slate-950">{exercise.setCount}</div>
							</div>
							<div class="rounded-lg bg-slate-50 p-3">
								<div class="text-xs text-slate-500">最高重量</div>
								<div class="mt-1 font-semibold text-slate-950">
									{exercise.bestWeight ?? '-'}{exercise.bestWeight ? ' kg' : ''}
								</div>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>

