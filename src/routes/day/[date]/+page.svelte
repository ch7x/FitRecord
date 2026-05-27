<script lang="ts">
	import { ClipboardList, Copy, Pencil, Plus, Search, Trash2 } from 'lucide-svelte';
	import IconBadge from '$lib/components/IconBadge.svelte';
	import type { ExerciseCatalogItem } from '$lib/exercise-catalog';
	import type { BodyPart, Equipment } from '$lib/server/constants';

	let { data, form } = $props();
	let nextSetRowId = 4;
	let setRows = $state([
		{ id: 1, weight: '', reps: '' },
		{ id: 2, weight: '', reps: '' },
		{ id: 3, weight: '', reps: '' }
	]);
	let selectedBodyPart = $state<BodyPart>('chest');
	let selectedEquipment = $state('all');
	let selectedExerciseName = $state('');
	let manualMode = $state(false);

	type ExerciseOption = ExerciseCatalogItem & { source: 'saved' | 'catalog' };

	let savedExerciseItems = $derived<ExerciseOption[]>(
		data.exerciseLibrary.map((exercise) => ({
			name: exercise.name,
			bodyPart: exercise.bodyPart as BodyPart,
			equipment: exercise.equipment as Equipment,
			source: 'saved'
		}))
	);

	let catalogItems = $derived<ExerciseOption[]>(
		data.catalog.map((exercise) => ({ ...exercise, source: 'catalog' }))
	);

	let exerciseOptions = $derived.by(() => {
		const byName = new Map<string, ExerciseOption>();

		for (const exercise of [...savedExerciseItems, ...catalogItems]) {
			if (!byName.has(exercise.name)) byName.set(exercise.name, exercise);
		}

		return [...byName.values()];
	});

	let filteredExercises = $derived(
		exerciseOptions.filter(
			(exercise) =>
				exercise.bodyPart === selectedBodyPart &&
				(selectedEquipment === 'all' || exercise.equipment === selectedEquipment)
		)
	);

	let selectedExercise = $derived(
		exerciseOptions.find((exercise) => exercise.name === selectedExerciseName)
	);

	let selectedNameValue = $derived(manualMode ? '' : (selectedExercise?.name ?? ''));
	let selectedBodyPartValue = $derived(selectedExercise?.bodyPart ?? selectedBodyPart);
	let selectedEquipmentValue = $derived(
		selectedExercise?.equipment ?? (selectedEquipment === 'all' ? 'barbell' : selectedEquipment)
	);

	const addSetRow = () => {
		setRows = [...setRows, { id: nextSetRowId++, weight: '', reps: '' }];
	};

	const copySetRow = (index: number) => {
		const source = setRows[index];
		setRows = [
			...setRows.slice(0, index + 1),
			{ id: nextSetRowId++, weight: source.weight, reps: source.reps },
			...setRows.slice(index + 1)
		];
	};

	const deleteSetRow = (id: number) => {
		if (setRows.length === 1) return;
		setRows = setRows.filter((row) => row.id !== id);
	};

	const chooseExercise = (exercise: ExerciseOption) => {
		selectedExerciseName = exercise.name;
		selectedBodyPart = exercise.bodyPart;
		manualMode = false;
	};

	const enableManualMode = () => {
		manualMode = true;
		selectedExerciseName = '';
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
									</tr>
								</thead>
								<tbody class="divide-y divide-slate-100">
									{#each exercise.sets as set}
										<tr>
											<td class="px-3 py-2 font-medium text-slate-600">{set.setIndex}</td>
											<td class="px-3 py-2 text-slate-950">{set.weight} kg</td>
											<td class="px-3 py-2 text-slate-950">{set.reps}</td>
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
				<input type="hidden" name="bodyPart" value={selectedBodyPartValue} />
				<input type="hidden" name="equipment" value={selectedEquipmentValue} />

				<div class="space-y-3">
					<div class="flex items-center gap-2 text-xs font-medium text-slate-500">
						<Search size={14} />
						<span>选择常用动作</span>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<label class="block">
							<span class="mb-1 block text-xs font-medium text-slate-500">训练部位</span>
							<select
								bind:value={selectedBodyPart}
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
								bind:value={selectedEquipment}
								class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-950"
							>
								<option value="all">全部器械</option>
								{#each data.options.equipment as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</label>
					</div>

					<div class="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
						{#if filteredExercises.length === 0}
							<div class="rounded-lg bg-white p-3 text-sm text-slate-500">这个分类下暂时没有内置动作。</div>
						{:else}
							{#each filteredExercises as exercise}
								<button
									type="button"
									onclick={() => chooseExercise(exercise)}
									class={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition ${
										selectedExerciseName === exercise.name
											? 'border-slate-950 bg-white text-slate-950 shadow-sm'
											: 'border-transparent bg-white text-slate-700 hover:border-slate-200'
									}`}
								>
									<span class="font-medium">{exercise.name}</span>
									<span class="text-xs text-slate-400">{exercise.source === 'saved' ? '已用过' : '常用'}</span>
								</button>
							{/each}
						{/if}
					</div>

					<button
						type="button"
						onclick={enableManualMode}
						class="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
					>
						<Pencil size={14} />
						手动输入新动作
					</button>
				</div>

				{#if manualMode}
					<label class="block">
						<span class="mb-1 block text-xs font-medium text-slate-500">新动作名</span>
						<input
							name="name"
							placeholder="例如：器械夹胸"
							class="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-950"
							required
						/>
					</label>
				{:else}
					<input type="hidden" name="name" value={selectedNameValue} />
					<div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
						<div class="text-xs font-medium text-slate-500">已选动作</div>
						<div class="mt-1 text-sm font-semibold text-slate-950">
							{selectedExercise?.name ?? '请先选择一个动作'}
						</div>
					</div>
				{/if}

				<input type="hidden" name="note" value="" />

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

					{#each setRows as row, index (row.id)}
						<div class="grid min-w-0 grid-cols-[2.25rem_1fr_1fr_auto] gap-2">
							<div class="flex h-10 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
								{index + 1}
							</div>
							<label class="min-w-0">
								<span class="sr-only">重量 kg</span>
								<input
									name="weight"
									type="number"
									min="0"
									step="0.5"
									placeholder="重量 kg"
									bind:value={row.weight}
									class="h-10 min-w-0 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-950"
								/>
							</label>
							<label class="min-w-0">
								<span class="sr-only">次数</span>
								<input
									name="reps"
									type="number"
									min="1"
									step="1"
									placeholder="次数"
									bind:value={row.reps}
									class="h-10 min-w-0 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-950"
								/>
							</label>
							<input type="hidden" name="setNote" value="" />
							<div class="flex gap-1">
								<button
									type="button"
									onclick={() => copySetRow(index)}
									class="inline-flex size-10 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
									aria-label="复制这一组"
								>
									<Copy size={15} />
								</button>
								<button
									type="button"
									onclick={() => deleteSetRow(row.id)}
									class="inline-flex size-10 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
									aria-label="删除这一组"
									disabled={setRows.length === 1}
								>
									<Trash2 size={15} />
								</button>
							</div>
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
