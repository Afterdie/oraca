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
  if (!res)
    return (
      <Card className="h-full w-full">
        {/* add som eimage or something here */}
      </Card>
    );
  if (res.length === 0)
    return (
      <Card className="h-full w-full">
        <CardContent>
          <div className="text-muted-foreground mb-2 flex justify-between">
            <p>No rows selected</p>
            <p>Executed in {val.duration} milliseconds</p>
          </div>
        </CardContent>
      </Card>
    );

  const rowCount = res.length;
  const columnNames = Object.keys(res[0]);
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
                  {columnNames.map((colName, index) => {
                    return (
                      <TableHead key={index} className="bg-muted">
                        {colName}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {res.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      {columnNames.map((colName, colIndex) => {
                        return (
                          <TableCell key={colIndex}>
                            {displayableValue(row[colName])}
                          </TableCell>
                        );
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

const displayableValue = (
  c:
    | string
    | number
    | boolean
    | null
    | Date
    | Array<string | number | boolean | null | Date | Record<string, unknown>>
    | Record<string, unknown>,
) => {
  let displayValue: string;

  if (c instanceof Date) {
    displayValue = c.toISOString();
  } else if (c === null) {
    displayValue = "N/A";
  } else if (Array.isArray(c) || typeof c === "object") {
    displayValue = JSON.stringify(c);
  } else {
    displayValue = String(c);
  }

  return displayValue;
};
export default Result;
