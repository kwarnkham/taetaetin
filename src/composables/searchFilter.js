import { debounce } from "quasar";
import { ref, watch } from "vue"
import { useRoute } from "vue-router";

export default function useSearchFilter ({ updateQueryAndFetch }) {
  const route = useRoute();
  const search = ref(route.query.search ?? "");
  watch(
    search,
    debounce(() => {
      updateQueryAndFetch({ search: search.value || undefined })
    }, 800)
  );
  return {
    search,
  }
}
