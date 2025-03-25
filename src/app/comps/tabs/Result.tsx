"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { saveAs } from "file-saver";
import { utils, writeFile } from "xlsx";
import Papa from "papaparse";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Result = () => {
  const val = useSelector((state: RootState) => state.queryOutput);
  const res = val.value;

  if (!res)
    return (
      <div className="relative flex h-full w-full justify-center">
        <div className="text-secondary relative z-50 flex h-[80%] flex-col items-center justify-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <Image
              src="/images/icons/result.gif"
              alt="Chatting icon"
              height={150}
              width={150}
              priority
            />
            <h2 className="text-3xl font-semibold">Start Querying 📝</h2>
          </div>
          <p className="italic opacity-70">
            Type ---message--- to generate queries
          </p>
        </div>
        <div
          className="absolute inset-0 z-0 h-full w-full"
          style={{
            WebkitMaskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 100%)",
            maskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div className="h-full w-full bg-transparent bg-[radial-gradient(circle,rgba(255,255,255,0.6)_0.7px,transparent_0.7px)] bg-[size:15px_15px]"></div>
        </div>
      </div>
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

  // Export Handlers
  const exportToJSON = () => {
    const jsonBlob = new Blob([JSON.stringify(res, null, 2)], {
      type: "application/json",
    });
    saveAs(jsonBlob, "export.json");
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(res);
    const csvBlob = new Blob([csv], { type: "text/csv" });
    saveAs(csvBlob, "export.csv");
  };

  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(res);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    writeFile(workbook, "export.xlsx");
  };

  return (
    <Card className="h-full w-full gap-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Queried Results</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Formats</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportToJSON}>JSON</DropdownMenuItem>
              <DropdownMenuItem onClick={exportToCSV}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="h-full w-full overflow-hidden">
        <div className="text-muted-foreground mb-2 flex justify-between">
          <p>{`Displaying ${rowCount} row${rowCount === 1 ? "" : "s"}`}</p>
          <p>Executed in {duration} milliseconds</p>
        </div>
        <div className="h-full w-full overflow-auto">
          <Table className="border-accent-foreground/45 rounded-xl border">
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
