import { ref } from "vue"
import { useRoute } from "vue-router";
import { date } from "quasar";
const { formatDate } = date;

export default function useDateFilter ({ updateQueryAndFetch }) {
  const route = useRoute();
  const from = ref(route.query.from ?? formatDate(new Date(), "YYYY-MM-DD"))
  const to = ref(route.query.to ?? formatDate(new Date(), "YYYY-MM-DD"));


  const searchByDates = () => {
    updateQueryAndFetch({ to: to.value, from: from.value })
  }
  return {
    from,
    to,
    searchByDates
  }
}
