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
 * The function `getOngoingOrders` makes an asynchronous HTTP GET request to retrieve ongoing orders
 * from a specified API endpoint, using a provided token for authorization.
 * @param {string | null} token - The `token` parameter is a string that represents the authentication
 * token used to authorize the request. It is passed in the `Authorization` header as a bearer token.
 * @returns the data received from the API call to get ongoing orders.
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
 * The `updateCommandStatus` function is used to update the status of an order by making a PATCH
 * request to the server with the new state.
 * @param {number} orderID - The `orderID` parameter is the ID of the order that needs to be updated.
 * It is of type `number`.
 * @param {string | null} token - The `token` parameter is a string that represents the authentication
 * token required to access the API. It is used in the `Authorization` header of the HTTP request to
 * authenticate the user making the request. If the token is `null`, it means that the user is not
 * authenticated and the request will not
 * @param {string} newState - The `newState` parameter is a string that represents the new state of the
 * command. It can have one of the following values:
 * @returns the data from the response of the axios patch request.
 */
export async function updateCommandStatus(orderID: number, token: string | null, newState: string) {

    try {
        let response;
        switch (newState) {
            case 'prepared':
                response = await axios.patch(`https://localhost:8000/api/orders/${orderID}`, {
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
                response = await axios.patch(`https://localhost:8000/api/orders/${orderID}`, {
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
                response = await axios.patch(`https://localhost:8000/api/orders/${orderID}`, {
                    is_pending: false,
                    is_not_server: true
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/merge-patch+json'
                    }
                });
                return response.data;
            case 'served':
                response = await axios.patch(`https://localhost:8000/api/orders/${orderID}`, {
                    is_served: true,
                    is_pending: false
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