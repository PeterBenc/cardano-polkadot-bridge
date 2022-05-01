export const wait = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, 5000))
