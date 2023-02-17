<template>
  <q-page padding>
    <div class="q-mb-xs">
      <q-input label="Search..." outlined v-model.trim="search" />
      <q-toggle
        :model-value="isPreorder"
        label="Pre-order"
        left-label
        @click="changeOrder"
      />
      <div class="row justify-around no-wrap items-center">
        <q-card
          class="cursor-pointer"
          v-ripple
          v-for="product in products"
          :key="product.id"
          @click="addProdcutToCart(product)"
        >
          <q-card-section>
            <div>{{ product.name }}</div>
            <div>{{ product.item?.name }}</div>
            <div>{{ product?.price }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-markup-table
      separator="cell"
      flat
      bordered
      wrap-cells
      :dense="screen.lt.sm"
    >
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Item</th>
          <th class="text-right">Price</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Amount</th>
          <th v-if="screen.gt.xs">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(product, key) in cartStore.getCart.products"
          :key="product.id"
        >
          <td class="text-left">{{ key + 1 }}</td>
          <td class="text-left">{{ product.name }}</td>
          <td class="text-right">
            <span
              @click="applyProductDiscount(product)"
              :class="{
                'text-white bg-black rounded-borders':
                  product.discount && product.discount > 0,
              }"
              >{{
                (product.price - (product.discount ?? 0)).toLocaleString()
              }}</span
            >
          </td>
          <td class="text-right">
            <span @click="editProductQuantity(product)">{{
              product.quantity
            }}</span>
          </td>
          <td class="text-right">
            {{
              (
                (product.price - (product.discount ?? 0)) *
                product.quantity
              ).toLocaleString()
            }}
          </td>
          <td class="text-center q-gutter-x-sm" v-if="screen.gt.xs">
            <q-btn round icon="add" @click="increaseCartQuantity(product)" />
            <q-btn round icon="remove" @click="decreaseCartQuantity(product)" />
            <q-btn
              round
              icon="delete_forever"
              @click="removeFromCart(product)"
            />
          </td>
        </tr>
        <tr
          v-for="(service, key) in cartStore.getCart.services"
          :key="service.id"
        >
          <td class="text-left">
            {{ key + 1 + cartStore.getCart.products.length }}
          </td>
          <td class="text-left">{{ service.name }}</td>
          <td class="text-right">
            <span
              :class="{
                'text-white bg-black rounded-borders':
                  service.discount && service.discount > 0,
              }"
              @click="applyServiceDiscount(service)"
            >
              {{ (service.price - (service.discount ?? 0)).toLocaleString() }}
            </span>
          </td>
          <td class="text-right">
            <span @click="editServiceQuantity(service)">
              {{ service.quantity }}
            </span>
          </td>
          <td class="text-right">
            {{
              (
                (service.price - (service.discount ?? 0)) *
                service.quantity
              ).toLocaleString()
            }}
          </td>
          <td class="text-center q-gutter-x-sm" v-if="screen.gt.xs">
            <q-btn
              round
              icon="add"
              @click="cartStore.addService({ service, quantity: 1 })"
            />
            <q-btn
              round
              icon="remove"
              @click="cartStore.reduceService({ service, quantity: 1 })"
            />
            <q-btn
              round
              icon="delete_forever"
              @click="
                cartStore.reduceService({ service, quantity: service.quantity })
              "
            />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-right">Total</td>
          <td class="text-right">
            {{
              sumArray(cartStore.getCart.products, "quantity") +
              sumArray(cartStore.getCart.services, "quantity")
            }}
          </td>

          <td class="text-right">
            {{
              (
                getTotalAmount(
                  cartStore.getCart.products,
                  "price",
                  "quantity"
                ) +
                getTotalAmount(cartStore.getCart.services, "price", "quantity")
              ).toLocaleString()
            }}
          </td>
          <td class="text-center" v-if="screen.gt.xs">Action</td>
        </tr>
        <tr v-if="userStore.getUser.roles.map((e) => e.name).includes('admin')">
          <td colspan="3"></td>
          <td class="text-right" :class="{ 'font-05': screen.lt.sm }">
            Discount
          </td>
          <td class="text-right">
            <span @click="addOrderDiscount">{{
              cartStore.getCart.discount.toLocaleString()
            }}</span>
          </td>
          <td class="text-center" v-if="screen.gt.xs">
            <q-btn
              label="Add Discount"
              dense
              no-caps
              flat
              @click="addOrderDiscount"
              color="info"
            />
          </td>
        </tr>
        <tr
          :class="{
            'text-negative':
              getTotalAmount(cartStore.getCart.products, 'price', 'quantity') +
                getTotalAmount(
                  cartStore.getCart.services,
                  'price',
                  'quantity'
                ) -
                cartStore.getCart.discount <
              0,
          }"
        >
          <td :colspan="screen.lt.sm ? 2 : 3"></td>
          <td class="text-center" v-if="screen.lt.sm">
            <q-btn
              label="Clear"
              flat
              no-caps
              color="accent"
              @click="clearCart"
            />
          </td>
          <td class="text-right" :class="{ 'font-05': screen.lt.sm }">
            Amount
          </td>

          <td class="text-right">
            {{
              (
                getTotalAmount(
                  cartStore.getCart.products,
                  "price",
                  "quantity"
                ) +
                getTotalAmount(
                  cartStore.getCart.services,
                  "price",
                  "quantity"
                ) -
                cartStore.getCart.discount
              ).toLocaleString()
            }}
          </td>
          <td v-if="screen.gt.xs" class="text-center">
            <q-btn
              label="Clear"
              flat
              no-caps
              color="accent"
              @click="clearCart"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <div class="text-right">
      <q-btn
        label="Checkout"
        no-caps
        flat
        color="positive"
        @click="
          $router.replace({
            name: 'checkout-cart',
          })
        "
      />
    </div>
    <q-separator spaced />
    <q-toggle v-model="serviceShowed" label="Service" />
    <ManageServiceForCart
      v-if="serviceShowed"
      @service-added="addServiceToCart"
    />
  </q-page>
