<template>
	<div class="component-catch">
		<div class="note-list" v-if="searching">
			<div class="preview" v-for="uuid in searchSet" :key="uuid">
				<div
					class="preview-title-body"
					@click="manageNote(uuid), toggleManager(true), focusBody()"
				>
					<div class="preview-title">
						{{ allNotes.get(uuid).title }}
					</div>
					<div class="preview-body">
						{{ allNotes.get(uuid).body }}
					</div>
				</div>
				<div class="btns-order">
					<button
						class="btn-up"
						@click="changeOrder(name, uuid, 'up')"
					>
						<div class="ico-up">
							<fa-icon :icon="['fas', 'sort-up']" />
						</div>
					</button>
					<button
						class="btn-down"
						@click="changeOrder(name, uuid, 'down')"
					>
						<div class="ico-down">
							<fa-icon :icon="['fas', 'sort-down']" />
						</div>
					</button>
				</div>
				<button
					class="btn-edit"
					@click="manageNote(uuid), toggleManagerBar(true)"
				>
					<fa-icon :icon="['fas', 'edit']" />
				</button>
			</div>
		</div>
		<div class="note-list" v-else>
			<div v-if="name === 'ACTIVE'">
				<div
					v-if="
						location.has('PINNED') &&
							location.get('PINNED').size > 0
					"
					class="list-title"
				>
					PINNED
				</div>
				<div
					class="preview"
					id="pinned"
					v-for="uuid in location.get('PINNED')"
					:key="uuid"
				>
					<div
						class="preview-title-body"
						@click="manageNote(uuid), toggleManager(true)"
					>
						<div class="preview-title">
							{{ allNotes.get(uuid).title }}
						</div>
						<div class="preview-body">
							{{ allNotes.get(uuid).body }}
						</div>
					</div>
					<div class="btns-order">
						<button
							class="btn-up"
							@click="changeOrder(name, uuid, 'up')"
						>
							<div class="ico-up">
								<fa-icon :icon="['fas', 'sort-up']" />
							</div>
						</button>
						<button
							class="btn-down"
							@click="changeOrder(name, uuid, 'down')"
						>
							<div class="ico-down">
								<fa-icon :icon="['fas', 'sort-down']" />
							</div>
						</button>
					</div>
					<button
						class="btn-edit"
						@click="manageNote(uuid), toggleManagerBar(true)"
					>
						<fa-icon :icon="['fas', 'edit']" />
					</button>
				</div>
			</div>
			<div v-if="allNotes.size > 0" class="list-title">
				{{ name }}
			</div>
			<div class="preview" v-for="uuid in location.get(name)" :key="uuid">
				<div
					class="preview-title-body"
					@click="manageNote(uuid), toggleManager(true), focusBody()"
				>
					<div class="preview-title">
						{{ allNotes.get(uuid).title }}
					</div>
					<div class="preview-body">
						{{ allNotes.get(uuid).body }}
					</div>
				</div>
				<div class="btns-order" :id="'btns-order' + uuid">
					<button
						class="btn-up"
						@click="changeOrder(name, uuid, 'up')"
					>
						<div class="ico-up">
							<fa-icon :icon="['fas', 'sort-up']" />
						</div>
					</button>
					<button
						class="btn-down"
						@click="changeOrder(name, uuid, 'down')"
					>
						<div class="ico-down">
							<fa-icon :icon="['fas', 'sort-down']" />
						</div>
					</button>
				</div>
				<button
					class="btn-edit"
					:id="'btn-edit' + uuid"
					@click="
						manageNote(uuid),
							toggleManagerBar(true),
							toggleEdit(false, this.editUUID);
						toggleEdit(true, uuid);
					"
				>
					<fa-icon :icon="['fas', 'edit']" />
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '../store/index';
import app from '../App.vue';
import manager from '../views/Manager.vue';

