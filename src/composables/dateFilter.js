import { ref } from "vue"
import { useRoute } from "vue-router";
import { date } from "quasar";
const { formatDate } = date;

export default function useDateFilter () {
  const route = useRoute();
  const from = ref(route.query.from ?? formatDate(
    new Date(new Date().getFullYear(), 0, 1),
    "YYYY-MM-DD"
  ))
  const to = ref(route.query.to ?? formatDate(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    "YYYY-MM-DD"
  ));

  return {
    from,
    to
  }
}
