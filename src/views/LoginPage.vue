<script setup lang="ts">
import { ref } from 'vue';
import { login } from '../functions/api';
import router from '../router';
import axios from 'axios';

const email = ref('');
const password = ref('');

async function handleLogin() {
    try {
        const response = await login(email.value, password.value);

        // Stocker le token et rediriger l'utilisateur
        localStorage.setItem('user-token', response.data.token);
        localStorage.setItem('user-email', response.data.user);
        goToPanel();
    } catch (error: unknown) {
        console.error("Error during login:", error);
        
        // Vérifier si l'erreur est une instance d'une erreur Axios
        if (axios.isAxiosError(error)) {
            // Maintenant, TypeScript sait que `error` est une erreur Axios
            const message = error.response?.data?.message || error.message;
            // Afficher le message d'erreur à l'utilisateur
            alert(message);
        } else {
            // Si ce n'est pas une erreur Axios, c'est une autre sorte d'erreur
            alert("Une erreur inconnue est survenue.");
        }
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
