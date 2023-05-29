import { ask } from './ask'

type InferTemplateVariables<T> = T extends `{${infer P}}` ? P : never
type ExtractTemplateVariables<S> =
  S extends `${infer P}{{${infer Q}}}${infer R}`
    ? Q | ExtractTemplateVariables<R>
    : never
type TemplateParams<T> = { [P in ExtractTemplateVariables<T>]: string | number }

function extractVariables<T extends string>(template: T) {
  const regex = /{(.*?)}/g
  let match
  const matches = []

  while ((match = regex.exec(template)) !== null) {
    matches.push(match[1])
  }

  return matches as ExtractTemplateVariables<T>[]
}

class Prompt<T extends string> {
  template: T
  constructor(template: T) {
    this.template = template
  }

  async run(variables: TemplateParams<T>) {
    const response = await ask(this.template, variables)

    return response
  }

  get variables() {
    return extractVariables(this.template)
  }
}

type PromptRegistry = {
  [key: string]: {
    name: string
    description: string
    prompt: Prompt<any>
  }
}

export const prompts: PromptRegistry = {
  translate: {
    name: 'translate',
    description: 'Translate the text',
    prompt: new Prompt(
      `You are a translator. Translate the following sentence into {language}: {input}`
    )
  },
  grammar: {
    name: 'grammar',
    description: 'Correct the sentence',
    prompt: new Prompt(
      `You are a grammar checker. Correct the following sentence: {input}`
    )
  },
  summary: {
    name: 'summary',
    description: 'Summarize the text',
    prompt: new Prompt(
      `You are a summarizer. Summarize the following text: {input}`
    )
  },
  question: {
    name: 'question',
    description: 'Answer a question',
    prompt: new Prompt(
      `You are a question answerer. Answer the following question: {input}`
    )
  },
  adhoc: {
    name: 'adhoc',
    description: 'Custom prompt',
    prompt: new Prompt(`{prompt} {input}`)
  }
}

export type PromptType = keyof typeof prompts
