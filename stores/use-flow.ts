import { randomUUID } from 'crypto'
import {
  addEdge,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeChange,
  EdgeChange,
  Connection,
  applyEdgeChanges,
  applyNodeChanges
} from 'reactflow'
import 'reactflow/dist/style.css'
import { create } from 'zustand'
import dagre from 'dagre'

const layout = new dagre.graphlib.Graph()

const nodeWidth = 550
const nodeHeight = 250

function createLayout(nodes: Node[], edges: Edge[]) {
  layout.setGraph({ rankdir: 'LR' })
  layout.setDefaultEdgeLabel(() => ({}))

  nodes.forEach((node) =>
    layout.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
      label: node.id
    })
  )
  edges.forEach((edge) => layout.setEdge(edge.source, edge.target))

  dagre.layout(layout)

  const newNodes: Node[] = nodes.map((node) => {
    const { x, y } = layout.node(node.id)

    return {
      ...node,
      position: {
        x: x - nodeWidth / 2,
        y: y - nodeHeight / 2
      }
    }
  })

  return newNodes
}

const initialNodes = [
  {
    id: 'start',
    type: 'promptNode',
    data: { prompt: '' },
    position: { x: 5, y: 5 }
  }
] as Node[]

const initialEdges = [] as Edge[]

type RFState = {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setNodeData: (id: string, data: any) => void
}

const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    })
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    })
  },
  onConnect: (connection: Connection) => {
    const newEdges = addEdge(connection, get().edges)

    set({
      edges: newEdges
    })
  },
  setNodeData: (id: string, data: any) => {
    const nodes = get().nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...data
          }
        }
      }
      return node
    })
    set({
      nodes
    })
  },
  getNodeData: (id: string) => {
    const node = get().nodes.find((node) => node.id === id)
    return node?.data
  },
  addNode: (parent: string, node: Node) => {
    const nodes = [...get().nodes, node]
    const edges: Edge[] = [
      ...get().edges,
      {
        id: parent + node.id,
        source: parent,
        target: node.id,
        type: 'smoothstep'
      }
    ]
    const newNodes = createLayout(nodes, edges)
    set({
      nodes: newNodes,
      edges: edges
    })
  }
}))

export default useStore
