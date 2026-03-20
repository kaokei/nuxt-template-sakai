<script setup>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { CustomerService } from '@sakai/services/CustomerService';
import { ProductService } from '@sakai/services/ProductService';

const customers1 = ref(null);
const customers2 = ref(null);
const customers3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const balanceFrozen = ref(false);
const products = ref(null);
const expandedRows = ref([]);
const statuses = reactive([
  'unqualified',
  'qualified',
  'new',
  'negotiation',
  'renewal',
  'proposal',
]);
const representatives = reactive([
  { name: 'Amy Elsner', image: 'amyelsner.png' },
  { name: 'Anna Fali', image: 'annafali.png' },
  { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
  { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
  { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
  { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
  { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
  { name: 'Onyama Limba', image: 'onyamalimba.png' },
  { name: 'Stephen Shaw', image: 'stephenshaw.png' },
  { name: 'XuXue Feng', image: 'xuxuefeng.png' },
]);

function getOrderSeverity(order) {
  switch (order.status) {
    case 'DELIVERED':
      return 'success';

    case 'CANCELLED':
      return 'danger';

    case 'PENDING':
      return 'warn';

    case 'RETURNED':
      return 'info';

    default:
      return null;
  }
}

function getSeverity(status) {
  switch (status) {
    case 'unqualified':
      return 'danger';

    case 'qualified':
      return 'success';

    case 'new':
      return 'info';

    case 'negotiation':
      return 'warn';

    case 'renewal':
      return null;
  }
}

function getStockSeverity(product) {
  switch (product.inventoryStatus) {
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

onBeforeMount(() => {
  ProductService.getProductsWithOrdersSmall().then(
    (data) => (products.value = data),
  );
  CustomerService.getCustomersLarge().then((data) => {
    customers1.value = data;
    loading1.value = false;
    customers1.value.forEach(
      (customer) => (customer.date = new Date(customer.date)),
    );
  });
  CustomerService.getCustomersLarge().then((data) => (customers2.value = data));
  CustomerService.getCustomersMedium().then(
    (data) => (customers3.value = data),
  );

  initFilters1();
});

function initFilters1() {
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    'country.name': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    balance: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  };
}

function expandAll() {
  expandedRows.value = products.value.reduce(
    (acc, p) => (acc[p.id] = true) && acc,
    {},
  );
}

function collapseAll() {
  expandedRows.value = null;
}

function formatCurrency(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDate(value) {
  return value.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function calculateCustomerTotal(name) {
  let total = 0;
  if (customers3.value) {
    for (let customer of customers3.value) {
      if (customer.representative.name === name) {
        total++;
      }
    }
  }

  return total;
}
</script>

<template>
  <div class="card">
    <div class="mb-4 text-xl font-semibold">Filtering</div>
    <PrimeDataTable
      :value="customers1"
      :paginator="true"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      v-model:filters="filters1"
      filterDisplay="menu"
      :loading="loading1"
      :filters="filters1"
      :globalFilterFields="[
        'name',
        'country.name',
        'representative.name',
        'balance',
        'status',
      ]"
      showGridlines
    >
      <template #header>
        <div class="flex justify-between">
          <PrimeButton
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            @click="clearFilter()"
          />
          <PrimeIconField>
            <PrimeInputIcon>
              <i class="pi pi-search" />
            </PrimeInputIcon>
            <PrimeInputText
              v-model="filters1['global'].value"
              placeholder="Keyword Search"
            />
          </PrimeIconField>
        </div>
      </template>
      <template #empty> No customers found. </template>
      <template #loading> Loading customers data. Please wait. </template>
      <PrimeColumn field="name" header="Name" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.name }}
        </template>
        <template #filter="{ filterModel }">
          <PrimeInputText
            v-model="filterModel.value"
            type="text"
            placeholder="Search by name"
          />
        </template>
      </PrimeColumn>
      <PrimeColumn
        header="Country"
        filterField="country.name"
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <img
              alt="flag"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`flag flag-${data.country.code}`"
              style="width: 24px"
            />
            <span>{{ data.country.name }}</span>
          </div>
        </template>
        <template #filter="{ filterModel }">
          <PrimeInputText
            v-model="filterModel.value"
            type="text"
            placeholder="Search by country"
          />
        </template>
        <template #filterclear="{ filterCallback }">
          <PrimeButton
            type="button"
            icon="pi pi-times"
            @click="filterCallback()"
            severity="secondary"
          ></PrimeButton>
        </template>
        <template #filterapply="{ filterCallback }">
          <PrimeButton
            type="button"
            icon="pi pi-check"
            @click="filterCallback()"
            severity="success"
          ></PrimeButton>
        </template>
      </PrimeColumn>
      <PrimeColumn
        header="Agent"
        filterField="representative"
        :showFilterMatchModes="false"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <img
              :alt="data.representative.name"
              :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`"
              style="width: 32px"
            />
            <span>{{ data.representative.name }}</span>
          </div>
        </template>
        <template #filter="{ filterModel }">
          <PrimeMultiSelect
            v-model="filterModel.value"
            :options="representatives"
            optionLabel="name"
            placeholder="Any"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <img
                  :alt="slotProps.option.name"
                  :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.image}`"
                  style="width: 32px"
                />
                <span>{{ slotProps.option.name }}</span>
              </div>
            </template>
          </PrimeMultiSelect>
        </template>
      </PrimeColumn>
      <PrimeColumn
        header="Date"
        filterField="date"
        dataType="date"
        style="min-width: 10rem"
      >
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
        <template #filter="{ filterModel }">
          <PrimeDatePicker
            v-model="filterModel.value"
            dateFormat="mm/dd/yy"
            placeholder="mm/dd/yyyy"
          />
        </template>
      </PrimeColumn>
      <PrimeColumn
        header="Balance"
        filterField="balance"
        dataType="numeric"
        style="min-width: 10rem"
      >
        <template #body="{ data }">
          {{ formatCurrency(data.balance) }}
        </template>
        <template #filter="{ filterModel }">
          <PrimeInputNumber
            v-model="filterModel.value"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </template>
      </PrimeColumn>
      <PrimeColumn
        header="Status"
        field="status"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          <PrimeTag :value="data.status" :severity="getSeverity(data.status)" />
        </template>
        <template #filter="{ filterModel }">
          <PrimeSelect
            v-model="filterModel.value"
            :options="statuses"
            placeholder="Select One"
            showClear
          >
            <template #option="slotProps">
              <PrimeTag
                :value="slotProps.option"
                :severity="getSeverity(slotProps.option)"
              />
            </template>
          </PrimeSelect>
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="activity"
        header="Activity"
        :showFilterMatchModes="false"
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          <PrimeProgressBar
            :value="data.activity"
            :showValue="false"
            style="height: 6px"
          ></PrimeProgressBar>
        </template>
        <template #filter="{ filterModel }">
          <PrimeSlider v-model="filterModel.value" range class="m-4"></PrimeSlider>
          <div class="flex items-center justify-between px-2">
            <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
            <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
          </div>
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="verified"
        header="Verified"
        dataType="boolean"
        bodyClass="text-center"
        style="min-width: 8rem"
      >
        <template #body="{ data }">
          <i
            class="pi"
            :class="{
              'pi-check-circle text-green-500': data.verified,
              'pi-times-circle text-red-500': !data.verified,
            }"
          ></i>
        </template>
        <template #filter="{ filterModel }">
          <label for="verified-filter" class="font-bold"> Verified </label>
          <PrimeCheckbox
            v-model="filterModel.value"
            :indeterminate="filterModel.value === null"
            binary
            inputId="verified-filter"
          />
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </div>

  <div class="card">
    <div class="mb-4 text-xl font-semibold">Frozen Columns</div>
    <PrimeToggleButton
      v-model="balanceFrozen"
      onIcon="pi pi-lock"
      offIcon="pi pi-lock-open"
      onLabel="Balance"
      offLabel="Balance"
    />

    <PrimeDataTable :value="customers2" scrollable scrollHeight="400px" class="mt-6">
      <PrimeColumn
        field="name"
        header="Name"
        style="min-width: 200px"
        frozen
        class="font-bold"
      ></PrimeColumn>
      <PrimeColumn field="id" header="Id" style="min-width: 100px"></PrimeColumn>
      <PrimeColumn field="name" header="Name" style="min-width: 200px"></PrimeColumn>
      <PrimeColumn
        field="country.name"
        header="Country"
        style="min-width: 200px"
      ></PrimeColumn>
      <PrimeColumn field="date" header="Date" style="min-width: 200px"></PrimeColumn>
      <PrimeColumn
        field="company"
        header="Company"
        style="min-width: 200px"
      ></PrimeColumn>
      <PrimeColumn field="status" header="Status" style="min-width: 200px"></PrimeColumn>
      <PrimeColumn
        field="activity"
        header="Activity"
        style="min-width: 200px"
      ></PrimeColumn>
      <PrimeColumn
        field="representative.name"
        header="Representative"
        style="min-width: 200px"
      ></PrimeColumn>
      <PrimeColumn
        field="balance"
        header="Balance"
        style="min-width: 200px"
        alignFrozen="right"
        :frozen="balanceFrozen"
      >
        <template #body="{ data }">
          <span class="font-bold">{{ formatCurrency(data.balance) }}</span>
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </div>

  <div class="card">
    <div class="mb-4 text-xl font-semibold">Row Expansion</div>
    <PrimeDataTable
      v-model:expandedRows="expandedRows"
      :value="products"
      dataKey="id"
      tableStyle="min-width: 60rem"
    >
      <template #header>
        <div class="flex flex-wrap justify-end gap-2">
          <PrimeButton
            text
            icon="pi pi-plus"
            label="Expand All"
            @click="expandAll"
          />
          <PrimeButton
            text
            icon="pi pi-minus"
            label="Collapse All"
            @click="collapseAll"
          />
        </div>
      </template>
      <PrimeColumn expander style="width: 5rem" />
      <PrimeColumn field="name" header="Name"></PrimeColumn>
      <PrimeColumn header="Image">
        <template #body="slotProps">
          <img
            :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
            :alt="slotProps.data.image"
            class="shadow-lg"
            width="64"
          />
        </template>
      </PrimeColumn>
      <PrimeColumn field="price" header="Price">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.price) }}
        </template>
      </PrimeColumn>
      <PrimeColumn field="category" header="Category"></PrimeColumn>
      <PrimeColumn field="rating" header="Reviews">
        <template #body="slotProps">
          <PrimeRating :modelValue="slotProps.data.rating" readonly />
        </template>
      </PrimeColumn>
      <PrimeColumn header="Status">
        <template #body="slotProps">
          <PrimeTag
            :value="slotProps.data.inventoryStatus"
            :severity="getStockSeverity(slotProps.data)"
          />
        </template>
      </PrimeColumn>
      <template #expansion="slotProps">
        <div class="p-4">
          <h5>Orders for {{ slotProps.data.name }}</h5>
          <PrimeDataTable :value="slotProps.data.orders">
            <PrimeColumn field="id" header="Id" sortable></PrimeColumn>
            <PrimeColumn field="customer" header="Customer" sortable></PrimeColumn>
            <PrimeColumn field="date" header="Date" sortable></PrimeColumn>
            <PrimeColumn field="amount" header="Amount" sortable>
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.amount) }}
              </template>
            </PrimeColumn>
            <PrimeColumn field="status" header="Status" sortable>
              <template #body="slotProps">
                <PrimeTag
                  :value="slotProps.data.status.toLowerCase()"
                  :severity="getOrderSeverity(slotProps.data)"
                />
              </template>
            </PrimeColumn>
            <PrimeColumn headerStyle="width:4rem">
              <template #body>
                <PrimeButton icon="pi pi-search" />
              </template>
            </PrimeColumn>
          </PrimeDataTable>
        </div>
      </template>
    </PrimeDataTable>
  </div>

  <div class="card">
    <div class="mb-4 text-xl font-semibold">Grouping</div>
    <PrimeDataTable
      :value="customers3"
      rowGroupMode="subheader"
      groupRowsBy="representative.name"
      sortMode="single"
      sortField="representative.name"
      :sortOrder="1"
      scrollable
      scrollHeight="400px"
      tableStyle="min-width: 50rem"
    >
      <template #groupheader="slotProps">
        <div class="flex items-center gap-2">
          <img
            :alt="slotProps.data.representative.name"
            :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.data.representative.image}`"
            width="32"
            style="vertical-align: middle"
          />
          <span>{{ slotProps.data.representative.name }}</span>
        </div>
      </template>
      <PrimeColumn field="representative.name" header="Representative"></PrimeColumn>
      <PrimeColumn field="name" header="Name" style="min-width: 200px"></PrimeColumn>
      <PrimeColumn field="country" header="Country" style="min-width: 200px">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <img
              alt="flag"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`flag flag-${slotProps.data.country.code}`"
              style="width: 24px"
            />
            <span>{{ slotProps.data.country.name }}</span>
          </div>
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="company"
        header="Company"
        style="min-width: 200px"
      ></PrimeColumn>
      <PrimeColumn field="status" header="Status" style="min-width: 200px">
        <template #body="slotProps">
          <PrimeTag
            :value="slotProps.data.status"
            :severity="getSeverity(slotProps.data.status)"
          />
        </template>
      </PrimeColumn>
      <PrimeColumn field="date" header="Date" style="min-width: 200px"></PrimeColumn>
      <template #groupfooter="slotProps">
        <div class="flex w-full justify-end font-bold">
          Total Customers:
          {{ calculateCustomerTotal(slotProps.data.representative.name) }}
        </div>
      </template>
    </PrimeDataTable>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>
