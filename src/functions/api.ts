import axios from 'axios';

// Fonction pour se connecter
export async function login(username: string, password: string) {
    try {

        let data = JSON.stringify({
            "username": username,
            "password": password
        });

        let config = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: 'http://localhost:8000/api/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        // Envoi d'une requête POST au point de terminaison de connexion avec Axios
        const response = await axios.request(config);

        // Récupérez et retournez le token JWT de la réponse
        return response;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error;
    }
}