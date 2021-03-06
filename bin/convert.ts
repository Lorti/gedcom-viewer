import { readFileSync, writeFileSync } from 'fs';
import { parse, Record } from 'parse-gedcom';
import { findRecordByTag, findRecordsByTag } from './utils';

import Node = Graph.Node;
import Family = Graph.Family;
import Edge = Graph.Edge;

const path = process.argv[2];
const file = readFileSync(path, { encoding: 'utf-8' });
const tree = parse(file);

const nodes: Array<Node> = findRecordsByTag(tree, 'INDI').map((individual: Record): Node => {
  const name = findRecordByTag(individual.tree, 'NAME');
  // Strip @ characters for HTML/CSS classes.
  const pointer = individual.pointer.replace(/@/g, '');
  let label = name ? name.data.replace(/\//g, '').trim() : '?';
  if (!label.length) {
    label = '?';
  }
  return {
    id: pointer,
    settings: {
      label,
      class: pointer,
    },
  };
});

console.log(nodes.slice(0, 10));

const families: Array<Family> = [];
const edges: Array<Edge> = [];

findRecordsByTag(tree, 'FAM').forEach((record: Record): any => {
  const spouses = record.tree
    .filter((r: Record) => /(HUSB)|(WIFE)/.test(r.tag))
    .map((r: Record) => r.data.replace(/@/g, ''));

  if (!spouses.length) {
    return;
  }

  const family: Family = {
    id: record.pointer.replace(/@/g, ''),
    spouses,
  };

  families.push(family);

  const children = record.tree
    .filter((r: Record) => /(CHIL)/.test(r.tag))
    .map((r: Record) => r.data.replace(/@/g, ''));

  children.forEach((child: string) => {
    const edge: Edge = {
      // TODO Order?
      tail: family.spouses[0],
      head: child,
      settings: {
        class: `family-${family.id} tail-${family.spouses[0]} head-${child}`,
      },
    };
    edges.push(edge);
  });
});

console.log(families.slice(0, 10));
console.log(edges.slice(0, 10));

const data = JSON.stringify({ nodes, families, edges }, null, 2);
writeFileSync('public/graph.json', data, { encoding: 'utf-8' });
