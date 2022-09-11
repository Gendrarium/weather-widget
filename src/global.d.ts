declare module 'global' {
  export declare global {
    interface EventTarget {
      parentNode: ParentNode | null;
      previousSibling: ChildNode | null;
      nextSibling: ChildNode | null;
    }
  }
}
