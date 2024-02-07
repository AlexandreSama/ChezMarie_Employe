<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../functions/api'; // Make sure the path matches where your login function is defined

const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);
const router = useRouter();

async function handleLogin() {
    isLoading.value = true;
    try {
        const response = await login(email.value, password.value);
        console.log("Logged in! Token:", response.data.token); // Adjust based on actual response structure

        // Store the token and redirect the user
        localStorage.setItem('user-token', response.data.token); // Ensure this matches your token structure
        localStorage.setItem('user-email', email.value);
        router.push('/panel');
    } catch (err) {
        console.error("Error during login:", err);
        error.value = "Login failed. Please check your credentials.";
    } finally {
        isLoading.value = false;
    }
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
                            <div v-if="error" class="alert alert-danger">{{ error }}</div>
                            <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
                                Se connecter
                            </button>
                            <div v-if="isLoading" class="text-center">
                                <span>Loading...</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>