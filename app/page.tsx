'use client'
import useStore from '@/stores/use-flow'
import React, { useMemo } from 'react'
import ReactFlow, { MiniMap, Background, ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'
import { shallow } from 'zustand/shallow'
import { PromptDialog } from '@/components/flow/prompt-dialog'
import { PromptNode } from '@/components/flow/prompt-node'

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  setNodeData: state.setNodeData
})

const ArkFlow = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    selector,
    shallow
  )

  const nodeTypes = useMemo(() => ({ promptNode: PromptNode }), [])

  console.log({ nodes, edges })

  return (
    <ReactFlowProvider>
      <PromptDialog />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          maxZoom: 1
        }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.5}
      >
        <Background />
      </ReactFlow>
    </ReactFlowProvider>
  )
}

export default ArkFlow
