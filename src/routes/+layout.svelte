<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Activity, BarChart3, CalendarDays, Dumbbell, Library, Settings } from 'lucide-svelte';

	let { children, data } = $props();

	const navItems = [
		{ href: '/', label: '记录', icon: CalendarDays },
		{ href: '/exercises', label: '动作库', icon: Library },
		{ href: '/stats', label: '统计', icon: BarChart3 },
		{ href: '/settings', label: '设置', icon: Settings }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-stone-50 text-slate-950">
	<header class="border-b border-slate-200 bg-white/90 backdrop-blur">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
			<a href="/" class="flex items-center gap-3 font-semibold">
				<span class="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-white">
					<Dumbbell size={21} />
				</span>
				<span>
					<span class="block text-base leading-5">FitRecord</span>
					<span class="block text-xs font-medium text-slate-500">personal training log</span>
				</span>
			</a>

			{#if data?.authEnabled}
				<div class="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 sm:flex">
					<Activity size={14} />
					Protected
				</div>
			{/if}
		</div>
	</header>

	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[180px_1fr]">
		<nav class="grid min-w-0 grid-cols-4 gap-2 lg:sticky lg:top-5 lg:block lg:self-start">
			{#each navItems as item}
				{@const Icon = item.icon}
				<a
					href={item.href}
					class="flex h-12 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950 sm:gap-2 sm:text-sm lg:mb-2 lg:justify-start lg:px-3"
				>
					<Icon size={17} />
					<span class="truncate">{item.label}</span>
				</a>
			{/each}
		</nav>

		<main class="min-w-0">
			{@render children()}
		</main>
	</div>
</div>
