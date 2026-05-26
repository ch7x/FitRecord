export const bodyPartOptions = [
	{ value: 'chest', label: '胸', icon: 'chest' },
	{ value: 'back', label: '背', icon: 'back' },
	{ value: 'legs', label: '腿', icon: 'legs' },
	{ value: 'shoulders', label: '肩', icon: 'shoulders' },
	{ value: 'arms', label: '手臂', icon: 'arms' },
	{ value: 'core', label: '核心', icon: 'core' },
	{ value: 'cardio', label: '有氧', icon: 'cardio' }
] as const;

export const equipmentOptions = [
	{ value: 'barbell', label: '杠铃', icon: 'barbell' },
	{ value: 'dumbbell', label: '哑铃', icon: 'dumbbell' },
	{ value: 'machine', label: '固定器械', icon: 'machine' },
	{ value: 'cable', label: '绳索', icon: 'cable' },
	{ value: 'bodyweight', label: '自重', icon: 'bodyweight' },
	{ value: 'cardio', label: '有氧器械', icon: 'cardio' }
] as const;

export type BodyPart = (typeof bodyPartOptions)[number]['value'];
export type Equipment = (typeof equipmentOptions)[number]['value'];

export const bodyPartLabels = Object.fromEntries(bodyPartOptions.map((item) => [item.value, item.label]));
export const equipmentLabels = Object.fromEntries(
	equipmentOptions.map((item) => [item.value, item.label])
);

export const validBodyParts = new Set<string>(bodyPartOptions.map((item) => item.value));
export const validEquipment = new Set<string>(equipmentOptions.map((item) => item.value));
