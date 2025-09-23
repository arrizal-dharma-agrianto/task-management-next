import {
  Dialog,
  DialogContent,

} from "@/components/ui/dialog"
import { WelcomeTab } from "./welcomeTab"

export function Welcome() {
  return (
    <Dialog open>
      <DialogContent className="sm:max-w-3xl sm:min-h-xl max-w-4xl h-72 sm:h-72">
        <WelcomeTab />
      </DialogContent>
    </Dialog>
  )
}
