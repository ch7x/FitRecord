<script lang="ts">
	import { Activity, Bike, Circle, Dumbbell, Goal, HeartPulse, PersonStanding } from 'lucide-svelte';

	type Tone = 'slate' | 'blue' | 'emerald' | 'amber';

	let {
		name = 'default',
		label = '',
		tone = 'slate'
	}: {
		name?: string;
		label?: string;
		tone?: Tone;
	} = $props();

	const icons = {
		barbell: Dumbbell,
		dumbbell: Dumbbell,
		machine: Goal,
		cable: Activity,
		bodyweight: PersonStanding,
		cardio: Bike,
		chest: HeartPulse,
		back: Activity,
		legs: PersonStanding,
		shoulders: Dumbbell,
		arms: Dumbbell,
		core: Circle,
		default: Circle
	};

	const toneClasses = {
		slate: 'bg-slate-100 text-slate-700',
		blue: 'bg-blue-50 text-blue-700',
		emerald: 'bg-emerald-50 text-emerald-700',
		amber: 'bg-amber-50 text-amber-700'
	};

	let Icon = $derived(icons[name as keyof typeof icons] ?? icons.default);
</script>

<span class={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}>
	<Icon size={14} />
	{#if label}
		<span>{label}</span>
	{/if}
</span>
