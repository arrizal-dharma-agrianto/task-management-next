import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export function Agreement() {
  const [openTos, setOpenTos] = React.useState(false)
  const [openPrivacy, setOpenPrivacy] = React.useState(false)

  return (
    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
      By continue, you agree to our{" "}
      <a href="#" onClick={e => { e.preventDefault(); setOpenTos(true) }}>Terms of Service</a>{" "}
      and{" "}
      <a href="#" onClick={e => { e.preventDefault(); setOpenPrivacy(true) }}>Privacy Policy</a>.
      
      {/* Terms of Service Modal */}
      <Dialog open={openTos} onOpenChange={setOpenTos}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Terms of Service</DialogTitle>
            <DialogDescription>
              <ul className="list-disc pl-4 space-y-2 text-left">
              <li>Users must keep their account secure and not share login credentials.</li>
              <li>Each workspace, project, and task created is the user&apos;s responsibility.</li>
              <li>It is prohibited to use the application for illegal activities or spam.</li>
              <li>The developers reserve the right to change features at any time.</li>
              <li>Notifications are only used for purposes related to task management activities.</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenTos(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={openPrivacy} onOpenChange={setOpenPrivacy}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Privacy Policy</DialogTitle>
            <DialogDescription>
              <ul className="list-disc pl-4 space-y-2 text-left">
                <li>User data (email, name, tasks, etc.) is securely stored in the database.</li>
                <li>We do not share personal data with third parties without user consent.</li>
                <li>Users can delete their account and data at any time via settings.</li>
                <li>Activity data is used to improve services and user experience.</li>
                <li>Notifications are sent within the scope of the application.</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenPrivacy(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}