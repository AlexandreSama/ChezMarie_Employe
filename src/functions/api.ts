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

export async function getOngoingOrders(token: string | null) {
    try {
        const response = await axios.get('http://localhost:8000/api/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                is_preparing: true
            }
        });

        return response.data;
    } catch (error) {
        console.error("An error occurred during getOngoingOrders:", error);
        throw error;
    }
}

export async function updateCommandStatus(orderID: number, token: string | null, newState: string) {

    try {
        let response;
        switch (newState) {
            case 'prepared':
                response = await axios.patch(`http://localhost:8000/api/orders/${orderID}`, {
                    is_preparing: false,
                    is_pending: true
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/merge-patch+json'
                    }
                });

                return response.data;
            case 'pending':
                response = await axios.patch(`http://localhost:8000/api/orders/${orderID}`, {
                    is_pending: false,
                    is_served: true
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/merge-patch+json'
                    }
                });

                return response.data;
            case 'not_served':
                response = await axios.patch(`http://localhost:8000/api/orders/${orderID}`, {
                    is_pending: false,
                    is_not_server: true
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/merge-patch+json'
                    }
                });

                return response.data;
            default:
                break;
        }
    } catch (error) {
        console.error("An error occurred during commandPrepared:", error);
        throw error;
    }
}