</template>

<script setup>
import { debounce, useQuasar } from "quasar";
import { useCartStore } from "src/stores/cart-store";
import useUtil from "src/composables/util";
import ManageServiceForCart from "components/ManageServiceForCart.vue";
import { ref, watch } from "vue";
import { useUserStore } from "src/stores/user-store";
import useApp from "src/composables/app";

const cartStore = useCartStore();
const userStore = useUserStore();
const { notify, dialog, screen, localStorage } = useQuasar();
const { api } = useUtil();
const { sumArray, getTotalAmount } = useApp();
const serviceShowed = ref(false);
const search = ref("");
const products = ref([]);
const isPreorder = ref(localStorage.getItem("isPreorder") ?? false);

const changeOrder = () => {
  const cart = cartStore.getCart;
  if (cart.products.length > 0 || cart.services.length > 0 || cart.discount > 0)
    dialog({
      titel: "Confirm",
      message: "The cart will be cleared",
      noBackdropDismiss: true,
      cancel: true,
    }).onOk(() => {
      cartStore.clear();
      isPreorder.value = !isPreorder.value;
      localStorage.set("isPreorder", isPreorder.value);
      search.value = "";
    });
  else {
    isPreorder.value = !isPreorder.value;
    localStorage.set("isPreorder", isPreorder.value);
    search.value = "";
  }
};

watch(
  search,
  debounce(() => {
    if (!search.value) {
      products.value = [];
      return;
    }
    const options = {
      method: "GET",
    };
    if (isPreorder.value) {
      options.url = "items";
      options.params = {
        search: search.value,
        limit: 5,
      };
    } else {
      options.url = "features";
      options.params = {
        search: search.value,
        limit: 5,
        stocked: 1,
      };
    }
    api(options).then((response) => {
      products.value = response.data.data;
    });
  }, 1000)
);

const addProdcutToCart = (product) => {
  if (isPreorder.value) {
    dialog({
      title: "Price for " + product.name,
      prompt: {
        model: "",
        type: "tel",
        isValid: (val) => val >= 0 && val != "",
      },
      position: "bottom",
      noBackdropDismiss: true,
      cancel: true,
    }).onOk((value) => {
      product.price = Number(value);
      cartStore.addProduct({ product, quantity: 1 });
    });
  } else increaseCartQuantity(product);
};

