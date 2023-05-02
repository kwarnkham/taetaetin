<template>
  <q-page padding class="column">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab
        name="expense"
        label="Expense"
        no-caps
        v-if="
          userStore.getUser &&
          userStore.getUser.roles.map((e) => e.name).includes('admin')
        "
      />
      <q-tab name="payment" label="Payment" no-caps />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="col">
      <q-tab-panel name="expense" id="expense" class="column no-wrap">
        <ExpenseForm @vnode-mounted="updateItemListHeight" />
        <ExpenseList class="col q-mt-sm" />
      </q-tab-panel>
      <q-tab-panel name="payment" id="payment" class="column no-wrap">
        <PaymentForm
          v-if="
            userStore.getUser &&
            userStore.getUser.roles.map((e) => e.name).includes('admin')
          "
          @vnode-mounted="updateItemListHeight"
        />
        <PaymentList class="col" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import ExpenseForm from "src/components/ExpenseForm.vue";
import ExpenseList from "src/components/ExpenseList.vue";
import PaymentForm from "src/components/PaymentForm.vue";
import PaymentList from "src/components/PaymentList.vue";
import useTabPanels from "src/composables/tabPanels";
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();
const { tab, updateItemListHeight } = useTabPanels("payment");
</script>
