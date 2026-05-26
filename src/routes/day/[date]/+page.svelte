<script lang="ts">
	import { ClipboardList, Plus, Trash2 } from 'lucide-svelte';
	import IconBadge from '$lib/components/IconBadge.svelte';

	let { data, form } = $props();
	let setRows = $state([0, 1, 2]);

	const addSetRow = () => {
		setRows = [...setRows, setRows.length];
	};
</script>

<section class="space-y-5">
	<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<div>
				<p class="text-sm font-medium text-slate-500">训练日期</p>
				<h1 class="mt-1 text-3xl font-semibold tracking-normal text-slate-950">{data.date}</h1>
				<p class="mt-2 text-sm text-slate-600">
					{data.record.summary.exerciseCount} 个动作 · {data.record.summary.setCount} 组 · {Math.round(data.record.summary.volume)} kg 总量
				</p>
			</div>

			<a
				href="/"
				class="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
			>
				换日期
			</a>
		</div>
	</div>

	{#if form?.message}
		<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
			{form.message}
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
		<div class="min-w-0 space-y-3">
			{#if data.record.exercises.length === 0}
				<div class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
					<ClipboardList class="mx-auto text-slate-400" size={28} />
					<p class="mt-3 font-medium text-slate-700">这一天还没有动作</p>
					<p class="mt-1 text-sm text-slate-500">从右侧添加第一个动作。</p>
				</div>
			{:else}
				{#each data.record.exercises as exercise}
					<article class="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
						<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
							<div class="min-w-0">
								<div class="flex flex-wrap items-center gap-2">
									<h2 class="text-lg font-semibold text-slate-950">{exercise.name}</h2>
									<IconBadge name={exercise.equipment} label={exercise.equipmentLabel} />
									<IconBadge name={exercise.bodyPart} label={exercise.bodyPartLabel} tone="blue" />
								</div>
								{#if exercise.note}
									<p class="mt-2 text-sm text-slate-500">{exercise.note}</p>
								{/if}
							</div>

							<form method="POST" action="?/deleteExercise" class="w-auto">
								<input type="hidden" name="dayExerciseId" value={exercise.id} />
								<button
									class="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
									aria-label="删除动作"
								>
									<Trash2 size={16} />
								</button>
							</form>
						</div>

						<div class="mt-4 overflow-x-auto rounded-lg border border-slate-200">
							<table class="w-full table-fixed text-left text-sm">
								<thead class="bg-slate-50 text-xs uppercase text-slate-500">
									<tr>
										<th class="px-3 py-2">组</th>
										<th class="px-3 py-2">重量</th>
										<th class="px-3 py-2">次数</th>
										<th class="px-3 py-2">备注</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-slate-100">
									{#each exercise.sets as set}
										<tr>
											<td class="px-3 py-2 font-medium text-slate-600">{set.setIndex}</td>
											<td class="px-3 py-2 text-slate-950">{set.weight} kg</td>
											<td class="px-3 py-2 text-slate-950">{set.reps}</td>
											<td class="px-3 py-2 text-slate-500">{set.note || '-'}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</article>
				{/each}
			{/if}
		</div>

		<aside class="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm xl:sticky xl:top-5 xl:self-start">
			<div class="mb-4">
				<h2 class="text-lg font-semibold text-slate-950">添加动作</h2>
				<p class="text-sm text-slate-500">动作会自动进入动作库，下次可复用。</p>
			</div>

			<form method="POST" action="?/addExercise" class="space-y-4">
				<label class="block">
					<span class="mb-1 block text-xs font-medium text-slate-500">动作名</span>
					<input
						name="name"
						list="exercise-list"
						placeholder="例如：卧推"
						class="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-950"
						required
					/>
					<datalist id="exercise-list">
						{#each data.exerciseLibrary as exercise}
							<option value={exercise.name}></option>
						{/each}
					</datalist>
				</label>

				<div class="grid grid-cols-2 gap-3">
					<label class="block">
						<span class="mb-1 block text-xs font-medium text-slate-500">训练部位</span>
						<select
							name="bodyPart"
							class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-950"
						>
							{#each data.options.bodyParts as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</label>

					<label class="block">
						<span class="mb-1 block text-xs font-medium text-slate-500">器械</span>
						<select
							name="equipment"
							class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-950"
						>
							{#each data.options.equipment as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</label>
				</div>

				<label class="block">
					<span class="mb-1 block text-xs font-medium text-slate-500">动作备注</span>
					<input
						name="note"
						placeholder="可选"
						class="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-950"
					/>
				</label>

				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<span class="text-xs font-medium text-slate-500">组数</span>
						<button
							type="button"
							onclick={addSetRow}
							class="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-300 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
						>
							<Plus size={14} />
							加一组
						</button>
					</div>

					{#each setRows as row, index}
						<div class="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1.2fr]">
							<input
								name="weight"
								type="number"
								min="0"
								step="0.5"
								placeholder={`第 ${index + 1} 组 kg`}
								class="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-950"
							/>
							<input
								name="reps"
								type="number"
								min="1"
								step="1"
								placeholder="次数"
								class="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-950"
							/>
							<input
								name="setNote"
								placeholder="备注"
								class="col-span-2 h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-950 sm:col-span-1"
							/>
						</div>
					{/each}
				</div>

				<button class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
					<Plus size={17} />
					保存动作
				</button>
			</form>
		</aside>
	</div>
</section>
