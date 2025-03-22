export function useModelMacros() {
  function failsToTemperature(fail: number, range: number = 3) {
    const offset = (range - Math.min(range, fail)) * 0.1
    return 0.5 + offset
  }
  return {
    failsToTemperature,
  }
}
