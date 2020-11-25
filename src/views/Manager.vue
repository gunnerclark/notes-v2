<template>
	<div class="component-catch">
		<div v-if="allNotes.size > 0 && manageState === true">
			<textarea class="title-input" v-model="title" placeholder="title" />
			<br />
			<div v-if="!tempChecklist.length > 0">
				<textarea
					id="body"
					class="body-input"
					v-model="body"
					placeholder="body"
				/>
			</div>
			<div class="check-list" v-else>
				<div
					@keydown.enter.prevent="addListItem(index)"
					v-for="(item, index) in tempChecklist"
					:key="item"
				>
					<div class="check-item" v-if="item.checked === false">
						<button
							class="btn-unchecked"
							@click="item.checked = true"
						>
							<fa-icon :icon="['far', 'square']" />
						</button>
						<textarea
							:id="index.toString()"
							class="check-input"
							v-model="item.note"
							placeholder="item"
						/>
						<div class="btns-order">
							<button
								class="btn-up"
								@click="changeOrder(name, index, 'up')"
							>
								<div class="ico-up">
									<fa-icon :icon="['fas', 'sort-up']" />
								</div>
							</button>
							<button
								class="btn-down"
								@click="changeOrder(name, index, 'down')"
							>
								<div class="ico-down">
									<fa-icon :icon="['fas', 'sort-down']" />
								</div>
							</button>
						</div>
						<button
							class="btn-remove"
							@click="removeListItem(index)"
						>
							<fa-icon :icon="['fas', 'times']" />
						</button>
					</div>
					<div class="check-item" v-else>
						<button
							class="btn-checked"
							@click="item.checked = false"
						>
							<fa-icon :icon="['far', 'check-square']" />
						</button>
						<textarea
							:id="index.toString()"
							class="check-input"
							v-model="item.note"
							placeholder="item"
						/>
						<div class="btns-order">
							<button
								class="btn-up"
								@click="changeOrder(name, index, 'up')"
							>
								<div class="ico-up">
									<fa-icon :icon="['fas', 'sort-up']" />
								</div>
							</button>
							<button
								class="btn-down"
								@click="changeOrder(name, index, 'down')"
							>
								<div class="ico-down">
									<fa-icon :icon="['fas', 'sort-down']" />
								</div>
							</button>
						</div>
						<button
							class="btn-remove"
							@click="removeListItem(index)"
						>
							<fa-icon :icon="['fas', 'times']" />
						</button>
					</div>
					<div v-if="index === tempChecklist.length - 1">
						<button class="check-add" @click="addListItem(index)">
							<div class="check-plus">
								<fa-icon :icon="['fas', 'plus']" />
							</div>
							<div>LIST ITEM</div>
						</button>
					</div>
				</div>
			</div>
			<div class="tags">
				<div class="tag-input">
					<button id="tag-btn" @click="toggleTagInput(true)">
						<fa-icon :icon="['fas', 'plus']" />
					</button>
					<input
						id="tag-input"
						@blur="toggleTagInput(false)"
						@keyup.enter.prevent="addTag()"
						v-model="tag"
						placeholder="enter tag"
					/>
				</div>
				<div class="tag-list">
					<div class="tag-preview" v-for="tag in tempTags" :key="tag">
						<div class="tag-name">
							{{ tag }}
						</div>
						<button class="tag-remove" @click="removeTag(tag)">
							<fa-icon :icon="['fas', 'times']" />
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="default-catch" v-else>
			<div class="default">
				<div class="count-item">
					<div class="count-label">
						NOTE COUNT:
					</div>
					<div class="count-number">{{ noteCount }}</div>
				</div>
				<div class="count-item">
					<div class="count-label">
						PIN COUNT:
					</div>
					<div class="count-number">{{ pinCount }}</div>
				</div>
				<div class="count-item">
					<div class="count-label">
						ARCHIVE COUNT:
					</div>
					<div class="count-number">{{ archiveCount }}</div>
				</div>
				<div class="count-item">
					<div class="count-label">
						TRASH COUNT:
					</div>
					<div class="count-number">{{ trashCount }}</div>
				</div>
				<div class="count-item">
					<div class="count-label">
						TAG COUNT:
					</div>
					<div class="count-number">{{ tagCount }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '../store/index';

export default defineComponent({
	data() {
		return {
			allNotes: store.getters.getAllNotes,
			checkbox: false,
			tag: '',
		};
	},
	methods: {
		toggleTagInput(boolean: boolean) {
			if (boolean === false) {
				document.getElementById('tag-input')!.style.display = 'none';
				document.getElementById('tag-btn')!.style.display = 'block';
			} else if (boolean === true) {
				document.getElementById('tag-btn')!.style.display = 'none';
				document.getElementById('tag-input')!.style.display = 'block';
				document.getElementById('tag-input')!.focus();
			}
		},

		addTag() {
			store.state.tempTags.add(this.tag.toLowerCase());
			this.tag = '';
		},

		removeTag(tag: string) {
			store.state.tempTags.delete(tag);
		},

		addListItem(index: any) {
			if (store.state.tempChecklist.length > 1) {
				let checklist = store.state.tempChecklist;
				const remainder = checklist.splice(index + 1);
				checklist.push({ checked: false, note: '' });
				checklist = checklist.concat(remainder);

				store.state.tempChecklist = checklist;

				setTimeout(function() {
					const pos = (index + 1).toString();
					document.getElementById(pos)!.focus();
				}, 1);
			} else {
				store.state.tempChecklist.push({ checked: false, note: '' });
				setTimeout(function() {
					const pos = (
						store.state.tempChecklist.length - 1
					).toString();
					document.getElementById(pos)!.focus();
				}, 1);
			}
		},

		removeListItem(index: any) {
			store.state.tempChecklist.splice(index, 1);
		},

		focusBody() {
			// delays focus so that manager can load in content
			setTimeout(function() {
				if (store.state.tempChecklist.length === 0) {
					return document.getElementById('body')!.focus();
				} else {
					/*
					const pos = (
						store.state.tempChecklist.length - 1
					).toString();
					return document.getElementById(pos)!.focus();
					*/
				}
			}, 1);
		},

		changeOrder(name: string, index: string, direction: string) {
			const type = 'checkList';
			const uuid = index;
			store.commit('changeOrder', { type, name, uuid, direction });
		},
	},
	computed: {
		manageState() {
			return store.getters.getManageState;
		},

		managingUUID() {
			return store.getters.getManagingUUID;
		},

		title: {
			get() {
				return store.state.tempTitle;
			},
			set(value) {
				store.state.tempTitle = value;
			},
		},

		body: {
			get() {
				return store.state.tempBody;
			},
			set(value) {
				store.state.tempBody = value;
			},
		},

		tempTags() {
			return store.state.tempTags;
		},

		tempChecklist() {
			return store.state.tempChecklist;
		},

		focusElements() {
			return document.getElementById('body')!.focus();
		},

		noteCount() {
			return store.getters.getAllNotes.size;
		},

		pinCount() {
			if (store.getters.getLocation.has('pinned')) {
				return store.getters.getLocation.get('pinned').size;
			} else {
				return 0;
			}
		},

		archiveCount() {
			if (store.getters.getLocation.has('archive')) {
				return store.getters.getLocation.get('archive').size;
			} else {
				return 0;
			}
		},

		trashCount() {
			if (store.getters.getLocation.has('trash')) {
				return store.getters.getLocation.get('trash').size;
			} else {
				return 0;
			}
		},

		tagCount() {
			const locationCopy = new Map(store.getters.getLocation);
			locationCopy.delete('ACTIVE');
			locationCopy.delete('PINNED');
			locationCopy.delete('ARCHIVE');
			locationCopy.delete('TRASH');
			return locationCopy.size;
		},
	},
});
</script>

<style scoped>
.component-catch textarea {
	width: 70vw;
	/*  textarea is an inline (or inline-block) element, and the gap is the space reserved for descenders in text */
	vertical-align: top;
	border: none;
	resize: none;
}

.component-catch button:hover {
	background: transparent;
}

.title-input {
	padding-top: calc(5vh - (25px / 2));
	padding-left: calc((10vh - 25px) / 3);
	background: rgba(0, 0, 0, 0.125);
	height: 10vh;
	font-size: 25px;
	color: white;
	font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
	font-weight: bold;
	/* border-bottom: 2px solid rgba(0, 0, 0, 0.151); */
	/* border-bottom: 2px solid rgba(255, 255, 255, 0.025); */
}

.title-input::placeholder {
	color: rgba(255, 255, 255, 0.75);
}

.title-input::-webkit-scrollbar {
	width: 5px;
}

.title-input::-webkit-scrollbar-track {
	background-color: transparent;
}

.title-input::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.11);
}

