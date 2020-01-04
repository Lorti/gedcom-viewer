declare namespace Graph {
  interface Node {
    id: string,
    settings: {
      label: string,
      class?: string,
    }
  }

  interface Family {
    id: string,
    spouses: Array<string>,
    children?: Array<string>
  }

  interface Edge {
    tail: string,
    head: string,
    settings: {
      class?: string
    }
  }
}
