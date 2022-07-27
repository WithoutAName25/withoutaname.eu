export class NavigationData {
  readonly elements: NavElementData[]
  constructor(elements: NavElementData[]) {
    this.elements = elements
  }
}

export type NavElementData = NavLinkData | NavGroupData

export class NavLinkData {
  readonly name: string
  readonly url: string
  constructor(name: string, url: string) {
    this.name = name
    this.url = url
  }
}

export class NavGroupData {
  readonly name: string
  readonly url?: string
  readonly baseUrl: string
  readonly elements: NavElementData[]
  constructor(
    name: string,
    baseUrl: string,
    elements: NavElementData[],
    url?: string
  ) {
    this.name = name
    this.url = url
    this.baseUrl = baseUrl
    this.elements = elements
  }
}

export const navigationData = new NavigationData([
  new NavLinkData("Home", "/"),
  new NavGroupData("Tools", "/tools", [
    new NavLinkData("FlipFlops", "/tools/digital-electronics/flip-flops"),
  ]),
  new NavGroupData("Games", "/games", [
    new NavLinkData("Sudoku", "/games/sudoku"),
  ]),
  new NavLinkData("Repo", "https://repo.withoutaname.eu"),
])
