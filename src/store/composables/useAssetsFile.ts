export default function useAssetsFile(path: string) {
  return new URL(`../assets/files/${path}`, import.meta.url).href;
}
