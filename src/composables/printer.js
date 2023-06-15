import domtoimage from "dom-to-image";
import { QSpinnerHourglass, useQuasar, date } from "quasar";
import { usePrinterStore } from "src/stores/print-store";
import { computed, ref, onMounted } from "vue";
const { formatDate } = date;

export default function usePrinter () {
  const { localStorage, loading } = useQuasar()
  const printSize = ref(Number(localStorage.getItem("printSize")) || 1);
  const printBit = ref(Number(localStorage.getItem("printBit")) || 4);
  const printing = ref(false);
  const width = ref(360)
  const height = ref(0)
  const printerStore = usePrinterStore()
  const printer = computed(() => printerStore.getPrinter)
  const printId = 'print-this'
  const printTime = ref(formatDate(new Date(), "DD-MM-YYYY HH:mm:ss"));

  onMounted(() => {
    setInterval(() => {
      printTime.value = formatDate(new Date(), "DD-MM-YYYY HH:mm:ss");
    }, 1000);
  });

  const getPrintWidth = () => 360 + ((printSize.value * 40) - 40)

  const sendTextData = (input) => {
    loading.show()
    return new Promise((resolve, reject) => {
      // Get the bytes for the text
      const encoder = new TextEncoder("utf-8");
      // Add line feed + carriage return chars to text
      const text = encoder.encode(input + '\u000A\u000D');
      if (!printer.value) {
        reject('no printer connected')
      }
      printer.value.writeValue(text).then(() => {
        resolve()
      }).catch(() => {
        printerStore.setPrinter(null)
        reject('error writing data')
      }).finally(() => {
        loading.hide()
      });
    })
  }
  const generateImageData = async (node) => {
    loading.show({
      spinner: QSpinnerHourglass,
      message: "Printing...",
    });
    // height.value = Math.round((node.clientHeight * getPrintWidth()) / 360);
    height.value = node.clientHeight
    const dataUrl = await domtoimage.toPng(node)

    const printTarget = new Image();
    printTarget.src = dataUrl;
    printTarget.id = printId;
    document.body.appendChild(printTarget)
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
    // Use the canvas to get image data
    const canvas = document.createElement("canvas");
    // Canvas dimensions need to be a multiple of 40 for this printer
    canvas.width = getPrintWidth();
    canvas.height = height.value;
    const context = canvas.getContext("2d");
    context.drawImage(document.getElementById(printId), 0, 0, canvas.width, canvas.height);
    return context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data
  }
  const getDarkPixel = (x, y, imageData) => {
    // Return the pixels that will be printed black
    let red = imageData[(getPrintWidth() * y + x) * 4];
    let green = imageData[(getPrintWidth() * y + x) * 4 + 1];
    let blue = imageData[(getPrintWidth() * y + x) * 4 + 2];
    return red + green + blue > 0 ? 1 : 0;
  }
  const getImagePrintData = (imageData) => {
    if (imageData == null) {
      console.log("No image to print!");
      return new Uint8Array([]);
    }
    // Each 8 pixels in a row is represented by a byte
    let printData = new Uint8Array((getPrintWidth() / 8) * height.value + 8);
    // Set the header bytes for printing the image
    printData[0] = 29; // Print raster bitmap
    printData[1] = 118; // Print raster bitmap
    printData[2] = 48; // Print raster bitmap
    printData[3] = 0; // Normal 203.2 DPI
    printData[4] = getPrintWidth() / 8; // Number of horizontal data bits (LSB)
    printData[5] = 0; // Number of horizontal data bits (MSB)
    printData[6] = height.value % 256; // Number of vertical data bits (LSB)
    printData[7] = height.value / 256; // Number of vertical data bits (MSB)
    let offset = 7;
    // Loop through image rows in bytes
    for (let i = 0; i < height.value; ++i) {
      for (let k = 0; k < getPrintWidth() / 8; ++k) {
        let k8 = k * 8;
        //  Pixel to bit position mapping
        printData[++offset] =
          getDarkPixel(k8 + 0, i, imageData) * 128 +
          getDarkPixel(k8 + 1, i, imageData) * 64 +
          getDarkPixel(k8 + 2, i, imageData) * 32 +
          getDarkPixel(k8 + 3, i, imageData) * 16 +
          getDarkPixel(k8 + 4, i, imageData) * 8 +
          getDarkPixel(k8 + 5, i, imageData) * 4 +
          getDarkPixel(k8 + 6, i, imageData) * 2 +
          getDarkPixel(k8 + 7, i, imageData);
      }
    }
    return printData;
  }
  const sendImageData = async (node) => {
    const imageData = await generateImageData(node)
    let index = 0;
    let imagePrintData = getImagePrintData(imageData);
    const sendNextImageDataBatch = async (resolve, reject) => {
      const bits = {
        1: 1,
        2: 2,
        3: 4,
        4: 8,
        5: 16,
        6: 32,
        7: 64,
        8: 128
      }
      const max = 512 / bits[printBit.value];
      if (index == 0)
        console.log(max, printBit.value, 'bit')
      if (index + max < imagePrintData.length) {
        try {
          if (!printer.value) reject('no printer conneted')
          await printer.value.writeValue(imagePrintData.slice(index, index + max))
        } catch (error) {
          console.log(error)
          printerStore.setPrinter(null)
          reject()
        }
        index += max;
        sendNextImageDataBatch(resolve, reject);
      } else {
        // Send the last bytes
        if (index < imagePrintData.length) {
          try {
            if (!printer.value) reject('no printer conneted')
            await printer.value
              .writeValue(imagePrintData.slice(index, imagePrintData.length))
          } catch (error) {
            console.log(error)
            printerStore.setPrinter(null)
            reject()
          }
          await sendTextData('')
          await sendTextData('')
          document.getElementById(printId).remove()
          loading.hide()
          resolve();
        } else {
          await sendTextData('')
          await sendTextData('')
          document.getElementById(printId).remove()
          resolve();
        }
      }
    }
    return new Promise((resolve, reject) => {
      sendNextImageDataBatch(resolve, reject);
    });

  }
  const sendPrinterData = ({ node, text }) => {
    console.log(getPrintWidth(), printSize.value, 'width')
    return new Promise((resolve, reject) => {
      if (!printer.value) {
        navigator.bluetooth
          .requestDevice({
            filters: [
              {
                services: ["000018f0-0000-1000-8000-00805f9b34fb"],
              },
            ],
          })
          .then((device) => {
            console.log("> Found " + device.name);
            console.log("Connecting to GATT Server...");
            return device.gatt.connect();
          })
          .then((server) =>
            server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb")
          )
          .then((service) =>
            service.getCharacteristic(
              "00002af1-0000-1000-8000-00805f9b34fb"
            )
          )
          .then((characteristic) => {
            // Cache the characteristic
            printerStore.setPrinter(characteristic)
            if (node)
              sendImageData(node).then(() => {
                resolve()
              }).catch(e => {
                reject(e)
              });
            else
              sendTextData(text).then(() => {
                resolve()
              }).catch(e => {
                reject(e)
              });
          })
          .catch(e => {
            console.log(e)
            reject()
          })
      } else {
        if (node)
          sendImageData(node).then(() => {
            resolve()
          }).catch(e => {
            reject(e)
          });
        else
          sendTextData(text).then(() => {
            resolve()
          }).catch(e => {
            reject(e)
          });
      }
    })

  }
  return {
    generateImageData,
    getDarkPixel,
    getImagePrintData,
    sendImageData,
    sendPrinterData,
    sendTextData,
    printSize,
    printBit,
    printing,
    printTime,
    getPrintWidth
  }
}

