import { Fields, Model } from '@vuex-orm/core';
import Box from "@/store/models/box";

export default class Thread extends Model {
	static entity = 'threads';
	static primaryKey = '$id';

	static fields(): Fields {
		return {
			fromBoxId: this.string(''),
			toBoxId: this.string(''),
			fromBoxSide: this.string(''),
			toBoxSide: this.string(''),

			fromBox: this.belongsTo(Box, 'fromBoxId'),
			toBox: this.belongsTo(Box, 'toBoxId')
		};
	}
}
