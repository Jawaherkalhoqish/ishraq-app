export type Screen =
  | 'splash'
  | 'parent-account'
  | 'child-profile'
  | 'parent-pin-setup'
  | 'parent-onboarding'
  | 'character-select'
  | 'child-home'
  | 'game-select'
  | 'game-store'
  | 'game-balloons'
  | 'game-numberline'
  | 'smart-break'
  | 'wardrobe'
  | 'reward-store'
  | 'achievements'
  | 'progress'
  | 'parent-pin-entry'
  | 'parent-dashboard'
  | 'specialist'
  | 'specialist-booking'
  | 'notifications'
  | 'settings'

export type Character =
  | 'mushriq'
  | 'mushriqa'

export type CharState =
  | 'idle'
  | 'welcome'
  | 'correct'
  | 'incorrect'
  | 'hint'
  | 'celebrating'
  | 'breathing'
  | 'shopping'
  | 'thinking'

export interface ParentAccount {
  name: string
  email: string
}

export interface ChildProfile {
  name: string
  age: number

  gender:
    | 'boy'
    | 'girl'
    | 'no-answer'

  adhdDiagnosis:
    | 'yes'
    | 'no'
    | 'prefer-not'

  // اسم التقرير المرفق إن وُجد
  reportName: string | null

  // هل تم تحليل التقرير؟
  reportAnalyzed: boolean

  // إجابات الأسئلة الأربعة
  // كل سؤال يسمح باختيار أكثر من إجابة
  questionnaireAnswers: Record<string, string[]>
}

export interface ParentProfile {
  attention: string
  mathLevel: string
  learningStyle: string
  childName: string
}

export interface GameStats {
  level: number
  correct: number
  incorrect: number
  attempts: number
  smartBreaks: number
  hintsUsed: number
  avgResponseTime: number
  lastPlayed: string
}

export interface Achievement {
  id: string
  nameAr: string
  descAr: string
  icon: string
  unlocked: boolean
  progress?: number
  total?: number
}

export interface AppNotification {
  id: string
  message: string
  time: string
  read: boolean

  type:
    | 'achievement'
    | 'progress'
    | 'break'
    | 'general'
}

export interface AppState {
  screen: Screen

  prevScreen: Screen | null

  character: Character | null

  stars: number

  parentAccount: ParentAccount | null

  childProfile: ChildProfile | null

  parentPin: string | null

  parentProfile: ParentProfile | null

  gameStats: {
    store: GameStats
    balloons: GameStats
    numberline: GameStats
  }

  achievements: Achievement[]

  notifications: AppNotification[]

  smartBreakTrigger: Screen | null

  equippedItems: string[]
}