const increaseCartQuantity = (product) => {
  if (!isPreorder.value) {
    const cartProduct = cartStore.getCart.products.find(
      (e) => e.id == product.id
    );
    if (!cartProduct || product.stock > cartProduct.quantity)
      cartStore.addProduct({ product, quantity: 1 });
    else
      notify({
        message: "No enough stock",
        type: "warning",
      });
  } else cartStore.addProduct({ product, quantity: 1 });
};

const removeFromCart = (product) => {
  dialog({
    noBackdropDismiss: true,
    cancel: true,
    title: "Remove the product from cart?",
  }).onOk(() => {
    cartStore.reduceProduct({ product, quantity: product.quantity });
  });
};

const applyProductDiscount = (product) => {
  if (!userStore.getUser.roles.map((e) => e.name).includes("admin")) return;
  if (isPreorder.value) return;
  dialog({
    prompt: {
      model: product.discount > 0 ? product.discount : "",
      type: "tel",
      isValid: (val) => val <= product.price,
    },
    position: "bottom",
    noBackdropDismiss: true,
    cancel: true,
    title: "Apply discount for " + product.name,
  }).onOk((value) => {
    product.discount = value;
    cartStore.updateProduct(product);
  });
};

const applyServiceDiscount = (service) => {
  if (!userStore.getUser.roles.map((e) => e.name).includes("admin")) return;
  dialog({
    prompt: {
      model: service.discount > 0 ? service.discount : "",
      type: "tel",
      isValid: (val) => val <= service.price,
    },
    position: "bottom",
    noBackdropDismiss: true,
    cancel: true,
    title: "Apply discount for " + service.name,
  }).onOk((value) => {
    service.discount = value;
    cartStore.updateService(service);
  });
};

const clearCart = () => {
  dialog({
    title: "Confirm",
    message: "Do you want to clear cart?",
    cancel: true,
    noBackdropDismiss: true,
  }).onOk(() => {
    cartStore.clear();
  });
};

const addOrderDiscount = () => {
  if (!userStore.getUser.roles.map((e) => e.name).includes("admin")) return;
  dialog({
    title: "Add discount for this order",
    noBackdropDismiss: true,
    cancel: true,
    position: "bottom",
    prompt: {
      model: cartStore.getCart.discount > 0 ? cartStore.getCart.discount : "",
      type: "tel",
      isValid: (val) =>
        val >= 0 &&
        val <=
          getTotalAmount(cartStore.getCart.products, "price", "quantity") +
            getTotalAmount(cartStore.getCart.services, "price", "quantity"),
    },
  }).onOk((value) => {
    cartStore.applyDiscount(value);
  });
};

const decreaseCartQuantity = (product) => {
  if (product.quantity == 1)
    dialog({
      noBackdropDismiss: true,
      cancel: true,
      title: "Remove the product from cart?",
    }).onOk(() => {
      cartStore.reduceProduct({ product, quantity: 1 });
    });
  else cartStore.reduceProduct({ product, quantity: 1 });
};

const addServiceToCart = (payload) => {
  cartStore.addService(payload);
};

const editProductQuantity = (product) => {
  dialog({
    title: `Edit ${product.name} quantity`,
    message: isPreorder.value ? undefined : `Remaining stock ${product.stock}`,
    noBackdropDismiss: true,
    cancel: true,
    position: "bottom",
    prompt: {
      model: product.quantity,
      type: "tel",
      isValid: (val) => {
        if (isPreorder.value) {
          return val != "" && val >= 0;
        } else {
          return val <= product.stock && val != "";
        }
      },
    },
  }).onOk((val) => {
    if (val <= 0) removeFromCart(product);
    else {
      product.quantity = Number(val);
      cartStore.updateProduct(product);
    }
  });
};

const editServiceQuantity = (service) => {
  dialog({
    title: `Edit ${service.name} quantity`,
    noBackdropDismiss: true,
    cancel: true,
    position: "bottom",
    prompt: {
      model: service.quantity,
      type: "tel",
    },
  }).onOk((val) => {
    if (val <= 0)
      cartStore.reduceService({ service, quantity: service.quantity });
    else {
      service.quantity = Number(val);
      cartStore.updateService(service);
    }
  });
};
</script>
