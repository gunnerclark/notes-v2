<template>
	<div class="component-catch">
		<div v-if="searching">
			<button class="btn-nav" @click="clearSearch(true)">
				<div class="ico-nav">
					<fa-icon :icon="['fas', 'chevron-left']" />
				</div>
			</button>
		</div>
		<div v-else>
			<button class="btn-nav" @click="toggleMenu(true)">
				<div class="ico-nav">
					<fa-icon :icon="['fas', 'grip-lines']" />
				</div>
			</button>
		</div>
		<div class="search-bar">
			<input
				v-model="search"
				:placeholder="'Search notes...'"
				@keydown.enter.prevent="searchNotes"
			/>
		</div>
		<div v-if="searching || search.length > 0">
			<div class="btn-right">
				<button class="btn-add" @click="clearSearch(false)">
					<div class="ico-add">
						<fa-icon :icon="['fas', 'times']" />
					</div>
				</button>
			</div>
		</div>
		<div v-else>
			<div class="btn-right">
				<button
					class="btn-add"
					@click="
						createNote('', '', new Set()),
							toggleManager(true),
							focusBody()
					"
				>
					<div class="ico-add">
						<fa-icon :icon="['fas', 'plus']" />
					</div>
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
		return {};
	},
	methods: {
		createNote(title: string, body: string, tags: Array<string>) {
			store.commit('createNote', { title, body, tags });
		},

		setLocation(name: string, uuid: string) {
			store.commit('setLocation', { name, uuid });
		},

		toggleMenu(boolean: boolean) {
			app.methods!.toggleMenu(boolean);
		},

		toggleManager(boolean: boolean) {
			app.methods!.toggleManager(boolean);
		},

		focusBody() {
			manager.methods!.focusBody();
		},

		searchNotes() {
			store.commit('searchNotes');
		},

		clearSearch(exit: boolean) {
			if (exit) {
				store.state.searching = false;
				store.state.search = '';
			} else {
				store.state.search = '';
			}
		},
	},
	computed: {
		name() {
			return store.getters.getName.toUpperCase();
		},

		searching() {
			return store.getters.getSearching;
		},

		search: {
			get() {
				return store.getters.getSearch;
			},
			set(value) {
				store.state.search = value;
			},
		},
	},
});
</script>

<style scoped>
.component-catch {
	display: flex;
	width: inherit;
	height: 10vh;
	background: rgba(0, 0, 0, 0.125);
}

/* .btn-nav {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
}

.btn-nav:hover {
	background: transparent;
}

.ico-nav {
	display: flex;
	height: 7vh;
	width: 7vh;
	align-items: center;
	justify-content: center;
	border-radius: 100%;
}

.ico-nav:hover {
	height: 7vh;
	width: 7vh;
	background-color: rgba(255, 255, 255, 0.05);
} */

/*  */
.btn-nav,
.btn-add {
	width: 10vh;
	height: 10vh;
	background: black;
	background: transparent;
	border: none;
	font-size: 24px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.btn-nav:hover,
.btn-add:hover {
	background: transparent;
}

.ico-nav,
.ico-add {
	display: flex;
	height: 7vh;
	width: 7vh;
	align-items: center;
	justify-content: center;
	border-radius: 100%;
	cursor: pointer;
	color: rgba(255, 255, 255, 0.5);
}

.ico-nav:hover,
.ico-add:hover {
	height: 7vh;
	width: 7vh;
	background-color: rgba(255, 255, 255, 0.05);
	color: white;
}
/*  */

.search-bar {
	width: calc(30vw - 20vh);
}

.search-bar input {
	height: 10vh;
	width: calc(30vw - 20vh);
	background: transparent;
	border: none;
	color: white;
	font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
	font-size: 16px;
}

button {
	height: 10vh;
	width: 10vh;
}

button:hover {
	cursor: pointer;
}

/* tablets and other mobile devices will use the same formatting for the sake of consistency */
@media only screen and (max-width: 1024px) {
	.btn-right {
		/* padding-left: calc(100vw - 20vh); */
	}

	.search-bar {
		width: calc(100vw - 20vh);
	}

	.search-bar input {
		height: 10vh;
		width: calc(100vw - 20vh);
	}

	.ico-nav:hover,
	.ico-add:hover {
		background-color: transparent;
	}

	.ico-nav:active,
	.ico-add:active {
		background-color: rgba(255, 255, 255, 0.05);
		color: white;
	}
}
</style>
