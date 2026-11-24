import { useFocusLoad } from "./useFocusLoad";
import { getStudyItems } from "../services/studyItemService";

export function useStudyItems() {
  const { data, ...rest } = useFocusLoad(getStudyItems, []);
  return { items: data, ...rest };
}
