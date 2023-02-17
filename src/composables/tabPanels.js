import { useQuasar } from "quasar";
import { ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";

export default function useTabPanels (defaultTab) {
  const { localStorage } = useQuasar()
  const route = useRoute()
  const tab = ref(localStorage.getItem(route.name + ".tab") ?? defaultTab);

  watch(tab, () => {
    localStorage.set(route.name + ".tab", tab.value);
  });
  const updateItemListHeight = () => {
    console.log(tab.value)
    const el = document.getElementById(tab.value);
    el.style.height =
      document.querySelector(".q-tab-panels").clientHeight + "px";
  };


  onBeforeRouteLeave(() => {
    localStorage.remove(route.name + ".tab");
  });
  return {
    tab,
    updateItemListHeight
  }
}
