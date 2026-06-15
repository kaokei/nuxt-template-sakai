<script lang="ts" setup>
import { AuthService } from '@sakai/services/auth.service';

definePageMeta({ layout: false });
useSeoMeta({ title: '系统登录' });

const authService = useService(AuthService);

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const demoAccounts = [
  { username: 'admin', password: 'admin123', role: '超级管理员' },
  { username: 'manager', password: 'manager123', role: '部门经理' },
  { username: 'user', password: 'user123', role: '普通用户' },
];

function fillDemoAccount(u: string, p: string) {
  username.value = u;
  password.value = p;
  error.value = '';
}

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
    <PrimeCard class="w-full max-w-100">
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

        <PrimeDivider />

        <div class="text-xs text-gray-500 dark:text-gray-400">
          <div class="mb-2 font-medium">演示账号（点击快速填充）</div>
          <div
            v-for="acct in demoAccounts"
            :key="acct.username"
            class="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="fillDemoAccount(acct.username, acct.password)"
          >
            <span class="font-mono text-gray-700 dark:text-gray-300">
              {{ acct.username }}<span class="mx-1 text-gray-400">/</span
              >{{ acct.password }}
            </span>
            <span class="text-gray-400">{{ acct.role }}</span>
          </div>
        </div>
      </template>
    </PrimeCard>
  </div>
</template>
