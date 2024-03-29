<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getOngoingOrders, updateCommandStatus } from '../functions/api';

const orders = ref<any[]>([]);
const selectedOrder = ref<any>(null);

//Fetch all the orders and send them to the template
const fetchOrders = () => {
    getOngoingOrders(localStorage.getItem('user-token')).then((response) => {
        orders.value = response['hydra:member'];
    });
};

let intervalId: number;

onMounted(() => {
    fetchOrders();
    intervalId = setInterval(fetchOrders, 35000);
});

onUnmounted(() => {
    clearInterval(intervalId);
});

//Change the command status with the updateCommandStatus function and call the fetchOrders function
const changeCommandStatus = async (id: number, newState: string) => {
    updateCommandStatus(id, localStorage.getItem('user-token'), newState).then((response) => {
        console.log(response);

        fetchOrders();
    });
};

// Open modal function
function openModal(order: any) {
    selectedOrder.value = order;
    const modal = document.getElementById("myModal");
    if (modal) {
        modal.style.display = "block";
    }
}

// Close modal function
function closeModal() {
    const modal = document.getElementById("myModal");
    if (modal) {
        modal.style.display = "none";
    }
}


const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('fr-FR').format(date);
};

const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    }).format(date);
};


console.log(orders);
</script>


<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <h2 class="text-center mb-4">Commandes en Cours</h2>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Référence</th>
                                <th scope="col">Client</th>
                                <th scope="col">Produits</th>
                                <th scope="col">Date de Commande</th>
                                <th scope="col">Heure de Retrait Souhaitée</th>
                                <th scope="col">Prix Total</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody v-for="order in orders" :key="order.id">
                            <tr>
                                <th scope="row">{{ order.reference }}</th>
                                <td>{{ order.customerFirstName }} {{ order.customerName }}</td>
                                <td><a href="#" @click="openModal(order)">Voir les produits</a></td>
                                <td>{{ formatDate(order.dateOrder.timestamp) }}</td>
                                <td>{{ formatDateTime(order.desiredPickupDateTime.timestamp) }}</td>
                                <td>{{ order.fullPrice }} €</td>
                                <td>
                                    <span v-if="order.isPending" class="badge bg-warning">En attente</span>
                                    <span v-else-if="order.isNotServer" class="badge bg-danger">Non-récupéré</span>
                                    <span v-else-if="order.isServed" class="badge bg-success">Récupéré</span>
                                    <span v-else class="badge bg-info">En cours de préparation</span>
                                </td>
                                <td v-if="!order.isPending && !order.isNotServer && !order.isServed">
                                    <button class="btn btn-success"
                                        @click="changeCommandStatus(order.id, 'prepared')">Marquer comme Préparée</button>
                                </td>
                                <td v-else-if="order.isNotServer || order.isServed">

                                </td>
                                <td v-else>
                                    <button class="btn btn-success" @click="changeCommandStatus(order.id, 'served')">Marquer
                                        comme récupéré</button>
                                    <button class="btn btn-danger"
                                        @click="changeCommandStatus(order.id, 'not_served')">Marquer comme
                                        non-récupéré</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div id="myModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <ul v-if="selectedOrder">
                <li v-for="archive in selectedOrder.archives" :key="archive.id">
                    {{ archive.productName }} - Quantité: {{ archive.productQuantity }}
                </li>
            </ul>
        </div>
    </div>
</template>
