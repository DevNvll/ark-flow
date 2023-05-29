'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import useStore from '@/stores/use-flow'

import React, { useMemo, useState } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import 'reactflow/dist/style.css'
import { shallow } from 'zustand/shallow'
import { v4 as uuidv4 } from 'uuid'

import { usePromptDialog } from '@/stores/use-prompt-dialog'
import { Keyboard, Languages, List, Quote } from 'lucide-react'
import { prompts } from '@/lib/prompts'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Toggle } from '@/components/ui/toggle'

const selector = (state) => ({
  edges: state.edges,
  addNode: state.addNode,
  setNodeData: state.setNodeData
})

export function PromptNode({ id, data }: NodeProps) {
  const [loading, setLoading] = useState(false)
  const { addNode, setNodeData, edges } = useStore(selector, shallow)
  const { openDialog } = usePromptDialog(
    (state) => ({
      openDialog: state.openPrompt
    }),
    shallow
  )

  async function generatePrompt() {
    const { prompt, variables, promptType } = data

    setLoading(true)

    const promptVariables = variables.reduce(
      (acc, variable) => ({
        ...acc,
        [variable.name]: variable.value
      }),
      { input: prompt }
    )

    const response = await prompts[promptType].prompt.run(promptVariables)

    addNode(id, {
      id: uuidv4(),
      type: 'promptNode',
      data: { prompt: response, promptType: null, variables: [] }
    })

    setLoading(false)
  }

  const handleAddPrompt = (promptType) => {
    if (data.promptType === promptType) {
      setNodeData(id, {
        promptType: null,
        variables: []
      })
      return
    }

    const promptVariables = prompts[promptType].prompt.variables.filter(
      (variable) => variable !== 'input'
    )

    if (promptVariables.length) {
      openDialog(id, promptType)
    } else {
      setNodeData(id, {
        promptType: promptType,
        variables: []
      })
    }
  }

  const hasConnection = edges.some((edge) => edge.source === id)

  return (
    <>
      {id === 'start' ? null : (
        <Handle
          type="target"
          position={Position.Left}
          isConnectableStart={false}
        />
      )}

      <div
        className="max-w-sm p-[1.5px] mx-auto my-4 rounded-[--radius] bg-gradient-to-r from-[#f9655b] to-[#8711c1]"
        style={{
          width: '550px'
        }}
      >
        <div className="p-5 bg-black rounded-[--radius] backdrop-blur-2xl">
          <h2 className="mb-2 text-2xl font-semibold">Prompt</h2>
          <Textarea
            id="text"
            name="prompt"
            className="w-full nodrag"
            value={data.prompt}
            onChange={(e) => {
              setNodeData(id, { prompt: e.target.value })
            }}
          />
          <div className="flex py-2 space-x-4">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Toggle
                    className="rounded-full"
                    onClick={() => handleAddPrompt('translate')}
                    pressed={data.promptType === 'translate'}
                  >
                    <Languages />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Translate text</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Toggle
                    className="rounded-full"
                    onClick={() => handleAddPrompt('grammar')}
                    pressed={data.promptType === 'grammar'}
                  >
                    <Quote />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Correct grammar</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Toggle
                    className="rounded-full"
                    onClick={() => handleAddPrompt('summary')}
                    pressed={data.promptType === 'summary'}
                  >
                    <List />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Summarise text</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Toggle
                    className="rounded-full"
                    onClick={() => handleAddPrompt('adhoc')}
                    pressed={data.promptType === 'adhoc'}
                  >
                    <Keyboard />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ad-hoc prompt</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex justify-end w-full mt-4">
            <Button
              disabled={!data.prompt || data.promptType === null || loading}
              className="nodrag"
              type="submit"
              variant="ghost"
              onClick={generatePrompt}
            >
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectableStart={false}
        style={{
          opacity: hasConnection ? 1 : 0
        }}
      />
    </>
  )
}
