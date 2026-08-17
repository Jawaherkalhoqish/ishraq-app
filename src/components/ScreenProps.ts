import type { AppState, Screen, Character, ParentAccount, ChildProfile } from '../types'

export interface ScreenProps {
  state: AppState
  navigate: (screen: Screen) => void
  goBack: () => void
  setCharacter: (character: Character) => void
  addStars: (count: number) => void
  setParentProfile: (profile: AppState['parentProfile']) => void
  setParentAccount: (account: ParentAccount) => void
  setChildProfile: (profile: ChildProfile) => void
  setParentPin: (pin: string) => void
  triggerSmartBreak: (from: Screen) => void
  unlockAchievement: (id: string) => void
  toggleEquip: (itemId: string) => void
  markNotificationRead: (id: string) => void
}
