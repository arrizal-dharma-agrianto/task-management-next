import { Printer } from "lucide-react";
import { Button } from "../ui/button";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PrintableProject } from "./project-print";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ProjectPrintButton({ data }: { data: any }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = useReactToPrint({ contentRef: printRef });
  const user = useSelector((state: RootState) => state.user)

  return (
    <>
      <div style={{ display: "none" }}>
        <PrintableProject ref={printRef} data={data} user={user} />
      </div>
      <Button variant="outline" onClick={handleDownload} >
        <Printer className="w-4 h-4 mr-2" />
        Report
      </Button >
    </>

  );
}
