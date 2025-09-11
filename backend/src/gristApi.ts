import { GristDocAPI } from "grist-api";

const gristUrl = Bun.env["GRIST_DOC_URL"]!;
if (!gristUrl) {
  throw new Error("Missing GRIST_DOC_URL in environment variables");
}
export const gristApi = new GristDocAPI(gristUrl);