.title-input::placeholder {
	color: rgba(255, 255, 255, 0.75);
}

.body-input {
	padding: calc((10vh - 25px) / 3);
	padding-top: 0;
	background: rgba(0, 0, 0, 0.125);
	height: 70vh;
	font-size: 20px;
	color: white;
	font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
	/* position: relative;
	top: -2px; */
	overflow: overlay;
}

.body-input::-webkit-scrollbar {
	width: 5px;
}

.body-input::-webkit-scrollbar-track {
	background-color: transparent;
}

.body-input::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.11);
}

.body-input::placeholder {
	color: rgba(255, 255, 255, 0.75);
}

.check-list {
	height: 70vh;
	overflow-y: scroll;
	overflow: overlay;
	background: rgba(0, 0, 0, 0.125);
}

.check-list::-webkit-scrollbar {
	width: 5px;
}

.check-list::-webkit-scrollbar-track {
	background-color: transparent;
}

.check-list::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.11);
}

.check-list::placeholder {
	color: rgba(255, 255, 255, 0.75);
}

.check-item {
	display: flex;
}

.check-item button {
	height: 7vh;
	width: 7vh;
}

.check-item textarea {
	/* currently scrolls instead of expanding height */
	height: 7vh;
	width: calc(70vw - 28vh);
	font-size: 20px;
	background: transparent;
	color: white;
	font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
	padding: calc((7vh / 2) - 15px);
}

