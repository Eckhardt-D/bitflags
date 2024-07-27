import { defineMask } from '../src/bitmasking';
import { describe, it, expect } from 'bun:test';

describe('bitmask', () => {
  it('should throw if mask is bigger than 31', () => {
    expect(() => defineMask(Array.from({ length: 32 }, (_, i) => String.fromCharCode(97 + i)))
    ).toThrow();
  });

  it('should define a mask', () => {
    const mask = defineMask(['a', 'b', 'c', 'd']);
    expect(mask).toBeDefined();
    expect(mask.getState()).toBe(0);
  });

  it('should check if a bit is not active', () => {
    const mask = defineMask(['a', 'b', 'c', 'd']);
    expect(mask.isFlagActive('a')).toBe(false);
    expect(mask.isFlagActive('b')).toBe(false);
    expect(mask.isFlagActive('c')).toBe(false);
    expect(mask.isFlagActive('d')).toBe(false);
  });

  it('should set a bit', () => {
    const mask = defineMask(['a', 'b', 'c', 'd']);
    mask.setFlag('a');
    expect(mask.isFlagActive('a')).toBe(true);
    expect(mask.length).toBe(4);
    expect(mask.getState()).toBe(1);
  });

  it('should check if a bit is active with multiple bits', () => {
    const mask = defineMask(['a', 'b', 'c', 'd']);
    mask.setFlag('a');
    mask.setFlag('b');
    mask.setFlag('c');
    mask.setFlag('d');

    expect(mask.isFlagActive('a')).toBe(true);
    expect(mask.isFlagActive('b')).toBe(true);
    expect(mask.isFlagActive('c')).toBe(true);
    expect(mask.isFlagActive('d')).toBe(true);
    expect(mask.length).toBe(4);
  });

  it('lists active flags', () => {
    const mask = defineMask(['a', 'b', 'c', 'd']);
    mask.setFlag('a');
    mask.setFlag('c');

    expect(mask.listActiveFlags()).toStrictEqual(['a', 'c']);
  });

  it('should return the state', () => {
    const mask = defineMask(['a', 'b', 'c', 'd']);
    mask.setFlag('a');
    mask.setFlag('c');
    expect(mask.getState()).toBe(5);
  });

  it('should set the state', () => {
    const mask = defineMask(['a', 'b', 'c', 'd']);
    mask.setState(0b0001);
    expect(mask.getState()).toBe(1);
    expect(mask.isFlagActive('a')).toBe(true);

    mask.setState(0b0100);
    expect(mask.getState()).toBe(4);
    expect(mask.isFlagActive('a')).toBe(false);
    expect(mask.isFlagActive('c')).toBe(true);

    mask.setState(0b0011);
    expect(mask.getState()).toBe(3);
    expect(mask.isFlagActive('a')).toBe(true);
    expect(mask.isFlagActive('b')).toBe(true);
    expect(mask.isFlagActive('c')).toBe(false);
    expect(mask.isFlagActive('d')).toBe(false);
    expect(mask.length).toBe(4);
  });

  it('should add a flag', () => {
    const mask = defineMask(['a', 'b', 'c', 'd']);
    mask.addFlag('e');
    expect(mask.length).toBe(5);
    expect(mask.isFlagActive('e')).toBe(false);
  });

  it('should maintain state of flags after adding a flag', () => {
    const mask = defineMask(['a', 'b', 'c', 'd']);
    mask.setFlag('a');
    mask.setFlag('c');
    mask.addFlag('e');
    expect(mask.length).toBe(5);
    expect(mask.isFlagActive('a')).toBe(true);
    expect(mask.isFlagActive('c')).toBe(true);
  });

  it('should remove a flag', () => {
    const mask = defineMask(['a', 'b', 'c', 'd']);
    mask.removeFlag('b');
    expect(mask.length).toBe(3);
    expect(mask.isFlagActive('b')).toBe(false);
    expect(mask.setFlag('b')).toBe(false);
  });

  it('should maintain state of flags after removing a flag', () => {
    const mask = defineMask(['a', 'b', 'c', 'd']);
    mask.setFlag('a');
    mask.setFlag('d');
    mask.setFlag('c');
    mask.removeFlag('c');
    expect(mask.length).toBe(3);
    expect(mask.isFlagActive('a')).toBe(true);
    expect(mask.isFlagActive('d')).toBe(true);
    expect(mask.isFlagActive('c')).toBe(false);
  });

  it('should maintain correct integer state and flags', () => {
    // 0b0000
    const mask = defineMask(['a', 'b', 'c', 'd']);
    expect(mask.getState()).toBe(0);

    // 0b1000
    mask.setFlag('d');
    expect(mask.getState()).toBe(8);

    // 0b1100
    mask.setFlag('c');
    expect(mask.getState()).toBe(12);

    // 0b100
    mask.removeFlag('c');
    expect(mask.getState()).toBe(4);

    // 0b0100
    mask.addFlag('e');
    expect(mask.getState()).toBe(4);

    expect(mask.length).toBe(4);
    expect(mask.isFlagActive('a')).toBe(false);
    expect(mask.isFlagActive('b')).toBe(false);
    expect(mask.isFlagActive('d')).toBe(true);
    expect(mask.isFlagActive('c')).toBe(false);
    expect(mask.isFlagActive('e')).toBe(false);

    expect(mask.listAllFlags())
      .toStrictEqual([['a', false], ['b', false], ['d', true], ['e', false]]);
  });

  describe('mask should be able to handle 31 flags', () => {
    const flags = Array.from({ length: 31 }, (_, i) => String.fromCharCode(97 + i));
    const mask = defineMask(flags);

    it('should set all flags', () => {
      for (let i = 0; i < flags.length; i++) {
        mask.setFlag(flags[i]);
        expect(mask.isFlagActive(flags[i])).toBe(true);
      }
      expect(mask.length).toBe(31);
      expect(mask.getState()).toBe(2 ** flags.length - 1);
    });
  });

  it('remove keeps state up to date', () => {
    const mask = defineMask(['a', 'b', 'c', 'd']);
    // Activate all flags
    mask.setState(0b1111);

    // 0b111
    mask.removeFlag('c');
    // 0b11
    mask.removeFlag('b');

    expect(mask.listAllFlags()).toStrictEqual([['a', true], ['d', true]]);
    expect(mask.getState()).toBe(3);
    expect(mask.length).toBe(2);
  });
});

