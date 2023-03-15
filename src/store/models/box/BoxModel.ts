import { Fields, Model} from '@vuex-orm/core';
import Thread from "@/store/models/thread";

export default class BoxModel extends Model {
	static entity = 'box';
	static primaryKey = 'id';

	toThreads!: Thread[];
	fromThreads!: Thread[];

	static fields(): Fields {
		return {
			id: this.uid(),
			connectPoints: this.attr(['top', 'right', 'bottom', 'left']),

			toThreads: this.hasMany(Thread, 'toBoxId'),
			fromThreads: this.hasMany(Thread, 'fromBoxId'),
		};
	}
}
