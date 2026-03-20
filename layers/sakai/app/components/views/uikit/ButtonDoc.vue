<script setup>
const items = ref([
  {
    label: 'Update',
    icon: 'pi pi-refresh',
  },
  {
    label: 'Delete',
    icon: 'pi pi-times',
  },
  {
    separator: true,
  },
  {
    label: 'Home',
    icon: 'pi pi-home',
  },
]);

const loading = ref([false, false, false]);

function load(index) {
  loading.value[index] = true;
  setTimeout(() => (loading.value[index] = false), 1000);
}
</script>

<template>
  <div class="flex flex-col gap-8 md:flex-row">
    <div class="md:w-1/2">
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Default</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButton label="Submit"></PrimeButton>
          <PrimeButton label="Disabled" :disabled="true"></PrimeButton>
          <PrimeButton label="Link" class="p-button-link" />
        </div>
      </div>
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Severities</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButton label="Primary" />
          <PrimeButton label="Secondary" severity="secondary" />
          <PrimeButton label="Success" severity="success" />
          <PrimeButton label="Info" severity="info" />
          <PrimeButton label="Warn" severity="warn" />
          <PrimeButton label="Help" severity="help" />
          <PrimeButton label="Danger" severity="danger" />
          <PrimeButton label="Contrast" severity="contrast" />
        </div>
      </div>
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Text</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButton label="Primary" text />
          <PrimeButton label="Secondary" severity="secondary" text />
          <PrimeButton label="Success" severity="success" text />
          <PrimeButton label="Info" severity="info" text />
          <PrimeButton label="Warn" severity="warn" text />
          <PrimeButton label="Help" severity="help" text />
          <PrimeButton label="Danger" severity="danger" text />
          <PrimeButton label="Plain" plain text />
        </div>
      </div>
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Outlined</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButton label="Primary" outlined />
          <PrimeButton label="Secondary" severity="secondary" outlined />
          <PrimeButton label="Success" severity="success" outlined />
          <PrimeButton label="Info" severity="info" outlined />
          <PrimeButton label="warn" severity="warn" outlined />
          <PrimeButton label="Help" severity="help" outlined />
          <PrimeButton label="Danger" severity="danger" outlined />
          <PrimeButton label="Contrast" severity="contrast" outlined />
        </div>
      </div>
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Group</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButtonGroup>
            <PrimeButton label="Save" icon="pi pi-check" />
            <PrimeButton label="Delete" icon="pi pi-trash" />
            <PrimeButton label="Cancel" icon="pi pi-times" />
          </PrimeButtonGroup>
        </div>
      </div>
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">SplitButton</div>
        <div class="flex flex-wrap gap-2">
          <PrimeSplitButton label="Save" :model="items"></PrimeSplitButton>
          <PrimeSplitButton
            label="Save"
            :model="items"
            severity="secondary"
          ></PrimeSplitButton>
          <PrimeSplitButton
            label="Save"
            :model="items"
            severity="success"
          ></PrimeSplitButton>
          <PrimeSplitButton
            label="Save"
            :model="items"
            severity="info"
          ></PrimeSplitButton>
          <PrimeSplitButton
            label="Save"
            :model="items"
            severity="warn"
          ></PrimeSplitButton>
          <PrimeSplitButton
            label="Save"
            :model="items"
            severity="help"
          ></PrimeSplitButton>
          <PrimeSplitButton
            label="Save"
            :model="items"
            severity="danger"
          ></PrimeSplitButton>
          <PrimeSplitButton
            label="Save"
            :model="items"
            severity="contrast"
          ></PrimeSplitButton>
        </div>
      </div>
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Templating</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButton type="button">
            <img
              alt="logo"
              src="/demo/images/logo-white.svg"
              style="width: 1.5rem"
            />
          </PrimeButton>
          <PrimeButton type="button" outlined severity="success">
            <img alt="logo" src="/demo/images/logo.svg" style="width: 1.5rem" />
            <span class="text-bold ml-2">PrimeVue</span>
          </PrimeButton>
        </div>
      </div>
    </div>
    <div class="md:w-1/2">
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Icons</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButton icon="pi pi-star-fill" class="mb-2 mr-2"></PrimeButton>
          <PrimeButton
            label="Bookmark"
            icon="pi pi-bookmark"
            class="mb-2 mr-2"
          ></PrimeButton>
          <PrimeButton
            label="Bookmark"
            icon="pi pi-bookmark"
            iconPos="right"
            class="mb-2 mr-2"
          ></PrimeButton>
        </div>
      </div>
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Raised</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButton label="Primary" raised />
          <PrimeButton label="Secondary" severity="secondary" raised />
          <PrimeButton label="Success" severity="success" raised />
          <PrimeButton label="Info" severity="info" raised />
          <PrimeButton label="Warn" severity="warn" raised />
          <PrimeButton label="Help" severity="help" raised />
          <PrimeButton label="Danger" severity="danger" raised />
          <PrimeButton label="Contrast" severity="contrast" raised />
        </div>
      </div>
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Rounded</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButton label="Primary" rounded />
          <PrimeButton label="Secondary" severity="secondary" rounded />
          <PrimeButton label="Success" severity="success" rounded />
          <PrimeButton label="Info" severity="info" rounded />
          <PrimeButton label="Warn" severity="warn" rounded />
          <PrimeButton label="Help" severity="help" rounded />
          <PrimeButton label="Danger" severity="danger" rounded />
          <PrimeButton label="Contrast" severity="contrast" rounded />
        </div>
      </div>
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Rounded Icons</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButton icon="pi pi-check" rounded />
          <PrimeButton icon="pi pi-bookmark" severity="secondary" rounded />
          <PrimeButton icon="pi pi-search" severity="success" rounded />
          <PrimeButton icon="pi pi-user" severity="info" rounded />
          <PrimeButton icon="pi pi-bell" severity="warn" rounded />
          <PrimeButton icon="pi pi-heart" severity="help" rounded />
          <PrimeButton icon="pi pi-times" severity="danger" rounded />
        </div>
      </div>
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Rounded Text</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButton icon="pi pi-check" text raised rounded />
          <PrimeButton
            icon="pi pi-bookmark"
            severity="secondary"
            text
            raised
            rounded
          />
          <PrimeButton icon="pi pi-search" severity="success" text raised rounded />
          <PrimeButton icon="pi pi-user" severity="info" text raised rounded />
          <PrimeButton icon="pi pi-bell" severity="warn" text raised rounded />
          <PrimeButton icon="pi pi-heart" severity="help" text raised rounded />
          <PrimeButton icon="pi pi-times" severity="danger" text raised rounded />
        </div>
      </div>
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Rounded Outlined</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButton icon="pi pi-check" rounded outlined />
          <PrimeButton icon="pi pi-bookmark" severity="secondary" rounded outlined />
          <PrimeButton icon="pi pi-search" severity="success" rounded outlined />
          <PrimeButton icon="pi pi-user" severity="info" rounded outlined />
          <PrimeButton icon="pi pi-bell" severity="warn" rounded outlined />
          <PrimeButton icon="pi pi-heart" severity="help" rounded outlined />
          <PrimeButton icon="pi pi-times" severity="danger" rounded outlined />
        </div>
      </div>
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Loading</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButton
            type="button"
            class="mb-2 mr-2"
            label="Search"
            icon="pi pi-search"
            :loading="loading[0]"
            @click="load(0)"
          />
          <PrimeButton
            type="button"
            class="mb-2 mr-2"
            label="Search"
            icon="pi pi-search"
            iconPos="right"
            :loading="loading[1]"
            @click="load(1)"
          />
          <PrimeButton
            type="button"
            class="mb-2 mr-2"
            icon="pi pi-search"
            :loading="loading[2]"
            @click="load(2)"
          />
          <PrimeButton
            type="button"
            class="mb-2 mr-2"
            label="Search"
            :loading="loading[3]"
            @click="load(3)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
