export async function sleep(number: number) {
  await new Promise((res) => {
    setInterval(() => res({}), number)
  })
}
