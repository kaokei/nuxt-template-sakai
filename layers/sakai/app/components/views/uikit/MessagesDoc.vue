<script setup>
const toast = useToast();
const message = ref([]);
const username = ref(null);
const email = ref(null);

function showSuccess() {
  toast.add({
    severity: 'success',
    summary: 'Success Message',
    detail: 'Message Detail',
    life: 3000,
  });
}

function showInfo() {
  toast.add({
    severity: 'info',
    summary: 'Info Message',
    detail: 'Message Detail',
    life: 3000,
  });
}

function showWarn() {
  toast.add({
    severity: 'warn',
    summary: 'Warn Message',
    detail: 'Message Detail',
    life: 3000,
  });
}

function showError() {
  toast.add({
    severity: 'error',
    summary: 'Error Message',
    detail: 'Message Detail',
    life: 3000,
  });
}
</script>

<template>
  <div class="flex flex-col gap-8 md:flex-row">
    <div class="md:w-1/2">
      <div class="card">
        <div class="mb-4 text-xl font-semibold">Toast</div>
        <div class="flex flex-wrap gap-2">
          <PrimeButton @click="showSuccess()" label="Success" severity="success" />
          <PrimeButton @click="showInfo()" label="Info" severity="info" />
          <PrimeButton @click="showWarn()" label="Warn" severity="warn" />
          <PrimeButton @click="showError()" label="Error" severity="danger" />
        </div>

        <div class="mb-4 mt-4 text-xl font-semibold">Inline</div>
        <div class="mb-4 flex flex-wrap gap-2">
          <PrimeInputText
            v-model="username"
            placeholder="Username"
            aria-label="username"
            invalid
          />
          <PrimeMessage severity="error">Username is required</PrimeMessage>
        </div>
        <div class="flex flex-wrap gap-2">
          <PrimeInputText
            v-model="email"
            placeholder="Email"
            aria-label="email"
            invalid
          />
          <PrimeMessage severity="error" icon="pi pi-times-circle" />
        </div>
      </div>
    </div>
    <div class="md:w-1/2">
      <div class="card">
        <div class="mb-4 text-xl font-semibold">Message</div>
        <div class="mb-4 flex flex-col gap-4">
          <PrimeMessage severity="success">Success Message</PrimeMessage>
          <PrimeMessage severity="info">Info Message</PrimeMessage>
          <PrimeMessage severity="warn">Warn Message</PrimeMessage>
          <PrimeMessage severity="error">Error Message</PrimeMessage>
          <PrimeMessage severity="secondary">Secondary Message</PrimeMessage>
          <PrimeMessage severity="contrast">Contrast Message</PrimeMessage>
        </div>

        <transition-group name="p-message" tag="div">
          <PrimeMessage
            v-for="msg of message"
            :severity="msg.severity"
            :key="msg.content"
            >{{ msg.content }}</PrimeMessage
          >
        </transition-group>
      </div>
    </div>
  </div>
</template>
