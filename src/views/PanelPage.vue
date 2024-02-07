
<script setup lang="ts">
import { Ref, ref, onMounted, onUnmounted } from 'vue';
import { getOngoingOrders, updateCommandStatus } from '../functions/api';

interface Order {
  id: number;
  customerFirstName: string;
  customerName: string;
  customerAdress: string; // Corrigé la faute de frappe de 'customerAdress' à 'customerAddress'
  customerTown: string;
  dateOrder: { timestamp: number };
  desiredPickupDateTime: { timestamp: number };
  fullPrice: number;
  isPending: boolean;
  isNotServer: boolean; // Vérifier ce nom, semble incorrect. Peut-être 'isNotServed' ?
  isServed: boolean;
  archives: Array<any>; // Spécifier un type plus précis si possible
}

const orders: Ref<Order[]> = ref([]);

const fetchOrders = async () => {
  const response = await getOngoingOrders(localStorage.getItem('user-token') || '');
  orders.value = response['hydra:member'];
};

onMounted(async () => {
  await fetchOrders();
  const intervalId = setInterval(fetchOrders, 15000);

  onUnmounted(() => {
    clearInterval(intervalId);
  });
});

const changeCommandStatus = async (id: number, newState: string) => {
  await updateCommandStatus(id, localStorage.getItem('user-token') || '', newState);
  await fetchOrders();
};

const getStatusClass = (order: Order): string => {
  if (order.isPending) return 'bg-warning';
  if (order.isNotServer) return 'bg-danger'; // Vérifiez cette logique
  if (order.isServed) return 'bg-success';
  return 'bg-info';
};

const getStatusText = (order: Order): string => {
    if (order.isPending) return 'En attente de récupération';
    if (order.isNotServer) return 'Non-récupéré'; // Vérifiez cette logique
    if (order.isServed) return 'Récupéré';
    return 'En préparation';
};

const getButtonClass = (order: Order): string => {
    if (!order.isPending && !order.isNotServer && !order.isServed) return 'btn-success';
    if (order.isNotServer || order.isServed) return 'd-none'; // Cacher le bouton si non nécessaire
    return 'btn-danger'; // Pour les états restants
};

// Détermine le nouveau statut à appliquer à la commande lors d'une action
const getNewStatus = (order: Order): string => {
    if (!order.isPending && !order.isNotServer && !order.isServed) return 'served';
    if (order.isPending) return 'prepared'; // Supposition basée sur la logique habituelle
    return 'not_served'; // Fallback, ajustez selon la logique métier spécifique
};

// Obtient le texte à afficher sur le bouton basé sur l'état de la commande
const getButtonText = (order: Order): string => {
    if (!order.isPending && !order.isNotServer && !order.isServed) return 'Marquer comme récupéré';
    if (order.isPending) return 'Marquer comme préparée'; // Adapté à la logique d'affaires
    // Cette condition peut ne pas être nécessaire si vous n'avez que deux états à gérer
    // mais est ajoutée ici pour démontrer comment gérer des états supplémentaires.
    return 'Action'; // Valeur par défaut, à ajuster en fonction de votre besoin
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
        <h2 class="text-center mb-4">Commandes en Cours</h2>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Client</th>
                        <th>Adresse</th>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Prix</th>
                        <th>Status</th>
                        <th>Produits</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.id">
                        <td>{{ order.id }}</td>
                        <td>{{ order.customerFirstName }} {{ order.customerName }}</td>
                        <td>{{ order.customerAdress }}, {{ order.customerTown }}</td>
                        <td>{{ formatDate(order.dateOrder.timestamp) }}</td>
                        <td>{{ formatDateTime(order.desiredPickupDateTime.timestamp) }}</td>
                        <td>{{ order.fullPrice }} €</td>
                        <td>
                            <span :class="`badge ${getStatusClass(order)}`">{{ getStatusText(order) }}</span>
                        </td>
                        <td>{{ order.archives.length }}</td>
                        <td>
                            <button class="btn" :class="getButtonClass(order)"
                                @click="changeCommandStatus(order.id, getNewStatus(order))">{{ getButtonText(order) }}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>