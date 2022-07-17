import type { UserConfig } from "vitest"

const config: UserConfig = {
  coverage: {
    all: true,
    src: ["src"],
    reporter: ["json", "text", "text-summary"],
  },
  include: ["tests/unit/**/*.ts"],
}

export default config
