export default function sleep(m: number) {
  return new Promise((r) => setTimeout(r, m));
}