.check-item textarea::placeholder {
	color: rgba(255, 255, 255, 0.75);
}

.btns-order {
	display: flex;
	width: 14vh;
	height: 7vh;
}

.btns-order button {
	color: transparent;
	cursor: pointer;
}

.check-item:hover .btns-order button {
	color: rgba(255, 255, 255, 0.5);
}

.btn-up,
.btn-down {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 7vh;
	width: 7vh;
}

.ico-up,
.ico-down {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 4vh;
	width: 4vh;
}

.btns-order:hover .ico-up:hover,
.btns-order:hover .ico-down:hover {
	color: rgb(255, 255, 255);
	background: rgba(255, 255, 255, 0.05);
	border-radius: 100%;
}

.check-add {
	display: flex;
	align-items: center;
	text-align: left;
	height: 7vh;
	width: 70vw;
}

.check-plus {
	width: 7vh;
	text-align: center;
}

.check-add,
.btn-unchecked,
.btn-checked,
.btn-remove {
	font-size: 20px;
	color: rgba(255, 255, 255, 0.5);
	cursor: pointer;
}

.btn-remove {
	color: transparent;
}

.check-item:hover .btn-remove {
	color: rgba(255, 255, 255, 0.5);
}

.check-item:hover .btn-remove:hover {
	color: rgb(240, 45, 45);
}

.check-add:hover,
.btn-unchecked:hover,
.btn-checked:hover,
.btn-remove:hover {
	color: white;
}

.tags {
	display: flex;
	align-items: center;
	height: 10vh;
	width: 70vw;
	background: rgba(0, 0, 0, 0.125);
	font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.tag-input button,
.tag-input input {
	border-radius: 15px;
	/* height: 6vh; */
	height: 48px;
	width: 12vh;
	background: rgba(0, 0, 0, 0.125);
	margin-left: calc((10vh - 25px) / 3);
	border: none;
	color: rgba(255, 255, 255, 0.5);
	font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
	font-size: 16px;
}

.tag-input button {
	font-size: 20px;
}

.tag-input button:hover {
	cursor: pointer;
	background: rgba(0, 0, 0, 0.25);
	color: white;
}

.tag-input input {
	padding-left: 10px;
}

#tag-input {
	display: none;
}

