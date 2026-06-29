import { useEveAgent } from 'eve/vue'

let sharedAgent: any = null

export function useAppAgent() {
  if (!sharedAgent) {
    sharedAgent = useEveAgent()
  }
  return sharedAgent
}
