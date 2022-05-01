export const sleep = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, 5000))
