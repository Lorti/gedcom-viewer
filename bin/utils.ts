import { Record } from 'parse-gedcom';

export function getTagsFromRecords(records: Array<Record>): Set<string> {
  const tags: Set<string> = new Set();
  records.forEach((record: Record) => {
    if (!tags.has(record.tag)) {
      tags.add(record.tag);
    }
    if (record.tree) {
      const recursion = getTagsFromRecords(record.tree);
      recursion.forEach(tag => tags.add(tag));
    }
  });
  return tags;
}

export function findRecordByTag(records: Array<Record>, tag: string): Record | undefined {
  return records.find(record => record.tag.toLowerCase() === tag.toLowerCase());
}

export function findRecordsByTag(records: Array<Record>, tag: string): Array<Record> {
  return records.filter(record => record.tag.toLowerCase() === tag.toLowerCase());
}

export function findRecordByPointer(records: Array<Record>, pointer: string): Record | undefined {
  return records.find(record => record.pointer === pointer);
}

export function findIndividualByName(records: Array<Record>, name: string): Record | undefined {
  // eslint-disable-next-line arrow-body-style
  return findRecordsByTag(records, 'INDI').find((record: Record) => {
    return record.tree.find((r: Record) => r.data === name);
  });
}
