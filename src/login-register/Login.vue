<template>
    <div class="component-catch">
        <div class="input-catch">
            <div class="title">LOGIN</div>
            <input class="input-email" v-model="email" placeholder="email" />
            <div class="password">
                <input class="input-password" :type="passwordFieldType" v-model="password" placeholder="password" />
                <button class="toggle-password" @click="passwordVisibility">
                    <div v-if="this.passwordFieldType === 'password'">
                        <fa-icon :icon="['fas', 'eye-slash']"/>
                    </div>
                    <div v-else>
                        <fa-icon :icon="['fas', 'eye']"/>
                    </div>
                </button>
            </div>
            <button class="btn-submit" @keyup.enter.prevent="verifyAccount()" @click="verifyAccount()">LOGIN</button>
            <div class="register">Need an account? Click here to <router-link to="/register">Register</router-link></div>
        </div>
    </div>  
</template>

<script>
import store from '../store/index';

export default {
    name: 'login',
    data() {
        return {
            email: 'demo@gunnerclark.dev',
            password: 'Password123',
            passwordFieldType: 'password'
        }
    },
    methods: {
        passwordVisibility() {
            this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
        },
        verifyAccount() {
            if (this.email === 'demo@gunnerclark.dev' && this.password === 'Password123') {
                store.state.loggedIn = true;
                this.$router.push('/')
            } else {
                alert("Use the provided account information >:3")
            }
        }
    }
}
</script>

<style scoped>
.component-catch {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(37, 37, 65);
}

.title {
    text-align: center;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 48px;
    color: white;
}

.input-catch {
    width: 35vw;
    display: block;
}

.input-catch input,
.input-catch button {
    width: 35vw;
    background: rgba(0, 0, 0, 0.125);
    color: white;
    font-size: 20px;
    border: none;
    border-radius: 10px;
    padding: 20px;
    margin: 5px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.input-catch button {
    cursor: pointer;
    background: rgb(255, 174, 0);
}

.input-catch button:hover {
    background: white;
    color: rgb(255, 174, 0);
}

.password {
    display: inline-flex;
    width: calc(35vw + 10px);
}

.password input {
    width: 30vw;
    margin-right: 0px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
}

.password button {
    width: 5vw;
    margin-left: 0px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.125);
    color: rgba(255, 255, 255, 0.25);
}

.password button:hover {
    background: rgba(0, 0, 0, 0.125);
    color: rgb(255, 255, 255);
}

.register {
    text-align: center;
    width: 35vw;
    color: white;
    font-size: 18px;
    margin: 5px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
		'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.register a {
    color: white;
    font-weight: bold;
    text-decoration: none;
}

.register a:hover {
    color: rgb(255, 174, 0)
}

/* tablets and other mobile devices will use the same formatting for the sake of consistency */
@media only screen and (max-width: 1024px) {
    .input-catch {
        width: 75vw;
    }

    .input-catch input,
    .input-catch button {
        width: 75vw;
    }

    .password {
        width: calc(75vw + 10px);
    }

    .password input {
        width: 65vw;
    }

    .password button {
        width: 10vw;
    }

    .register {
        width: 75vw;
    }
}

</style>