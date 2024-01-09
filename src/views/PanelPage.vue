<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getOngoingOrders, updateCommandStatus } from '../functions/api';

const orders = ref<any[]>([]);

const fetchOrders = () => {
    getOngoingOrders(localStorage.getItem('user-token')).then((response) => {
        orders.value = response['hydra:member'];
    });
};

let intervalId: number;

onMounted(() => {
    fetchOrders();
    intervalId = setInterval(fetchOrders, 5000);
});

onUnmounted(() => {
    clearInterval(intervalId);
});

const changeCommandStatus = async (id: number, newState: string) => {
    updateCommandStatus(id, localStorage.getItem('user-token'), newState).then((response) => {
        console.log(response);
        
        fetchOrders();
    });
};


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
                                <th scope="col">#</th>
                                <th scope="col">Client</th>
                                <th scope="col">Adresse</th>
                                <th scope="col">Date de Commande</th>
                                <th scope="col">Heure de Retrait Souhaitée</th>
                                <th scope="col">Prix Total</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody v-for="order in orders" :key="order.id">
                            <tr>
                                <th scope="row">{{ order.id }}</th>
                                <td>{{ order.customerFirstName }} {{ order.customerName }}</td>
                                <td>{{ order.customerAdress }}, {{ order.customerTown }}</td>
                                <td>{{ formatDate(order.dateOrder.timestamp) }}</td>
                                <td>{{ formatDateTime(order.desiredPickupDateTime.timestamp) }}</td>
                                <td>{{ order.fullPrice }}</td>
                                <td v-if="!order.isPending && !order.isNotServer">
                                    <button class="btn btn-success"
                                        @click="changeCommandStatus(order.id, 'prepared')">Commande Préparée</button>
                                </td>
                                <td v-else-if="order.isNotServer">

                                </td>
                                <td v-else>
                                    <button class="btn btn-success"
                                        @click="changeCommandStatus(order.id, 'served')">Commande récupéré</button>
                                    <button class="btn btn-danger"
                                        @click="changeCommandStatus(order.id, 'not_served')">Commande non-récupéré</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div></template>
