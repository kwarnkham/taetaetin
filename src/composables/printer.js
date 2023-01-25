import domtoimage from "dom-to-image";
import { QSpinnerHourglass, useQuasar } from "quasar";
import { usePrinterStore } from "src/stores/print-store";
import { ref } from "vue";

export default function usePrinter () {
  const width = ref(360)
  const height = ref(0)
  const printerStore = usePrinterStore()
  const printCharacteristic = printerStore.getPrinter
  const printId = 'print-this'
  const { loading } = useQuasar()

  const sendTextData = (input) => {
    return new Promise((resolve, reject) => {
      // Get the bytes for the text
      const encoder = new TextEncoder("utf-8");
      // Add line feed + carriage return chars to text
      const text = encoder.encode(input + '\u000A\u000D');
      if (!printCharacteristic.value) {
        reject('no printer connected')
      }
      printCharacteristic.value.writeValue(text).then(() => {
        resolve()
      }).catch(() => {
        printerStore.setPrinter(null)
        reject('error writing data')
      });
    })
  }
  const generateImageData = async (node) => {
    loading.show({
      spinner: QSpinnerHourglass,
      message: "Printing...",
    });
    height.value = Math.round((node.clientHeight * width.value) / 360);
    const dataUrl = await domtoimage.toPng(node, { cacheBust: true })

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
    canvas.width = width.value;
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
    let red = imageData[(width.value * y + x) * 4];
    let green = imageData[(width.value * y + x) * 4 + 1];
    let blue = imageData[(width.value * y + x) * 4 + 2];
    return red + green + blue > 0 ? 1 : 0;
  }
  const getImagePrintData = (imageData) => {
    if (imageData == null) {
      console.log("No image to print!");
      return new Uint8Array([]);
    }
    // Each 8 pixels in a row is represented by a byte
    let printData = new Uint8Array((width.value / 8) * height.value + 8);
    // Set the header bytes for printing the image
    printData[0] = 29; // Print raster bitmap
    printData[1] = 118; // Print raster bitmap
    printData[2] = 48; // Print raster bitmap
    printData[3] = 0; // Normal 203.2 DPI
    printData[4] = width.value / 8; // Number of horizontal data bits (LSB)
    printData[5] = 0; // Number of horizontal data bits (MSB)
    printData[6] = height.value % 256; // Number of vertical data bits (LSB)
    printData[7] = height.value / 256; // Number of vertical data bits (MSB)
    let offset = 7;
    // Loop through image rows in bytes
    for (let i = 0; i < height.value; ++i) {
      for (let k = 0; k < width.value / 8; ++k) {
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
      const max = 512 / 8;
      if (index + max < imagePrintData.length) {
        try {
          if (!printCharacteristic.value) reject('no printer conneted')
          await printCharacteristic.value.writeValue(imagePrintData.slice(index, index + max))
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
            if (!printCharacteristic.value) reject('no printer conneted')
            await printCharacteristic.value
              .writeValue(imagePrintData.slice(index, imagePrintData.length))
          } catch (error) {
            console.log(error)
            printerStore.setPrinter(null)
            reject()
          }
          await sendTextData('')
          await sendTextData('')
          document.getElementById(printId).remove()
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
  const sendPrinterData = (node, printSize = 1) => {
    width.value += (printSize * 40) - 40;
    return new Promise((resolve, reject) => {
      if (!printCharacteristic.value) {
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
            sendImageData(node).then(() => {
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
        sendImageData(node).then(() => {
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
    sendTextData
  }
}

