import faq from "../../data/faq.json";
import { FaqTree } from "../../types";

export const faqTree = faq as unknown as FaqTree;

export function getNode(id: string) {
  const node = faqTree.nodes[id];
  if (!node) throw new Error(`FAQ node not found: ${id}`);
  return node;
}

