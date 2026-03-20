<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { ProductService } from '@sakai/services/ProductService';

onMounted(() => {
  ProductService.getProducts().then((data) => (products.value = data));
});

const toast = useToast();
const dt = ref();
const products = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref([
  { label: 'INSTOCK', value: 'instock' },
  { label: 'LOWSTOCK', value: 'lowstock' },
  { label: 'OUTOFSTOCK', value: 'outofstock' },
]);

function formatCurrency(value) {
  if (value)
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  return;
}

function openNew() {
  product.value = {};
  submitted.value = false;
  productDialog.value = true;
}

function hideDialog() {
  productDialog.value = false;
  submitted.value = false;
}

function saveProduct() {
  submitted.value = true;

  if (product?.value.name?.trim()) {
    if (product.value.id) {
      product.value.inventoryStatus = product.value.inventoryStatus.value
        ? product.value.inventoryStatus.value
        : product.value.inventoryStatus;
      products.value[findIndexById(product.value.id)] = product.value;
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Product Updated',
        life: 3000,
      });
    } else {
      product.value.id = createId();
      product.value.code = createId();
      product.value.image = 'product-placeholder.svg';
      product.value.inventoryStatus = product.value.inventoryStatus
        ? product.value.inventoryStatus.value
        : 'INSTOCK';
      products.value.push(product.value);
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Product Created',
        life: 3000,
      });
    }

    productDialog.value = false;
    product.value = {};
  }
}

function editProduct(prod) {
  product.value = { ...prod };
  productDialog.value = true;
}

function confirmDeleteProduct(prod) {
  product.value = prod;
  deleteProductDialog.value = true;
}

function deleteProduct() {
  products.value = products.value.filter((val) => val.id !== product.value.id);
  deleteProductDialog.value = false;
  product.value = {};
  toast.add({
    severity: 'success',
    summary: 'Successful',
    detail: 'Product Deleted',
    life: 3000,
  });
}

function findIndexById(id) {
  let index = -1;
  for (let i = 0; i < products.value.length; i++) {
    if (products.value[i].id === id) {
      index = i;
      break;
    }
  }

  return index;
}

