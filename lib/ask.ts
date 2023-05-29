import { LLMChain } from 'langchain/chains'
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate
} from 'langchain/prompts'
import { getOpenAIKey } from './settings'
import { ChatOpenAI } from 'langchain/chat_models/openai'

export async function ask(prompt: string, variables) {
  console.log('ask', prompt, variables)
  const openAIApiKey = getOpenAIKey()

  const chain = new LLMChain({
    llm: new ChatOpenAI({
      openAIApiKey,
      temperature: 0,
      streaming: true
    }),
    prompt: ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(`
        You are a helpful AI system that run a variety of tasks based on user input.
        Respond only the output text, no explanations or anything.
        Example:
        User: I want to translate this sentence into Spanish: This is an example sentence.
        AI: Esta es una oración de ejemplo.
        User: I want to correct this sentence: This is a example sentence.
        AI: This is an example sentence.
      `),
      HumanMessagePromptTemplate.fromTemplate(prompt)
    ])
  })

  const response = await chain.call(variables)

  return response.text.trim()
}
