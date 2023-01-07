import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import useUtil from "src/composables/util";
import { debounce } from "quasar";

export default function usePagination (fetcher) {
  const { pickBy } = useUtil();
  const route = useRoute();
  const router = useRouter();
  const pagination = ref(null);
  const search = ref(route.query.search ?? "");
  const max = computed(
    () => Math.ceil(pagination.value?.total / pagination.value?.per_page) || 1
  );
  const current = ref(Number(route.query.page ?? 1) ?? 1);

  const fetchMore = () => {
    fetcher(route.query).then((response) => {
      pagination.value = response.data;
    });
  };

  onMounted(() => {
    fetcher(route.query).then((response) => {
      pagination.value = response.data;
      current.value = response.data.current_page;
    });
  })

  watch(current, () => {
    router
      .replace({
        name: route.name,
        query: { ...route.query, page: current.value },
      })
      .then(fetchMore);
  });

  watch(
    search,
    debounce(() => {
      router
        .replace({
          name: route.name,
          query: pickBy({
            ...route.query,
            search: search.value,
            page: undefined,
          }),
        })
        .then(() => {
          if (current.value != 1) {
            current.value = 1;
          } else {
            fetchMore();
          }
        });
    }, 500)
  );

  return {
    pagination,
    max,
    search,
    current
  }
}
