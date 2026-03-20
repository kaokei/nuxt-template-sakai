<script setup>
import { NodeService } from '@sakai/services/NodeService';

const treeValue = ref(null);
const selectedTreeValue = ref(null);
const treeTableValue = ref(null);
const selectedTreeTableValue = ref(null);

onMounted(() => {
  NodeService.getTreeNodes().then((data) => (treeValue.value = data));
  NodeService.getTreeTableNodes().then((data) => (treeTableValue.value = data));
});
</script>

<template>
  <div class="card">
    <div class="text-xl font-semibold">Tree</div>
    <PrimeTree
      :value="treeValue"
      selectionMode="checkbox"
      v-model:selectionKeys="selectedTreeValue"
    ></PrimeTree>
  </div>

  <div class="card">
    <div class="mb-4 text-xl font-semibold">TreeTable</div>
    <PrimeTreeTable
      :value="treeTableValue"
      selectionMode="checkbox"
      v-model:selectionKeys="selectedTreeTableValue"
    >
      <PrimeColumn field="name" header="Name" :expander="true"></PrimeColumn>
      <PrimeColumn field="size" header="Size"></PrimeColumn>
      <PrimeColumn field="type" header="Type"></PrimeColumn>
    </PrimeTreeTable>
  </div>
</template>
