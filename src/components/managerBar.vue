<template>
	<div class="component-catch">
		<div class="catcher" v-if="allNotes.size > 0 && manageState === true">
			<div>
				<button
					class="btn-save"
					@click="
						toggleManager(false),
							saveNote(managingUUID),
							removeLocation('tags', managingUUID),
							setTagLocation(managingUUID),
							toggleEdit(false, managingUUID)
					"
				>
					<div class="ico-save">
						<fa-icon :icon="['fas', 'save']" />
					</div>
				</button>
			</div>
			<div class="btns">
				<button class="btn-checkbox" @click="toggleCheck(managingUUID)">
					<div class="ico-list">
						<div v-if="!tempChecklist.length > 0">
							<fa-icon :icon="['fas', 'list']" />
						</div>
						<div v-else>
							<fa-icon :icon="['fas', 'sticky-note']" />
						</div>
					</div>
				</button>
				<button
					class="btn-pin"
					@click="setLocation('PINNED', managingUUID, true)"
				>
					<div class="ico-pin">
						<div v-if="managingLocation === 'PINNED'">
							<fa-icon :icon="['fas', 'bookmark']" />
						</div>
						<div v-else>
							<fa-icon :icon="['far', 'bookmark']" />
						</div>
					</div>
				</button>
				<div v-if="managingLocation === 'TRASH'">
					<button
						class="btn-trash"
						@click="
							toggleManager(false),
								removeLocation('tags', managingUUID),
								deleteNote()
						"
					>
						<div class="ico-trash">
							<fa-icon :icon="['fas', 'trash']" />
						</div>
					</button>
				</div>
				<div v-else>
					<button
						class="btn-archive"
						@click="
							toggleManager(false),
								saveNote(managingUUID),
								setLocation('ARCHIVE', managingUUID, true)
						"
					>
						<div class="ico-archive">
							<div v-if="managingLocation === 'ARCHIVE'">
								<fa-icon :icon="['fas', 'folder']" />
							</div>
							<div v-else>
								<fa-icon :icon="['far', 'folder']" />
							</div>
						</div>
					</button>
				</div>
				<button
					class="btn-trash"
					@click="
						toggleManager(false),
							saveNote(managingUUID),
							setLocation('TRASH', managingUUID, true)
					"
				>
					<div class="ico-trash">
						<div v-if="managingLocation === 'TRASH'">
							<fa-icon :icon="['fas', 'trash-restore']" />
						</div>
						<div v-else>
							<fa-icon :icon="['fas', 'trash']" />
						</div>
					</div>
				</button>
			</div>
		</div>
		<div class="default" v-else>
			:3
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '../store/index';
import app from '../App.vue';
import list from '../views/List.vue';
import manager from '../views/Manager.vue'

export default defineComponent({
	data() {
		return {
			allNotes: store.getters.getAllNotes,
		};
	},
	methods: {
		saveNote(
			managingUUID: string,
			title: string,
			body: string,
			tags: Array<string>,
			checkbox: boolean
		) {
			store.commit('saveNote', {
				managingUUID,
				title,
				body,
				tags,
				checkbox,
			});
		},

		trashNote(managingUUID: string) {
			store.commit('trashNote', managingUUID);
		},

		toggleManager(boolean: boolean) {
			app.methods!.toggleManager(boolean);
			store.commit('toggleManageState');
		},

		setLocation(name: string, uuid: string, base: boolean) {
			store.commit('setLocation', { name, uuid, base });
		},

		removeLocation(type: string, uuid: string) {
			store.commit('removeLocation', { type, uuid });
		},

		setTagLocation(uuid: string) {
			const tempArray = Array.from(store.state.tempTags);
			const length = tempArray.length;
			for (let i = 0; i < length; i++) {
				const name = tempArray[i];
				store.commit('setLocation', { name, uuid });
			}
		},

		toggleCheck(uuid: string) {
			store.commit('toggleCheck', uuid);
		},

		findLocation() {
			store.commit('findLocation', store.getters.getManagingUUID);
		},

		deleteNote() {
			store.commit('deleteNote');
		},

		toggleEdit(boolean: boolean, uuid: string) {
			list.methods!.toggleEdit(boolean, uuid);
		},
	},
	computed: {
		manageState() {
			return store.getters.getManageState;
		},

		managingUUID() {
			return store.getters.getManagingUUID;
		},

		managingLocation() {
			return store.getters.getManagingLocation;
		},

		tempChecklist() {
			return store.state.tempChecklist;
		},
	},
});
</script>

<style scoped>
.catcher {
	display: flex;
	width: inherit;
	height: 10vh;
	background: rgba(0, 0, 0, 0.25);
}

.default {
	width: inherit;
	height: 10vh;
	background: rgba(0, 0, 0, 0.25);
	font-size: 50px;
	color: white;
	text-align: center;
	/* align vertically */
	padding-top: 1vh;
}

button {
	width: 10vh;
	height: 10vh;
	color: white;
	background: black;
	background: transparent;
	border: none;
	font-size: 24px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

button:hover {
	background: transparent;
}

.btns {
	display: flex;
	padding-left: calc(70vw - 50vh);
}

.ico-save,
.ico-list,
.ico-archive,
.ico-pin,
.ico-trash {
	display: flex;
	height: 7vh;
	width: 7vh;
	align-items: center;
	justify-content: center;
	border-radius: 100%;
	cursor: pointer;
	color: rgba(255, 255, 255, 0.5);
}

.ico-save:hover,
.ico-list:hover,
.ico-archive:hover,
.ico-pin:hover,
.ico-trash:hover {
	height: 7vh;
	width: 7vh;
	background-color: rgba(255, 255, 255, 0.05);
	color: white;
}
/* tablets and other mobile devices will use the same formatting for the sake of consistency */
@media only screen and (max-width: 1024px) {
	.component-catch {
		display: inline-flex;
	}

	button {
		width: calc(100vw / 5);
	}

	.ico-save:hover,
	.ico-list:hover,
	.ico-archive:hover,
	.ico-pin:hover,
	.ico-trash:hover {
		background-color: transparent;
	}

	.ico-save:active,
	.ico-list:active,
	.ico-archive:active,
	.ico-pin:active,
	.ico-trash:active {
		background-color: rgba(255, 255, 255, 0.05);
		color: white;
	}
}
</style>
