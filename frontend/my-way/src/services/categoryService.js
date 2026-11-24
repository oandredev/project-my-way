import api from "../api/client";
import { parseApiError } from "../api/errors";

const CATEGORY_URL = "/study-category";

export async function getCategories() {
  try {
    const { data } = await api.get(CATEGORY_URL);
    return Array.isArray(data) ? data : (data?.content ?? []);
  } catch (e) {
    throw new Error(parseApiError(e));
  }
}
