export function onClickOutside(node: Node, callback: () => void) {
  let currentCallback = callback
  const handleClick = (event: MouseEvent) => {
    if (
      node &&
      !node.contains(event.target as Node) &&
      !event.defaultPrevented
    ) {
      currentCallback()
    }
  }

  document.addEventListener("click", handleClick, true)

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true)
    },
    update(callback: () => void) {
      currentCallback = callback
    },
  }
}

export function onEnterOutside(node: Node, callback: () => void) {
  let currentCallback = callback
  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      node &&
      !node.contains(event.target as Node) &&
      !event.defaultPrevented &&
      event.key === "Enter"
    ) {
      currentCallback()
    }
  }

  document.addEventListener("keydown", handleKeyDown, true)

  return {
    destroy() {
      document.removeEventListener("keydown", handleKeyDown, true)
    },
    update(callback: () => void) {
      currentCallback = callback
    },
  }
}

export function onClickOrEnterOutside(node: Node, callback: () => void) {
  const clickOutside = onClickOutside(node, callback)
  const enterOutside = onEnterOutside(node, callback)

  return {
    destroy() {
      clickOutside.destroy()
      enterOutside.destroy()
    },
    update(callback: () => void) {
      clickOutside.update(callback)
      enterOutside.update(callback)
    },
  }
}
