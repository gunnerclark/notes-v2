<template>
	<div class="component-catch">
		<div class="nav-menu">
			<button class="btn-nav" @click="toggleMenu(false)">
				<div class="ico-nav">
					<fa-icon :icon="['fas', 'grip-lines']" />
				</div>
			</button>
			<button class="btn-user" @click="logOutDemo">
				<div class="ico-user">
					<fa-icon :icon="['fas', 'sign-in-alt']" />
				</div>
			</button>
			<div class="btns-hard">
				<button
					class="btns"
					@click="changeList('ACTIVE'), toggleMenu(false)"
				>
					notes
				</button>
				<button
					class="btns"
					@click="changeList('ARCHIVE'), toggleMenu(false)"
				>
					archive
				</button>
				<button
					class="btns"
					@click="changeList('TRASH'), toggleMenu(false)"
				>
					trash
				</button>
			</div>
			<div v-if="tagCount > 0">
				<div class="tag-label">
					TAGS
				</div>
			</div>
			<div v-for="name in location.keys()" :key="name">
				<div
					v-if="
						name !== 'ACTIVE' &&
							name !== 'PINNED' &&
							name !== 'ARCHIVE' &&
							name !== 'TRASH'
					"
				>
					<button
						class="btns-tags"
						@click="changeList(name), toggleMenu(false)"
					>
						{{ name }}
					</button>
				</div>
			</div>
		</div>
		<div class="manager-cover" @click="toggleMenu(false)"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '../store/index';
import app from '../App.vue';

export default defineComponent({
	data() {
		return {};
	},
	methods: {
		toggleMenu(boolean: boolean) {
			app.methods!.toggleMenu(boolean);
		},

		changeList(name: string) {
			store.state.name = name;
		},

		toggleManager(boolean: boolean) {
			app.methods!.toggleManager(boolean);
		},

		logOutDemo() {
			store.state.loggedIn = false;
			this.$router.push('login')
		}
	},
	computed: {
		location() {
			return store.getters.getLocation;
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
.component-catch {
	width: 100vw;
}

.btn-nav,
.btn-user {
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
.btn-user:hover {
	background: transparent;
}

.ico-nav,
.ico-user {
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
.ico-user:hover {
	height: 7vh;
	width: 7vh;
	background-color: rgba(255, 255, 255, 0.05);
	color: white;
}

.btn-user {
	position: relative;
	left: calc(30vw - 20vh);
}

.btns {
	height: 60px;
	width: 30vw;
	font-weight: bold;
	font-size: 16px;
	font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
	color: white;
	background: transparent;
	border: none;
	text-align: left;
	padding-left: 2vw;
}

.btns:hover {
	background-color: rgba(255, 255, 255, 0.125);
	cursor: pointer;
}

.btns-tags {
	height: 60px;
	width: 30vw;
	font-size: 16px;
	font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
	color: white;
	background: transparent;
	border: none;
	text-align: left;
	padding-left: 2vw;
}

.btns-tags:hover {
	background-color: rgba(255, 255, 255, 0.125);
	cursor: pointer;
}

.nav-menu {
	float: left;
	height: 100vh;
	width: 30vw;
	background: black;
	color: white;
	font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
	font-size: 16px;
}

.manager-cover {
	float: right;
	height: 100vh;
	width: 70vw;
	background: rgba(0, 0, 0, 0.747);
	font-size: 30px;
	color: white;
	text-align: center;
}

.tag-label {
	padding: 2vw;
	font-weight: bold;
	color: rgba(255, 255, 255, 0.349);
}

/* tablets and other mobile devices will use the same formatting for the sake of consistency */
@media only screen and (max-width: 1024px) {
	.btns {
		width: 70vw;
		padding-left: 3.5vh;
	}

	.btns:hover {
		background-color: transparent;
	}

	.btns:active {
		background-color: rgba(255, 255, 255, 0.05);
	}

	.btn-user {
		position: relative;
		left: calc(70vw - 20vh);
	}

	.ico-nav:hover,
	.ico-user:hover {
		background-color: transparent;
	}

	.ico-nav:active,
	.ico-user:active {
		background-color: rgba(255, 255, 255, 0.05);
		color: white;
	}

	.btns-tags {
		width: 70vw;
		padding-left: 3.5vh;
	}

	.btns-tags:hover {
		background-color: transparent;
	}

	.btns-tags:active {
		background-color: rgba(255, 255, 255, 0.05);
	}

	.nav-menu {
		width: 70vw;
	}

	.manager-cover {
		width: 30vw;
	}

	.tag-label {
		padding-left: 3.5vh;
	}
}
</style>
