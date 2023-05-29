import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { prompts } from '@/lib/prompts'
import useStore from '@/stores/use-flow'
import { usePromptDialog } from '@/stores/use-prompt-dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { shallow } from 'zustand/shallow'

export function PromptDialog() {
  const { nodeId, open, promptType, setOpen } = usePromptDialog(
    (state) => ({
      nodeId: state.nodeId,
      open: state.open,
      promptType: state.promptType,
      setOpen: state.setOpen
    }),
    shallow
  )
  const setNodeData = useStore((state) => state.setNodeData)
  const prompt = prompts[promptType]
  const variables = prompt?.prompt.variables

  if (!prompt) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      promptType: promptType,
      variables: variables
        .filter((v) => v !== 'input')
        .map((variable) => ({
          name: variable,
          value: (e.currentTarget[variable] as HTMLInputElement).value
        }))
    }
    setNodeData(nodeId, data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add {prompt.name} prompt</DialogTitle>
            <DialogDescription>{prompt.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {variables
              .filter((f) => f !== 'input')
              .map((variable) => (
                <div
                  className="grid items-center grid-cols-4 gap-4"
                  key={variable}
                >
                  <Label htmlFor={variable} className="text-right">
                    {variable}
                  </Label>
                  <Input
                    id={variable}
                    placeholder={'write value for ' + variable}
                    className="col-span-3"
                  />
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button type="submit">Apply</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
