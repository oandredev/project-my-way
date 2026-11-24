import { useFocusLoad } from "./useFocusLoad";
import { getStudyItems } from "../services/studyItemService";

export function useStudyItems() {
  const { data, setData, ...rest } = useFocusLoad(getStudyItems, []);
  return { items: data, setItems: setData, ...rest };
}
