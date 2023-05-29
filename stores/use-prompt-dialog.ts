import { PromptType } from '@/lib/prompts'
import { create } from 'zustand'

type State = {
  nodeId?: string
  open: boolean
  promptType?: PromptType
}

type Actions = {
  setOpen: (open: boolean) => void
  openPrompt: (nodeId: string, promptType: PromptType) => void
}

export const usePromptDialog = create<State & Actions>((set) => ({
  open: false,
  promptType: null,
  setOpen: (open: boolean) => set({ open }),
  openPrompt: (nodeId: string, promptType: PromptType) =>
    set({ nodeId, open: true, promptType })
}))
