import homeJson from "../../../content/home.json";
import siteJson from "../../../content/site.json";
import cvJson from "../../../content/cv.json";
import poradnikJson from "../../../content/poradnik-wizytowka.json";
import type { CvContent, HomeContent, PoradnikContent, SiteContent } from "./types";

export function getSite(): SiteContent {
  return siteJson as SiteContent;
}

export function getHome(): HomeContent {
  return homeJson as HomeContent;
}

export function getCv(): CvContent {
  return cvJson as CvContent;
}

export function getPoradnik(): PoradnikContent {
  return poradnikJson as PoradnikContent;
}
