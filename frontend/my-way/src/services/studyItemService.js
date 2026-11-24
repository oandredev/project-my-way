import api from "../api/client";
import { parseApiError } from "../api/errors";

const STUDY_ITEM_URL = "/study-item";

export async function getStudyItems() {
  try {
    const { data } = await api.get(STUDY_ITEM_URL);
    return Array.isArray(data) ? data : (data?.content ?? []);
  } catch (e) {
    throw new Error(parseApiError(e));
  }
}
