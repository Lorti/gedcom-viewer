declare module 'parse-gedcom' {
  interface Record {
    pointer: string;
    tag: string;
    data: string;
    tree: Array<Record>;
  }

  function parse(input: string): Array<Record>;
}
