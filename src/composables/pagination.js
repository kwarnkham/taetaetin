import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import useUtil from "src/composables/util";
import { debounce } from "quasar";
import { date } from "quasar";
const { formatDate } = date;

export default function usePagination (fetcher, options = {
  onlyStocked: false,
  hasDateFilter: false,
  status: false
}) {
  const { pickBy } = useUtil();
  const route = useRoute();
  const router = useRouter();
  const pagination = ref(null);
  const search = ref(route.query.search ?? "");
  const item = ref(route.query.item ?? "");
  const max = computed(
    () => Math.ceil(pagination.value?.total / pagination.value?.per_page) || 1
  );
  const total = ref(0)
  const current = ref(Number(route.query.page ?? 1) ?? 1);
  const onlyStocked = ref(options.onlyStocked);
  const status = ref(options.status)

  // const from = ref(
  //   route.query.from ??
  //   formatDate(subtractFromDate(new Date(), { months: 1 }), "YYYY-MM-DD")
  // );
  const from = ref(route.query.from ?? formatDate(new Date(), "YYYY-MM-DD"))
  const to = ref(route.query.to ?? formatDate(new Date(), "YYYY-MM-DD"));

  const fetchMore = () => {
    fetcher(route.query).then((response) => {
      pagination.value = response.data.data;
      total.value = response.data.total ?? 0
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
          pagination.value = response.data.data;
          current.value = response.data.data.current_page;
          total.value = response.data.total
        });;
      });
  };

  onMounted(() => {
    setTimeout(() => {
      let query = route.query
      if (options?.hasDateFilter) query = { ...query, from: from.value, to: to.value }
      if (options.status) query = { ...query, status: status.value }
      if (options.onlyStocked) query = { ...query, stocked: onlyStocked.value ? 1 : undefined }
      router.replace({
        name: route.name,
        query
      }).then(() => {
        fetcher(route.query).then((response) => {
          pagination.value = response.data.data;
          current.value = response.data.data.current_page;
          total.value = response.data.total
        });
      })
    }, 100)

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
    [search, onlyStocked, status],
    debounce(() => {

      router
        .replace({
          name: route.name,
          query: pickBy({
            ...route.query,
            search: search.value,
            page: undefined,
            stocked: onlyStocked.value ? 1 : undefined,
            status: status.value
          }),
        })
        .then(() => {
          if (current.value != 1) {
            current.value = 1;
          } else {
            fetchMore();
          }
        });
    }, 1000)
  );

  return {
    pagination,
    max,
    search,
    current,
    onlyStocked,
    findByDates,
    from,
    to, total, status, item
  }
}
