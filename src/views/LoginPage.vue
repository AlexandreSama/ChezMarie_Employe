<script setup lang="ts">
import { ref } from 'vue';
import { login } from '../functions/api';
import router from '../router';

const email = ref('');
const password = ref('');

async function handleLogin() {
    try {
        const token = await login(email.value, password.value);
        console.log(token)
        // console.log("Logged in! Token:", token);

        // Stocker le token et rediriger l'utilisateur
        // localStorage.setItem('user-token', token);
        // goToPanel();
    } catch (error) {
        console.error("Error during login:", error);
        // Gérer les erreurs ici, comme afficher un message à l'utilisateur
    }
}

function goToPanel() {
    router.push('/panel');
}
</script>


<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-12 col-sm-10 col-md-8 col-lg-6">
                <div class="card p-4">
                    <div class="card-body">
                        <h3 class="text-center mb-3">Connexion</h3>
                        <form @submit.prevent="handleLogin">
                            <div class="mb-3">
                                <label for="email" class="form-label">Adresse Email</label>
                                <input type="email" class="form-control" id="email" v-model="email" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Mot de Passe</label>
                                <input type="password" class="form-control" id="password" v-model="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Se connecter</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
