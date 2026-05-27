import type { BodyPart, Equipment } from './server/constants';

export type ExerciseCatalogItem = {
	name: string;
	bodyPart: BodyPart;
	equipment: Equipment;
};

export const exerciseCatalog: ExerciseCatalogItem[] = [
	{ name: '卧推', bodyPart: 'chest', equipment: 'barbell' },
	{ name: '上斜卧推', bodyPart: 'chest', equipment: 'barbell' },
	{ name: '下斜卧推', bodyPart: 'chest', equipment: 'barbell' },
	{ name: '哑铃卧推', bodyPart: 'chest', equipment: 'dumbbell' },
	{ name: '上斜哑铃卧推', bodyPart: 'chest', equipment: 'dumbbell' },
	{ name: '哑铃飞鸟', bodyPart: 'chest', equipment: 'dumbbell' },
	{ name: '蝴蝶机夹胸', bodyPart: 'chest', equipment: 'machine' },
	{ name: '绳索夹胸', bodyPart: 'chest', equipment: 'cable' },
	{ name: '俯卧撑', bodyPart: 'chest', equipment: 'bodyweight' },

	{ name: '高位下拉', bodyPart: 'back', equipment: 'machine' },
	{ name: '坐姿划船', bodyPart: 'back', equipment: 'machine' },
	{ name: '辅助引体向上', bodyPart: 'back', equipment: 'machine' },
	{ name: '引体向上', bodyPart: 'back', equipment: 'bodyweight' },
	{ name: '杠铃划船', bodyPart: 'back', equipment: 'barbell' },
	{ name: '哑铃划船', bodyPart: 'back', equipment: 'dumbbell' },
	{ name: '直臂下压', bodyPart: 'back', equipment: 'cable' },
	{ name: '面拉', bodyPart: 'back', equipment: 'cable' },

	{ name: '深蹲', bodyPart: 'legs', equipment: 'barbell' },
	{ name: '腿举', bodyPart: 'legs', equipment: 'machine' },
	{ name: '腿屈伸', bodyPart: 'legs', equipment: 'machine' },
	{ name: '腿弯举', bodyPart: 'legs', equipment: 'machine' },
	{ name: '罗马尼亚硬拉', bodyPart: 'legs', equipment: 'barbell' },
	{ name: '臀桥', bodyPart: 'legs', equipment: 'barbell' },
	{ name: '保加利亚分腿蹲', bodyPart: 'legs', equipment: 'dumbbell' },
	{ name: '提踵', bodyPart: 'legs', equipment: 'machine' },

	{ name: '杠铃推举', bodyPart: 'shoulders', equipment: 'barbell' },
	{ name: '哑铃推举', bodyPart: 'shoulders', equipment: 'dumbbell' },
	{ name: '器械推肩', bodyPart: 'shoulders', equipment: 'machine' },
	{ name: '哑铃侧平举', bodyPart: 'shoulders', equipment: 'dumbbell' },
	{ name: '哑铃前平举', bodyPart: 'shoulders', equipment: 'dumbbell' },
	{ name: '俯身反向飞鸟', bodyPart: 'shoulders', equipment: 'dumbbell' },
	{ name: '绳索侧平举', bodyPart: 'shoulders', equipment: 'cable' },

	{ name: '杠铃弯举', bodyPart: 'arms', equipment: 'barbell' },
	{ name: '哑铃弯举', bodyPart: 'arms', equipment: 'dumbbell' },
	{ name: '牧师凳弯举', bodyPart: 'arms', equipment: 'machine' },
	{ name: '绳索弯举', bodyPart: 'arms', equipment: 'cable' },
	{ name: '三头下压', bodyPart: 'arms', equipment: 'cable' },
	{ name: '绳索过顶臂屈伸', bodyPart: 'arms', equipment: 'cable' },
	{ name: '窄距卧推', bodyPart: 'arms', equipment: 'barbell' },
	{ name: '双杠臂屈伸', bodyPart: 'arms', equipment: 'bodyweight' },

	{ name: '卷腹', bodyPart: 'core', equipment: 'bodyweight' },
	{ name: '平板支撑', bodyPart: 'core', equipment: 'bodyweight' },
	{ name: '悬垂举腿', bodyPart: 'core', equipment: 'bodyweight' },
	{ name: '绳索卷腹', bodyPart: 'core', equipment: 'cable' },
	{ name: '俄罗斯转体', bodyPart: 'core', equipment: 'bodyweight' },

	{ name: '跑步机', bodyPart: 'cardio', equipment: 'cardio' },
	{ name: '椭圆机', bodyPart: 'cardio', equipment: 'cardio' },
	{ name: '划船机', bodyPart: 'cardio', equipment: 'cardio' },
	{ name: '动感单车', bodyPart: 'cardio', equipment: 'cardio' },
	{ name: '爬楼机', bodyPart: 'cardio', equipment: 'cardio' }
];