export default defineComponent({
	data() {
		return {
			editUUID: '',
		};
	},
	methods: {
		manageNote(uuid: string) {
			store.commit('manageNote', uuid);
			store.state.tempTags = store.getters.getAllNotes.get(uuid).tags;
		},

		changeOrder(name: string, uuid: string, direction: string) {
			const type = 'noteList';
			store.commit('changeOrder', { type, name, uuid, direction });
		},

		toggleManager(boolean: boolean) {
			app.methods!.toggleManager(boolean);
			if (window.innerWidth <= 1024) {
				if (this.editUUID === '') {
					return;
				}
				document.getElementById(
					'btns-order' + this.editUUID
				)!.style.display = 'none';
				document.getElementById(
					'btn-edit' + this.editUUID
				)!.style.display = 'block';
			}
		},

		toggleManagerBar(boolean: boolean) {
			app.methods!.toggleManagerBar(boolean);
		},

		focusBody() {
			manager.methods!.focusBody();
		},

		toggleEdit(boolean: boolean, uuid: string) {
			if (window.innerWidth <= 1024) {
				if (uuid === '') {
					return;
				}
				if (boolean) {
					document.getElementById(
						'btns-order' + uuid
					)!.style.display = 'block';
					document.getElementById('btn-edit' + uuid)!.style.display =
						'none';
				} else {
					document.getElementById(
						'btns-order' + uuid
					)!.style.display = 'none';
					document.getElementById('btn-edit' + uuid)!.style.display =
						'block';
				}
				this.editUUID = uuid;
			}
		},
	},
	computed: {
		allNotes() {
			return store.getters.getAllNotes;
		},

		location() {
			return store.getters.getLocation;
		},

		name() {
			return store.getters.getName;
		},

		active() {
			return store.getters.getActive;
		},

		searching() {
			return store.getters.getSearching;
		},

		search() {
			return store.getters.getSearch;
		},

		searchSet() {
			return store.getters.getSearchSet;
		},
	},
});
</script>

<style scoped>
.list-title {
	padding: 10px;
	font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
	font-size: 18px;
	font-weight: bold;
	text-transform: uppercase;
	color: rgba(255, 255, 255, 0.5);
	border-bottom: 3px solid rgba(0, 0, 0, 0.125);
}

.note-list {
	width: 30vw;
	height: 90vh;
	overflow: overlay;
}

.note-list::-webkit-scrollbar {
	width: 5px;
}

.note-list::-webkit-scrollbar-track {
	background-color: transparent;
}

.note-list::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.11);
}

.preview {
	display: flex;
	/* height: 10vh; */
	height: auto;
	/* min-height: 72px;
	max-height: 136px; */
	/* height: 124px; */
	/* padding: 10px; */
	font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
	border-bottom: 3px solid rgba(0, 0, 0, 0.125);
	text-overflow: ellipsis;
	/* no select */
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

.preview:hover {
	/* background: rgba(0, 0, 0, 0.25); */
	/* outline or border? */
	outline: 1px solid rgba(255, 255, 255, 0.5);
	color: rgb(255, 255, 255);
	cursor: pointer;
}

/* #pinned {
	background-color: rgba(25, 0, 255, 0.288);
} */

.preview-title-body {
	width: calc(30vw - 10vh);
	padding: 10px;
}

.preview-title {
	font-size: 20px;
	font-weight: bold;
	padding-bottom: 10px;
	color: rgba(255, 255, 255, 0.781);
}

.preview-body {
	font-size: 16px;
	color: rgba(255, 255, 255, 0.548);
	/* height: 10vh; */
	width: calc(30vw - 20px);
	line-height: 1.5em;
	height: 4.5em;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	word-wrap: break-word;
	overflow: hidden;
	text-overflow: ellipsis;
}

.btns-order {
	visibility: hidden;
	height: inherit;
	width: 10vh;
}

.preview:hover .btns-order {
	visibility: visible;
}

.btn-up,
.btn-down {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 5vh;
	width: 10vh;
}

.btn-up:hover,
.btn-down:hover {
	background: transparent;
}

.ico-up,
.ico-down {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 5vh;
	width: 10vh;
	cursor: pointer;
}

.ico-up:hover {
	color: rgb(255, 255, 255);
	background: rgba(255, 255, 255, 0.125);
	/* border-top-left-radius: 2.5vh; */
}
.ico-down:hover {
	color: rgb(255, 255, 255);
	background: rgba(255, 255, 255, 0.125);
	/* border-bottom-left-radius: 2.5vh; */
}

.btn-edit {
	display: none;
}

/* tablets and other mobile devices will use the same formatting for the sake of consistency */
@media only screen and (max-width: 1024px) {
	.note-list {
		width: 100vw;
	}

	.preview {
		height: 10vh;
	}

	.preview:hover {
		background-color: transparent;
	}

	/* .preview:active {
		background: rgba(0, 0, 0, 0.25);
		color: rgb(255, 255, 255);
	} */

	.preview-title-body {
		width: calc(100vw - 10vh);
	}

	.btns-order {
		display: none;
		height: 10vh;
		width: 10vh;
	}

	.btn-up,
	.btn-down {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 5vh;
		width: 10vh;
	}

	.ico-up,
	.ico-down {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 5vh;
		width: 10vh;
		cursor: pointer;
	}

	.ico-up:hover,
	.ico-down:hover {
		background: transparent;
	}

	.ico-up:active,
	.ico-down:active {
		color: rgb(255, 255, 255);
		background: rgba(255, 255, 255, 0.125);
		border-radius: 0%;
	}

	.btn-edit {
		color: rgba(255, 255, 255, 0.5);
		display: block;
		position: relative;
		width: 10vh;
	}
}
</style>