.tag-list {
	display: flex;
	align-items: center;
	overflow: overlay;
	overflow-y: hidden;
	height: 10vh;
}

.tag-list::-webkit-scrollbar {
	height: 5px;
}

.tag-list::-webkit-scrollbar-track {
	background-color: transparent;
}

.tag-list::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.11);
}

.tag-list::placeholder {
	color: rgba(255, 255, 255, 0.75);
}

.tag-preview {
	display: flex;
	border-radius: 15px;
	/* height: 6vh; */
	height: 48px;
	width: 12vh;
	min-width: 12vh;
	overflow: hidden;
	text-overflow: ellipsis;
	background: rgba(0, 0, 0, 0.125);
	margin-left: 10px;
	padding-left: 10px;
	align-items: center;
	color: white;
}

.tag-preview button {
	background: transparent;
}

.tag-name {
	overflow: hidden;
	min-width: 7vh;
}

.tag-remove {
	width: 5vh;
	color: rgba(0, 0, 0, 0.35);
	display: flex;
	justify-content: center;
}

.tag-remove:hover {
	color: rgb(240, 45, 45);
	cursor: pointer;
}

.default-catch {
	height: 90vh;
	background: rgba(0, 0, 0, 0.125);
}

.default {
	text-align: left;
	padding: 35px;
	font-size: 35px;
	color: white;
	/* align vertically
	position: relative;
	top: calc(45vh - 25px);
	 */
}

.count-item {
	display: inline-flex;
	padding-bottom: 10vh;
}

.count-label {
	width: calc(35vw - 52.5px);
	color: rgba(255, 255, 255, 0.5);
}

.count-number {
	width: 35vw;
	color: white;
}
/* tablets and other mobile devices will use the same formatting for the sake of consistency */
@media only screen and (max-width: 1024px) {
	.component-catch textarea {
		width: 100vw;
	}

	.check-item button {
		height: 7vh;
		width: 7vh;
	}

	.check-item textarea {
		width: calc(100vw - 14vh);
	}

	.check-add {
		width: 100vw;
	}

	.tags {
		width: 100vw;
	}

	.default {
		display: none;
	}

	.tag-input button:hover {
		background: transparent;
	}

	.tag-input button:active {
		cursor: pointer;
		background: rgba(0, 0, 0, 0.25);
		color: white;
	}

	.tag-remove:hover {
		color: transparent;
	}

	.tag-remove:active {
		color: rgb(240, 45, 45);
		cursor: pointer;
	}

	.check-item:hover .btns-order button {
		color: transparent;
	}

	.check-item:active .btns-order button {
		color: rgba(255, 255, 255, 0.5);
	}

	.btns-order:hover .ico-up:hover,
	.btns-order:hover .ico-down:hover {
		color: transparent;
		background: transparent;
	}

	.btns-order:active .ico-up:active,
	.btns-order:active .ico-down:hoactivever {
		color: rgb(255, 255, 255);
		background: rgba(255, 255, 255, 0.05);
		border-radius: 100%;
	}

	.check-item:hover .btn-remove {
		color: transparent;
	}

	.check-item:hover .btn-remove {
		color: rgba(255, 255, 255, 0.5);
	}

	.check-item:hover .btn-remove:hover {
		color: transparent;
	}

	.check-item:active .btn-remove:active {
		color: rgb(240, 45, 45);
	}

	.check-add:hover,
	.btn-unchecked:hover,
	.btn-checked:hover,
	.btn-remove:hover {
		color: transparent;
	}

	.check-add:active,
	.btn-unchecked:active,
	.btn-checked:active,
	.btn-remove:active {
		color: white;
	}

	/* .count-item {
		display: inline-flex;
		padding-bottom: 2vh;
	}

	.count-label {
		width: calc(50vw - 52.5px);
		color: rgba(255, 255, 255, 0.5);
	}

	.count-number {
		width: 35vw;
		color: white;
	} */
}
</style>
