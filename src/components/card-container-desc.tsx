import * as React from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { File, X } from "lucide-react";
import root from 'react-shadow';
import { Button } from "./ui/button";

export default function CardConDescription({ desc }: { desc: string }) {
  const [open, setOpen] = React.useState(false);

  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span onClick={() => setOpen(true)}>
          <File className="w-4 cursor-pointer text-muted-foreground hover:text-inherit" />
        </span>
      </DialogTrigger>
      <DialogContent
        className="max-w-screen-lg h-[90vh] py-4 px-6  bg-white text-black shadow-2xl rounded-xl z-50 gap-0 flex flex-col"
      >
        <div className="flex items-center h-fit justify-between border-b pb-2">
          <span className="text-lg font-semibold">Description Task</span>
          <div>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted-foreground hover:text-inherit" />
            </Button>
          </div>
        </div>
        <div className="overflow-auto h-full">
          <root.div className="mt-2">
            <div
              dangerouslySetInnerHTML={{ __html: desc }}
              className="w-full h-full"
            />
            <style>
              {`
                img {
                  max-width: 100%;
                  max-height: 500px;
                  display: block;
                  margin: 0 auto;
                  padding: 0px;
                }
                p, li, div {
                  text-align: left;
                  margin: 0;
                  padding: 0;
                  font-size: 1rem;
                  line-height: 1.6;
                  color: #222;
                  word-break: break-word;
                  overflow-wrap: break-word;
                }
                p.ql-align-center {
                  text-align: center !important;  
                }
                ul {
                  list-style: disc inside;
                  padding: 0;
                  margin: 0;
                }
              `}
            </style>
          </root.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
