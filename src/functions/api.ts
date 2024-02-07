import axios from 'axios';

/**
 * The login function sends a POST request to a login endpoint with the provided username and password,
 * and returns the JWT token from the response.
 * @param {string} username - The `username` parameter is a string that represents the username of the
 * user trying to log in. It is used to identify the user during the login process.
 * @param {string} password - The `password` parameter is a string that represents the user's password.
 * It is used as part of the login process to authenticate the user.
 * @returns the response object from the API request.
 */
export async function login(username: string, password: string) {
    try {

        let data = JSON.stringify({
            "username": username,
            "password": password
        });

        let config = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: 'https://localhost:8000/api/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios.request(config);

        return response;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error;
    }
}

/**
    La fonction getOngoingOrders effectue une requête HTTP GET asynchrone pour récupérer les commandes en cours
    à partir d'une URL d'API spécifiée, en utilisant un jeton d'authentification fourni pour l'autorisation.
    @param {string | null} token - Le paramètre token est une chaîne de caractères représentant le jeton
    d'authentification utilisé pour autoriser la requête. Il est inclus dans l'en-tête Authorization en tant
    que jeton porteur.
    @returns les données reçues de l'appel à l'API pour obtenir les commandes en cours.
    
*/
export async function getOngoingOrders(token: string | null) {
    try {
        const response = await axios.get('https://localhost:8000/api/orders', {
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

/**
    La fonction updateCommandStatus est une fonction asynchrone qui met à jour le statut d'une commande
    en fonction de l'ID de commande, du jeton et du nouveau statut fournis.
    @param {number} orderID - Le paramètre orderID est l'identifiant unique de la commande à mettre à
    jour. Il est de type nombre.
    @param {string | null} token - Le paramètre token est une chaîne de caractères représentant le jeton
    d'authentification nécessaire pour accéder à l'API. Il est utilisé dans l'en-tête Authorization de
    la requête HTTP pour authentifier l'utilisateur effectuant la requête. Si le jeton est null, cela
    signifie que l'utilisateur n'est pas authentifié et la requête sera refusée.
    @param {string} newState - Le paramètre newState est une chaîne de caractères représentant le nouveau
    statut de la commande. Il peut avoir l'une des valeurs suivantes :
    @returns les données de la réponse HTTP après l'envoi de la requête PATCH pour mettre à jour le statut
    de la commande.
*/
export async function updateCommandStatus(orderID: number, token: string | null, newState: string) {
    try {
        let response;
        switch (newState) {
            case 'prepared':
                // Envoyer une requête PATCH pour marquer la commande comme préparée
                response = await axios.patch(`https://localhost:8000/api/orders/${orderID}`, {
                    is_preparing: false,
                    is_pending: true
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/merge-patch+json'
                    }
                });
                // Retourner les données de la réponse HTTP
                return response.data;
            case 'pending':
                // Envoyer une requête PATCH pour marquer la commande comme en attente
                response = await axios.patch(`https://localhost:8000/api/orders/${orderID}`, {
                    is_pending: false,
                    is_served: true
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/merge-patch+json'
                    }
                });
                // Retourner les données de la réponse HTTP
                return response.data;
            case 'not_served':
                // Envoyer une requête PATCH pour marquer la commande comme non servie
                response = await axios.patch(`https://localhost:8000/api/orders/${orderID}`, {
                    is_pending: false,
                    is_not_served: true
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/merge-patch+json'
                    }
                });
                // Retourner les données de la réponse HTTP
                return response.data;
            case 'served':
                // Envoyer une requête PATCH pour marquer la commande comme servie
                response = await axios.patch(`https://localhost:8000/api/orders/${orderID}`, {
                    is_served: true,
                    is_pending: false
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/merge-patch+json'
                    }
                });
                // Retourner les données de la réponse HTTP
                return response.data;
            default:
                break;
        }
    } catch (error) {
        // Gérer les erreurs en affichant un message d'erreur dans la console
        console.error("An error occurred during commandPrepared:", error);
        // Lancer à nouveau l'erreur pour que le code appelant puisse la gérer
        throw error;
    }
}