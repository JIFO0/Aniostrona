import cvAsset from "@/assets/cv.pdf.asset.json";

export function getCvAssetUrl(baseUrl: string): string {
  return new URL(cvAsset.url, baseUrl).toString();
}
