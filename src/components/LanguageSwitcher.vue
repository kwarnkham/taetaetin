<template>
  <q-btn
    rounded
    color="secondary"
    no-caps
    :label="$q.lang.nativeName"
    @click="changeLanguage"
  />
</template>

<script setup>
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import languages from "quasar/lang/index.json";

const { dialog, localStorage, lang } = useQuasar();
const { locale } = useI18n({ useScope: "global" });
const appLanguages = languages.filter((lang) =>
  ["mm", "en-US"].includes(lang.isoName)
);

const langOptions = appLanguages.map((lang) => ({
  label: lang.nativeName,
  value: lang.isoName,
}));
const changeLanguage = () => {
  dialog({
    noBackdropDismiss: true,
    cancel: true,
    options: {
      model: lang.isoName,
      items: langOptions,
    },
    ok: {
      icon: "check",
      label: "",
      flat: true,
    },
    cancel: {
      icon: "close",
      label: "",
      flat: true,
    },
  }).onOk((value) => {
    if (value == lang.isoName) return;

    import(
      /* webpackInclude: /(mm|en-US)\.js$/ */
      "quasar/lang/" + value
    ).then((language) => {
      lang.set(language.default);
      locale.value = value;
      localStorage.set("language", value);
    });
  });
};
</script>
