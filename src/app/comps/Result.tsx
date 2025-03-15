import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Result() {
  const val = useSelector((state: RootState) => state.queryOutput);
  const res = val.value;
  if (!res || res.length === 0) return <p>No rows selected</p>;
  const rowCount = res[0].values.length;
  const colHeadValue = res[0].columns;
  const rowValues = res[0].values;
  const duration = val.duration;
  console.log(duration);
  return (
    <div>
      <div className="text-muted-foreground mb-2 flex justify-between">
        <p>{`Displaying ${rowCount} row${rowCount === 1 ? "" : "s"}`}</p>
        <p>Executed in {duration} milliseconds</p>
      </div>
      <div className="border-accent-foreground/45 overflow-hidden rounded-xl border-[1px]">
        <Table>
          <TableHeader>
            <TableRow>
              {colHeadValue.map((c, index) => {
                return (
                  <TableHead key={index} className="bg-muted">
                    {c}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rowValues.map((r, index) => {
              return (
                <TableRow key={index}>
                  {r.map((c, cindex) => {
                    return <TableCell key={cindex}>{c}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
