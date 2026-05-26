<script lang="ts">
	import { LockKeyhole } from 'lucide-svelte';

	let { data, form } = $props();
</script>

<section class="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
	<div class="flex size-12 items-center justify-center rounded-lg bg-slate-950 text-white">
		<LockKeyhole size={22} />
	</div>
	<h1 class="mt-4 text-2xl font-semibold text-slate-950">访问 FitRecord</h1>
	<p class="mt-2 text-sm leading-6 text-slate-600">输入服务器配置的访问密码。</p>

	{#if form?.message}
		<div class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
			{form.message}
		</div>
	{/if}

	<form method="POST" class="mt-5 space-y-4">
		<input type="hidden" name="redirectTo" value={data.redirectTo} />
		<label class="block">
			<span class="mb-1 block text-xs font-medium text-slate-500">密码</span>
			<input
				name="password"
				type="password"
				class="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-950"
			/>
		</label>
		<button class="h-11 w-full rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
			进入
		</button>
	</form>
</section>
