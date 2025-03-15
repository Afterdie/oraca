import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Result() {
  const result = useSelector((state: RootState) => state.queryOutput.value);
  console.log(result);
  return <div></div>;
}
