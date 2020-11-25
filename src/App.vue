<template>
	<div class="app">
		<div class="nav-menu" id="nav-menu">
			<navMenu />
		</div>
		<div>
			<div class="list-bar" id="list-bar">
				<listBar />
			</div>
			<div class="list" id="list">
				<list />
			</div>
		</div>
		<div class="manager">
			<managerBar />
			<manager />
		</div>
	</div>
</template>

<script>
import navMenu from './components/navMenu';
import list from './views/List';
import listBar from './components/listBar';
import manager from './views/Manager';
import managerBar from './components/managerBar';

export default {
	name: 'App',
	components: {
		navMenu,
		list,
		listBar,
		manager,
		managerBar,
	},
	methods: {
		toggleMenu(boolean) {
			if (boolean === false) {
				document.getElementById('nav-menu').style.display = 'none';
			} else if (boolean === true) {
				document.getElementById('nav-menu').style.display =
					'inline-block';
			}
		},

		toggleManager(boolean) {
			if (window.innerWidth <= 1024) {
				if (boolean) {
					document.getElementById('list-bar').style.zIndex = '1';
					document.getElementById('list').style.zIndex = '1';
				} else {
					document.getElementById('list-bar').style.zIndex = '3';
					document.getElementById('list').style.zIndex = '3';
				}
			}
		},

		toggleManagerBar(boolean) {
			if (window.innerWidth <= 1024) {
				if (boolean) {
					document.getElementById('list-bar').style.zIndex = '1';
				} else {
					document.getElementById('list-bar').style.zIndex = '3';
				}
			}
		},
	},
	mounted() {
		// initially hide nav-menu
		document.getElementById('nav-menu').style.display = 'none';
	},
};
</script>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

input:focus,
select:focus,
textarea:focus,
button:focus {
	outline: none;
}

button {
	background: transparent;
	border: none;
	color: white;
	font-size: 18px;
}

button:hover {
	background-color: rgba(255, 255, 255, 0.05);
}

.app {
	display: inline-flex;
}

.nav-menu {
	z-index: 10;
	position: absolute;
}

.list-bar {
	background-color: rgb(37, 37, 65);
}

.list {
	width: 30vw;
	height: 90vh;
	background-color: rgb(37, 37, 65);
}

.manager {
	width: 70vw;
	height: 100vh;
	background-color: rgb(37, 37, 65);
}

/* tablets and other mobile devices will use the same formatting for the sake of consistency */
@media only screen and (max-width: 1024px) {
	button:hover {
		background-color: transparent;
	}

	button:active {
		background-color: rgba(255, 255, 255, 0.05);
	}

	.nav-menu {
		top: 0;
	}

	.list {
		z-index: 3;
		position: absolute;
		top: 10vh;
		width: 100vw;
	}

	.list-bar {
		z-index: 3;
		position: absolute;
		top: 0;
	}

	.manager {
		z-index: 2;
		position: absolute;
		width: 100vw;
		top: 0;
	}
}
</style>
