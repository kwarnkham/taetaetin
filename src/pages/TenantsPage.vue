<template>
  <q-page padding :style-fn="vhPage" class="column">
    <q-expansion-item v-model="showForm" label="Add a new tenant">
      <q-form @submit.prevent="submit" class="q-pa-sm">
        <q-input v-model.trim="form.name" label="Name" required />
        <q-input
          v-model.trim="form.domain"
          label="Domain"
          required
          @keydown.space.prevent
        />
        <q-input
          v-model.trim="form.database"
          label="Database"
          required
          @keydown.space.prevent
        >
          <template v-slot:prepend>
            <span class="text-body2 text-weight-bold">facile.</span></template
          >
        </q-input>
        <q-input
          v-model.number="form.days"
          label="Days"
          required
          type="number"
          inputmode="numeric"
          pattern="[0-9]*"
        ></q-input>
        <q-input
          v-model.number="form.price"
          label="Price"
          required
          type="number"
          inputmode="numeric"
          pattern="[0-9]*"
        ></q-input>
        <div class="text-right q-mt-sm">
          <q-btn label="Submit" outline color="primary" type="submit" no-caps />
        </div>
      </q-form>
    </q-expansion-item>
    <q-separator spaced />
    <q-input icon="search" dense placeholder="Search.." v-model="search" />
    <q-select
      v-model="selected"
      :options="[
        {
          label: 'All',
          value: 'all',
        },
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Expired',
          value: 'expired',
        },
      ]"
    />
    <q-list
      v-if="pagination"
      class="col overflow-auto"
      separator
      padding
      bordered
    >
      <q-item v-for="tenant in pagination.data" :key="tenant.id">
        <q-item-section>
          <q-item-label> {{ tenant.name }} </q-item-label>
          <q-item-label
            :class="{
              'text-negative':
                Date.now() > new Date(tenant.expires_on).getTime(),
            }"
          >
            Expires on {{ new Date(tenant.expires_on).toLocaleString("en-GB") }}
          </q-item-label>
          <div
            class="row justify-evenly q-gutter-x-sm q-mt-sm"
            v-if="tenant.type == 1"
          >
            <q-btn icon="add" round @click="addSubscription(tenant)" />
            <q-btn icon="delete" round @click="deleteTenant(tenant)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <div
      class="row justify-center full-width"
      :class="{
        hidden:
          pagination?.current_page == 1 && pagination?.next_page_url == null,
      }"
    >
      <q-pagination v-model="current" :max="max" input />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import useSearchFilter from "src/composables/searchFilter";
import useUtil from "src/composables/util";
import { ref, watch } from "vue";

const { notify, dialog } = useQuasar();
const form = ref({
  name: "",
  domain: "",
  database: "",
  days: "30",
  price: "10000",
});
const selected = ref({
  label: "All",
  value: "all",
});

watch(selected, () => {
  const params = {
    active: undefined,
    expired: undefined,
  };
  params[selected.value.value] = 1;
  updateQueryAndFetch(params);
});

const { vhPage } = useUtil();
const { api } = useUtil();
const showForm = ref(false);
const { pagination, max, current, updateQueryAndFetch } =
  usePagination("tenants");
const { search } = useSearchFilter({ updateQueryAndFetch });
const submit = () => {
  api(
    {
      method: "POST",
      url: "tenants",
      data: { ...form.value, database: "facile." + form.value.database },
    },
    true
  ).then((response) => {
    form.value.name = "";
    form.value.domain = "";
    form.value.database = "";
    form.value.days = "30";
    form.value.price = "10000";
    notify({
      message: "Finish",
      type: "positive",
    });
    pagination.value.data.unshift(response.data.tenant);
  });
};

const addSubscription = (tenant) => {
  dialog({
    title: "Days",
    prompt: {
      model: "30",
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
    },
    position: "top",
    cancel: true,
    noBackdropDismiss: true,
  }).onOk((days) => {
    dialog({
      title: "Price",
      prompt: {
        model: "10000",
        type: "number",
        inputmode: "numeric",
        pattern: "[0-9]*",
      },
      position: "top",
      cancel: true,
      noBackdropDismiss: true,
    }).onOk((price) => {
      api({
        method: "POST",
        url: `tenants/${tenant.id}/renew-subscription`,
        data: {
          price,
          days,
        },
      }).then((response) => {
        const index = pagination.value.data.findIndex(
          (e) => e.id == response.data.tenant.id
        );
        pagination.value.data[index] = response.data.tenant;
      });
    });
  });
};

const deleteTenant = (tenant) => {
  if (tenant.type == 2) return;
  dialog({
    title: "Confirmation",
    message: `Type in '${tenant.name}' to confirm.`,
    cancel: true,
    noBackdropDismiss: true,
    position: "top",
    prompt: {
      model: "",
      isValid: (val) => val == tenant.name,
    },
  }).onOk((val) => {
    if (val != tenant.name) return;
    api(
      {
        method: "DELETE",
        url: `tenants/${tenant.id}`,
      },
      true
    ).then((_) => {
      const index = pagination.value.data.findIndex((e) => e.id == tenant.id);
      pagination.value.data.splice(index, 1);

      notify({
        message: "Deleted",
        type: "positive",
      });
    });
  });
};
</script>