function createId() {
  let id = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function exportCSV() {
  dt.value.exportCSV();
}

function confirmDeleteSelected() {
  deleteProductsDialog.value = true;
}

function deleteSelectedProducts() {
  products.value = products.value.filter(
    (val) => !selectedProducts.value.includes(val),
  );
  deleteProductsDialog.value = false;
  selectedProducts.value = null;
  toast.add({
    severity: 'success',
    summary: 'Successful',
    detail: 'Products Deleted',
    life: 3000,
  });
}

function getStatusLabel(status) {
  switch (status) {
    case 'INSTOCK':
      return 'success';

    case 'LOWSTOCK':
      return 'warn';

    case 'OUTOFSTOCK':
      return 'danger';

    default:
      return null;
  }
}
</script>

<template>
  <div>
    <div class="card">
      <PrimeToolbar class="mb-6">
        <template #start>
          <PrimeButton
            label="New"
            icon="pi pi-plus"
            severity="secondary"
            class="mr-2"
            @click="openNew"
          />
          <PrimeButton
            label="Delete"
            icon="pi pi-trash"
            severity="secondary"
            @click="confirmDeleteSelected"
            :disabled="!selectedProducts || !selectedProducts.length"
          />
        </template>

        <template #end>
          <PrimeButton
            label="Export"
            icon="pi pi-upload"
            severity="secondary"
            @click="exportCSV($event)"
          />
        </template>
      </PrimeToolbar>

      <PrimeDataTable
        ref="dt"
        v-model:selection="selectedProducts"
        :value="products"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h4 class="m-0">Manage Products</h4>
            <PrimeIconField>
              <PrimeInputIcon>
                <i class="pi pi-search" />
              </PrimeInputIcon>
              <PrimeInputText
                v-model="filters['global'].value"
                placeholder="Search..."
              />
            </PrimeIconField>
          </div>
        </template>

        <PrimeColumn
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        ></PrimeColumn>
        <PrimeColumn
          field="code"
          header="Code"
          sortable
          style="min-width: 12rem"
        ></PrimeColumn>
        <PrimeColumn
          field="name"
          header="Name"
          sortable
          style="min-width: 16rem"
        ></PrimeColumn>
        <PrimeColumn header="Image">
          <template #body="slotProps">
            <img
              :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
              :alt="slotProps.data.image"
              class="rounded"
              style="width: 64px"
            />
          </template>
        </PrimeColumn>
        <PrimeColumn field="price" header="Price" sortable style="min-width: 8rem">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.price) }}
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="category"
          header="Category"
          sortable
          style="min-width: 10rem"
        ></PrimeColumn>
        <PrimeColumn
          field="rating"
          header="Reviews"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            <PrimeRating :modelValue="slotProps.data.rating" :readonly="true" />
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="inventoryStatus"
          header="Status"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            <PrimeTag
              :value="slotProps.data.inventoryStatus"
              :severity="getStatusLabel(slotProps.data.inventoryStatus)"
            />
          </template>
        </PrimeColumn>
        <PrimeColumn :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <PrimeButton
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editProduct(slotProps.data)"
            />
            <PrimeButton
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteProduct(slotProps.data)"
            />
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <PrimeDialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Product Details"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <img
          v-if="product.image"
          :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`"
          :alt="product.image"
          class="m-auto block pb-4"
        />
        <div>
          <label for="name" class="mb-3 block font-bold">Name</label>
          <PrimeInputText
            id="name"
            v-model.trim="product.name"
            required="true"
            autofocus
            :invalid="submitted && !product.name"
            fluid
          />
          <small v-if="submitted && !product.name" class="text-red-500"
            >Name is required.</small
          >
        </div>
        <div>
          <label for="description" class="mb-3 block font-bold"
            >Description</label
          >
          <PrimeTextarea
            id="description"
            v-model="product.description"
            required="true"
            rows="3"
            cols="20"
            fluid
          />
        </div>
        <div>
          <label for="inventoryStatus" class="mb-3 block font-bold"
            >Inventory Status</label
          >
          <PrimeSelect
            id="inventoryStatus"
            v-model="product.inventoryStatus"
            :options="statuses"
            optionLabel="label"
            placeholder="Select a Status"
            fluid
          ></PrimeSelect>
        </div>

        <div>
          <span class="mb-4 block font-bold">Category</span>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6 flex items-center gap-2">
              <PrimeRadioButton
                id="category1"
                v-model="product.category"
                name="category"
                value="Accessories"
              />
              <label for="category1">Accessories</label>
            </div>
            <div class="col-span-6 flex items-center gap-2">
              <PrimeRadioButton
                id="category2"
                v-model="product.category"
                name="category"
                value="Clothing"
              />
              <label for="category2">Clothing</label>
            </div>
            <div class="col-span-6 flex items-center gap-2">
              <PrimeRadioButton
                id="category3"
                v-model="product.category"
                name="category"
                value="Electronics"
              />
              <label for="category3">Electronics</label>
            </div>
            <div class="col-span-6 flex items-center gap-2">
              <PrimeRadioButton
                id="category4"
                v-model="product.category"
                name="category"
                value="Fitness"
              />
              <label for="category4">Fitness</label>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6">
            <label for="price" class="mb-3 block font-bold">Price</label>
            <PrimeInputNumber
              id="price"
              v-model="product.price"
              mode="currency"
              currency="USD"
              locale="en-US"
              fluid
            />
          </div>
          <div class="col-span-6">
            <label for="quantity" class="mb-3 block font-bold">Quantity</label>
            <PrimeInputNumber
              id="quantity"
              v-model="product.quantity"
              integeronly
              fluid
            />
          </div>
        </div>
      </div>

      <template #footer>
        <PrimeButton label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <PrimeButton label="Save" icon="pi pi-check" @click="saveProduct" />
      </template>
    </PrimeDialog>

    <PrimeDialog
      v-model:visible="deleteProductDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-3xl!" />
        <span v-if="product"
          >Are you sure you want to delete <b>{{ product.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <PrimeButton
          label="No"
          icon="pi pi-times"
          text
          @click="deleteProductDialog = false"
        />
        <PrimeButton label="Yes" icon="pi pi-check" @click="deleteProduct" />
      </template>
    </PrimeDialog>

    <PrimeDialog
      v-model:visible="deleteProductsDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-3xl!" />
        <span v-if="product"
          >Are you sure you want to delete the selected products?</span
        >
      </div>
      <template #footer>
        <PrimeButton
          label="No"
          icon="pi pi-times"
          text
          @click="deleteProductsDialog = false"
        />
        <PrimeButton
          label="Yes"
          icon="pi pi-check"
          text
          @click="deleteSelectedProducts"
        />
      </template>
    </PrimeDialog>
  </div>
</template>
