<script setup>
import { ProductService } from '@sakai/services/ProductService';

const products = ref(null);

function formatCurrency(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

onMounted(() => {
  ProductService.getProductsSmall().then((data) => (products.value = data));
});
</script>

<template>
  <div class="card">
    <div class="mb-4 text-xl font-semibold">Recent Sales</div>
    <PrimeDataTable
      :value="products"
      :rows="5"
      :paginator="true"
      responsiveLayout="scroll"
    >
      <PrimeColumn style="width: 15%" header="Image">
        <template #body="slotProps">
          <img
            :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
            :alt="slotProps.data.image"
            width="50"
            class="shadow"
          />
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="name"
        header="Name"
        :sortable="true"
        style="width: 35%"
      ></PrimeColumn>
      <PrimeColumn field="price" header="Price" :sortable="true" style="width: 35%">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.price) }}
        </template>
      </PrimeColumn>
      <PrimeColumn style="width: 15%" header="View">
        <template #body>
          <PrimeButton
            icon="pi pi-search"
            type="button"
            class="p-button-text"
          ></PrimeButton>
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </div>
</template>
