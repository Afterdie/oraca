"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Result = () => {
  const val = useSelector((state: RootState) => state.queryOutput);
  const res = val.value;
  if (!res) return <></>;
  if (res.length === 0)
    return (
      <div className="text-muted-foreground mb-2 flex justify-between">
        <p>No rows selected</p>
        <p>Executed in {val.duration} milliseconds</p>
      </div>
    );
  const rowCount = res[0].values.length;
  const colHeadValue = res[0].columns;
  const rowValues = res[0].values;
  const duration = val.duration;

  return (
    <Card className="h-full w-full gap-2">
      <CardHeader>
        <CardTitle>Queried Results</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default Result;
