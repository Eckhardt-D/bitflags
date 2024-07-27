type Mask = { [key: string]: number }

export function defineMask(input: Array<string>) {
  if (input.length >= 32) {
    throw new Error('Mask length must be less than 32');
  }

  let _state = 0b0
  const mask: Mask = {}
  let length = input.length;

  for (let i = 0; i < length; i++) {
    mask[input[i]] = 1 << i
  }

  function isFlagActive(key: string): boolean {
    const bit = mask[key]
    if (!bit) return false
    return (bit & _state) !== 0
  }

  function setFlag(key: string): boolean {
    const bit = mask[key]

    if (bit === undefined) {
      return false
    }

    _state |= bit
    return true
  }

  function clearFlag(key: string): boolean {
    const bit = mask[key]

    if (bit === undefined) {
      return false
    }

    _state &= ~bit
    return true
  }

  function listActiveFlags(): Array<string> {
    const activeFlags: Array<string> = []

    for (const key in mask) {
      if (isFlagActive(key)) {
        activeFlags.push(key)
      }
    }

    return activeFlags
  }

  function listAllFlags(): Array<[string, boolean]> {
    const allFlags: Array<[string, boolean]> = []

    for (const key in mask) {
      allFlags.push([key, isFlagActive(key)])
    }

    return allFlags
  }

  function getState(): number {
    return _state
  }

  function setState(state: number): void {
    if (state < 0) {
      state = 0
    }

    _state = Math.min(state, Math.pow(2, length) - 1)
  }

  function addFlag(key: string) {
    mask[key] = 1 << length
    length++
  }

  function removeFlag(key: string) {
    // Remove the key from the mask
    delete mask[key]
    length--

    // Rebuild the mask keys and state
    let i = 0;
    let newState = 0b0
    for (const key in mask) {
      mask[key] = 1 << i
      if (isFlagActive(key)) {
        newState |= mask[key]
      }
      i++
    }

    _state = newState
  }

  return {
    get length() {
      return length
    },
    isFlagActive,
    setFlag,
    clearFlag,
    listActiveFlags,
    listAllFlags,
    getState,
    setState,
    addFlag,
    removeFlag
  }
}

