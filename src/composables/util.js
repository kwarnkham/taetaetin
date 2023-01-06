import { api as axios } from "boot/axios";
import { useQuasar } from "quasar";
import useUitl from "src/composables/util";

export default function useUtil () {
  const { loading } = useQuasar();

  return {
    pickBy (data) {
      const temp = {}
      for (const property in data) {
        if (data[property] != undefined && data[property] != '') {
          temp[property] = data[property]
        }
      }
      return temp
    },
    api (options) {
      loading.show()
      return new Promise((resolve, reject) => {
        axios(options).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        }).finally(() => {
          loading.hide()
        })
      })
    }
  }
}
