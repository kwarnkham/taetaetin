import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import useUtil from "src/composables/util";
import { debounce } from "quasar";
import { date } from "quasar";
const { subtractFromDate, formatDate } = date;

export default function usePagination (fetcher, hasDateFilter = false) {
  const { pickBy } = useUtil();
  const route = useRoute();
  const router = useRouter();
  const pagination = ref(null);
  const search = ref(route.query.search ?? "");
  const max = computed(
    () => Math.ceil(pagination.value?.total / pagination.value?.per_page) || 1
  );
  const current = ref(Number(route.query.page ?? 1) ?? 1);
  const onlyStocked = ref(route.query.stocked ? true : false);

  const from = ref(
    route.query.from ??
    formatDate(subtractFromDate(new Date(), { months: 1 }), "YYYY-MM-DD")
  );
  const to = ref(route.query.to ?? formatDate(new Date(), "YYYY-MM-DD"));

  const fetchMore = () => {
    fetcher(route.query).then((response) => {
      pagination.value = response.data;
    });
  };

  const findByDates = () => {
    router
      .replace({
        name: route.name,
        query: { ...route.query, from: from.value, to: to.value },
      })
      .then(() => {
        fetcher(route.query).then((response) => {
          pagination.value = response.data;
          current.value = response.data.current_page;
        });;
      });
  };

  onMounted(() => {
    if (hasDateFilter) router.replace({
      name: route.name,
      query: { ...route.query, from: from.value, to: to.value }
    }).then(() => {
      fetcher(route.query).then((response) => {
        pagination.value = response.data;
        current.value = response.data.current_page;
      });
    })

    else fetcher(route.query).then((response) => {
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
    [search, onlyStocked],
    debounce(() => {
      router
        .replace({
          name: route.name,
          query: pickBy({
            ...route.query,
            search: search.value,
            page: undefined,
            stocked: onlyStocked.value ? 1 : 0
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
    current,
    onlyStocked,
    findByDates,
    from,
    to
  }
}
