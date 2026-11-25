import { useFocusLoad } from "./useFocusLoad";
import { getCategories } from "../services/categoryService";

export function useCategories() {
  const { data, ...rest } = useFocusLoad(getCategories, []);
  return { categories: data, ...rest };
}
