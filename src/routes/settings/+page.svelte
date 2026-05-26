<script lang="ts">
	import { Download, LockKeyhole, Settings } from 'lucide-svelte';

	let { data } = $props();
</script>

<section class="space-y-5">
	<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
		<div class="flex items-start justify-between gap-4">
			<div>
				<p class="text-sm font-medium text-slate-500">System</p>
				<h1 class="mt-1 text-3xl font-semibold tracking-normal text-slate-950">设置</h1>
				<p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					管理访问保护和数据导出。数据库默认保存在项目的 data 目录。
				</p>
			</div>
			<Settings class="text-slate-400" size={24} />
		</div>
	</div>

	<div class="grid gap-5 lg:grid-cols-2">
		<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
			<div class="flex items-center gap-2">
				<LockKeyhole size={18} class="text-slate-500" />
				<h2 class="text-lg font-semibold text-slate-950">访问保护</h2>
			</div>
			<p class="mt-3 text-sm leading-6 text-slate-600">
				当前状态：{data.authEnabled ? '已启用' : '未启用'}。部署时设置
				<code class="rounded bg-slate-100 px-1 py-0.5 text-xs">FITRECORD_PASSWORD</code>
				即可打开密码门禁。
			</p>

			{#if data.authEnabled}
				<form method="POST" action="?/logout" class="mt-4">
					<button class="h-10 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
						退出登录
					</button>
				</form>
			{/if}
		</div>

		<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
			<div class="flex items-center gap-2">
				<Download size={18} class="text-slate-500" />
				<h2 class="text-lg font-semibold text-slate-950">数据备份</h2>
			</div>
			<p class="mt-3 text-sm leading-6 text-slate-600">
				SQLite 文件路径：<code class="rounded bg-slate-100 px-1 py-0.5 text-xs">{data.dbPath}</code>
			</p>
			<a
				href="/settings/export.json"
				class="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white hover:bg-slate-800"
			>
				<Download size={16} />
				导出 JSON
			</a>
		</div>
	</div>
</section>

