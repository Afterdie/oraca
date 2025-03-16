import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
export default function TextInput() {
  return (
    <div className="z-50 mx-10 mb-6 flex h-[15vh] w-[500px] items-end justify-between rounded-3xl border bg-white p-2 transition-all duration-300 ease-in-out hover:-translate-y-2">
      <div className="h-full w-full">
        <Textarea
          className="w-full resize-none rounded-3xl border-none focus-visible:ring-0"
          placeholder="Talk to your database"
        />
      </div>
      <div>
        <Button className="rounded-4xl">Run</Button>
      </div>
    </div>
  );
}
