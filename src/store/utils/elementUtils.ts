import type { ElementNode } from "../../lib/utils/types";

export function findElementById(
  elements: ElementNode[],
  id: string
): ElementNode | null {
  for (const el of elements) {
    if (el.id === id) return el;
    const found = findElementById(el.children || [], id);
    if (found) return found;
  }
  return null;
}

export function updateElementById(
  elements: ElementNode[],
  id: string,
  updater: (el: ElementNode) => ElementNode
): ElementNode[] {
  return elements.map((el) => {
    if (el.id === id) {
      return updater(el);
    }
    return {
      ...el,
      children: updateElementById(el.children || [], id, updater),
    };
  });
}
