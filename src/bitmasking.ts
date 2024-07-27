type Mask = { [key: string]: number }

export function defineMask(input: Array<string>) {
  if (input.length >= 32) {
    throw new Error('Mask length must be less than 32');
  }

  let _state = 0b0
  const mask: Mask = {}

  for (let i = 0; i < input.length; i++) {
    mask[input[i]] = 1 << i
  }

  function isFlagActive(key: string): boolean {
    const bit = mask[key]
    if (!bit) return false
    return (bit & _state) !== 0
  }

  function setFlag(key: string): number {
    const bit = mask[key]

    if (bit === undefined) {
      throw new Error(`Key ${key} does not exist in mask`)
    }

    _state |= bit
    return _state
  }

  function clearFlag(key: string): number {
    const bit = mask[key]

    if (bit === undefined) {
      throw new Error(`Key ${key} does not exist in mask`)
    }

    _state &= ~bit
    return _state
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
    _state = state
  }

  function addFlag(key: string) {
    mask[key] = 1 << Object.keys(mask).length
  }

  function removeFlag(key: string) {
    // Remove the key from the mask
    delete mask[key]

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

