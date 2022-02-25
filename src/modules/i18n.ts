import { createI18n } from "vue-i18n"
import type { UserModule } from "~/types"

const messages = Object.fromEntries(
  Object.entries(import.meta.globEager("../../locales/*.y(a)?ml")).map(
    ([key, value]) => {
      const yaml = key.endsWith(".yaml")
      return [key.slice(14, yaml ? -5 : -4), value.default]
    }
  )
)

export const install: UserModule = ({ app, isClient }) => {
  let locale = "en"
  if (isClient) {
    locale = navigator.language.substring(0, 2)
  }
  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackWarn: false,
    missingWarn: false,
    fallbackLocale: "en",
    messages,
  })

  app.use(i18n)
}
