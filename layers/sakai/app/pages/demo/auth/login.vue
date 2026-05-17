<script lang="ts" setup>
import { AuthService } from '~/services/auth.service';

definePageMeta({ layout: false });
useSeoMeta({ title: '系统登录' });

const authService = useService(AuthService);

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function handleLogin() {
  error.value = '';

  if (!username.value.trim()) {
    error.value = '请输入用户名';
    return;
  }
  if (!password.value) {
    error.value = '请输入密码';
    return;
  }

  loading.value = true;
  try {
    await authService.login(username.value, password.value);
    await navigateTo('/demo/system/user');
  } catch (e: any) {
    error.value =
      e?.data?.message || e?.message || '登录失败，请检查用户名和密码';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900"
  >
    <PrimeCard class="w-full max-w-[400px]">
      <template #header>
        <div class="flex items-center justify-center pt-8 pb-2">
          <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Sakai Admin
          </div>
        </div>
      </template>
      <template #title>
        <div class="text-center text-lg">系统登录</div>
      </template>
      <template #content>
        <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
          <PrimeMessage v-if="error" severity="error" :closable="false">
            {{ error }}
          </PrimeMessage>

          <div class="flex flex-col gap-2">
            <label
              for="username"
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >用户名</label
            >
            <PrimeInputText
              id="username"
              v-model="username"
              placeholder="请输入用户名"
              fluid
              autocomplete="username"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="password"
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >密码</label
            >
            <PrimePassword
              id="password"
              v-model="password"
              placeholder="请输入密码"
              fluid
              :feedback="false"
              toggle-mask
              autocomplete="current-password"
            />
          </div>

          <PrimeButton type="submit" label="登 录" :loading="loading" fluid />
        </form>
      </template>
    </PrimeCard>
  </div>
</template>
