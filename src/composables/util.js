import { api as axios } from "boot/axios";
import { useQuasar } from "quasar";

export default function useUtil () {
  const { loading, notify } = useQuasar();

  return {
    pickBy (data) {
      const temp = {}
      for (const property in data) {
        if (data[property] !== undefined && data[property] !== '') {
          if (Array.isArray(data[property])) {
            if (data[property].length > 0)
              temp[property] = data[property]
          } else
            temp[property] = data[property]
        }
      }
      return temp
    },
    buildForm: (data) => {
      const keys = Object.keys(data);
      const formData = new FormData();
      keys.forEach((key) => {
        if (data[key] != undefined && !Array.isArray(data[key]))
          formData.append(key, data[key]);
        else if (Array.isArray(data[key])) {
          data[key].forEach((e, index) => {
            formData.append(`${key}[${index}]`, e);
          });
        }
      });
      return formData;
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
            message: error?.response?.data?.message,
            type: 'negative'
          })

          reject(error)
        }).finally(() => {
          loading.hide()
        })
      })
    },
    getTotal (array, key) {
      return array.reduce((carry, el) => el[key] + carry, 0)
    },
    getTotalAmount (array, price, quantity) {
      return array.reduce((carry, el) => (el[price] - (el.discount ?? 0)) * el[quantity] + carry, 0)
    },
  }
}
