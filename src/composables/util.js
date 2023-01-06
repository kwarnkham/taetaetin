import { api as axios } from "boot/axios";
import { useQuasar } from "quasar";

export default function useUtil () {
  const { loading, notify } = useQuasar();

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
          notify({
            message: error.message,
            type: 'negative'
          })
          notify({
            message: error.response.data.message,
            type: 'negative'
          })

          reject(error)
        }).finally(() => {
          loading.hide()
        })
      })
    }
  }
}
