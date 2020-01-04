import { readFileSync } from 'fs';
import { parse, Record } from 'parse-gedcom';
import {
  getTagsFromRecords,
  findRecordByTag, findRecordsByTag, findRecordByPointer,
  findIndividualByName,
} from '../utils';

let tree: Array<Record>;

beforeAll(() => {
  const file = readFileSync(`${__dirname}/sample.ged`, { encoding: 'utf-8' });
  tree = parse(file);
});

describe('Utilities', () => {
  it('getTagsFromRecords()', () => {
    const tags = getTagsFromRecords(tree);
    expect(tags.size).toBe(19);
    expect(tags).toContain('HEAD');
  });

  it('findRecordByTag()', () => {
    const record = findRecordByTag(tree, 'HEAD');
    // @ts-ignore
    expect(record.tree[0].tag).toBe('SOUR');
  });

  it('findRecordsByTag()', () => {
    const records = findRecordsByTag(tree, 'INDI');
    expect(records).toHaveLength(3);
    expect(records[0].pointer).toBe('@I1@');
    expect(records[1].pointer).toBe('@I2@');
    expect(records[2].pointer).toBe('@I3@');
  });

  it('findRecordByPointer()', () => {
    const record = findRecordByPointer(tree, '@I1@');
    // @ts-ignore
    expect(record.tree[0].data).toBe('John /Smith/');
  });

  it('findIndividualByName()', () => {
    const record = findIndividualByName(tree, 'John /Smith/');
    // @ts-ignore
    expect(record.pointer).toBe('@I1@');
  });
});
