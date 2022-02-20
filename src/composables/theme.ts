export const useTheme = createGlobalState(() =>
  useColorMode({
    attribute: "color-scheme",
  })
)
