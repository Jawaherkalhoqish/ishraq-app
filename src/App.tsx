import { useState, useCallback, useEffect, type ReactNode } from 'react'
import type {
  AppState,
  Screen,
  Character,
  Achievement,
  AppNotification,
  ParentAccount as ParentAccountType,
  ChildProfile,
} from './types'

import SplashScreen from './screens/SplashScreen'
import ParentAccount from './screens/ParentAccount'
import ChildProfileScreen from './screens/ChildProfile'
import ParentPinSetup from './screens/ParentPinSetup'
import ParentOnboarding from './screens/ParentOnboarding'
import CharacterSelect from './screens/CharacterSelect'
import ChildHome from './screens/ChildHome'
import GameSelect from './screens/GameSelect'
import GameStore from './screens/GameStore'
import GameBalloons from './screens/GameBalloons'
import GameNumberLine from './screens/GameNumberLine'
import SmartBreak from './screens/SmartBreak'
import Wardrobe from './screens/Wardrobe'
import RewardStore from './screens/RewardStore'
import Achievements from './screens/Achievements'
import Progress from './screens/Progress'
import ParentPinEntry from './screens/ParentPinEntry'
import ParentDashboard from './screens/ParentDashboard'
import Specialist from './screens/Specialist'
import Notifications from './screens/Notifications'
import Settings from './screens/Settings'
import { sounds, playSound } from './sounds/sound'

const defaultAchievements: Achievement[] = [
  {
    id: 'first_adventure',
    nameAr: 'أول مغامرة',
    descAr: 'العب لعبتك الأولى',
    icon: 'star',
    unlocked: false,
  },
  {
    id: 'ten_stars',
    nameAr: 'أول ١٠ نجوم',
    descAr: 'اجمع ١٠ نجوم',
    icon: 'star',
    unlocked: false,
    progress: 0,
    total: 10,
  },
  {
    id: 'store_hero',
    nameAr: 'بطل الجمع',
    descAr: 'أكمل ٣ جولات في متجر مشرق',
    icon: 'trophy',
    unlocked: false,
    progress: 0,
    total: 3,
  },
  {
    id: 'balloon_hero',
    nameAr: 'بطل الطرح',
    descAr: 'أكمل ٣ جولات في بالونات مشرق',
    icon: 'balloon',
    unlocked: false,
    progress: 0,
    total: 3,
  },
  {
    id: 'number_expert',
    nameAr: 'خبير الأعداد',
    descAr: 'أكمل ٣ جولات في خط الأعداد',
    icon: 'number',
    unlocked: false,
    progress: 0,
    total: 3,
  },
  {
    id: 'level_up',
    nameAr: 'ارتقِ عالياً',
    descAr: 'وصل للمستوى الثاني في أي لعبة',
    icon: 'rocket',
    unlocked: false,
  },
  {
    id: 'perfect_round',
    nameAr: 'جولة مثالية',
    descAr: 'أجب على ٥ أسئلة صحيحة متتالية',
    icon: 'gem',
    unlocked: false,
  },
  {
    id: 'explorer',
    nameAr: 'المستكشف',
    descAr: 'جرّب الألعاب الثلاث',
    icon: 'map',
    unlocked: false,
    progress: 0,
    total: 3,
  },
]

const defaultNotifications: AppNotification[] = [
  {
    id: '1',
    message: 'أحسنت! أكمل طفلك جولة جديدة في متجر مشرق.',
    time: 'منذ ٥ دقائق',
    read: false,
    type: 'progress',
  },
  {
    id: '2',
    message: 'تم فتح إنجاز جديد: "أول مغامرة"!',
    time: 'منذ ١٠ دقائق',
    read: false,
    type: 'achievement',
  },
  {
    id: '3',
    message: 'حقق الطفل تقدمًا رائعًا في مهارة الجمع.',
    time: 'أمس',
    read: true,
    type: 'progress',
  },
]

const initialState: AppState = {
  screen: 'splash',
  prevScreen: null,

  character: null,

  stars: 12,

  parentAccount: null,

  childProfile: null,

  parentPin: null,

  parentProfile: null,

  gameStats: {
    store: {
      level: 1,
      correct: 8,
      incorrect: 2,
      attempts: 10,
      smartBreaks: 0,
      hintsUsed: 3,
      avgResponseTime: 8,
      lastPlayed: 'اليوم',
    },

    balloons: {
      level: 1,
      correct: 5,
      incorrect: 3,
      attempts: 8,
      smartBreaks: 1,
      hintsUsed: 2,
      avgResponseTime: 11,
      lastPlayed: 'أمس',
    },

    numberline: {
      level: 1,
      correct: 6,
      incorrect: 1,
      attempts: 7,
      smartBreaks: 0,
      hintsUsed: 1,
      avgResponseTime: 7,
      lastPlayed: 'اليوم',
    },
  },

  achievements: defaultAchievements,

  notifications: defaultNotifications,

  smartBreakTrigger: null,

  equippedItems: [],
}

export default function App() {
  const [state, setState] = useState<AppState>(initialState)

  /*
   * Welcome sound on app load
   */
  useEffect(() => {
    playSound(sounds.welcomeJingle)
  }, [])

  /*
   * Navigation
   */
  const navigate = useCallback((screen: Screen) => {
    setState(current => ({
      ...current,
      prevScreen: current.screen,
      screen,
    }))
  }, [])

  const goBack = useCallback(() => {
    setState(current => ({
      ...current,
      screen: current.prevScreen || 'child-home',
      prevScreen: null,
    }))
  }, [])

  /*
   * Character
   */
  const setCharacter = useCallback((character: Character) => {
    setState(current => ({
      ...current,
      character,
    }))
  }, [])

  /*
   * Stars
   */
  const addStars = useCallback((count: number) => {
    playSound(sounds.starSound)

    setState(current => {
      const newStars = Math.max(0, current.stars + count)

      const updatedAchievements = current.achievements.map(
        achievement => {
          if (achievement.id === 'ten_stars') {
            const progress = Math.min(newStars, 10)

            if (newStars >= 10 && !achievement.unlocked) {
              playSound(sounds.levelUp)
            }

            return {
              ...achievement,
              progress,
              unlocked: newStars >= 10,
            }
          }

          return achievement
        },
      )

      return {
        ...current,
        stars: newStars,
        achievements: updatedAchievements,
      }
    })
  }, [])

  /*
   * Parent profile
   */
  const setParentProfile = useCallback(
    (profile: AppState['parentProfile']) => {
      setState(current => ({
        ...current,
        parentProfile: profile,
      }))
    },
    [],
  )

  /*
   * Parent account
   */
  const setParentAccount = useCallback(
    (account: ParentAccountType) => {
      setState(current => ({
        ...current,
        parentAccount: account,
      }))
    },
    [],
  )

  /*
   * Child profile
   */
  const setChildProfile = useCallback(
    (profile: ChildProfile) => {
      setState(current => ({
        ...current,
        childProfile: profile,
      }))
    },
    [],
  )

  /*
   * Parent PIN
   */
  const setParentPin = useCallback((pin: string) => {
    setState(current => ({
      ...current,
      parentPin: pin,
    }))
  }, [])

  /*
   * Smart Break
   */
  const triggerSmartBreak = useCallback((from: Screen) => {
    setState(current => ({
      ...current,
      smartBreakTrigger: from,
      prevScreen: current.screen,
      screen: 'smart-break',
    }))
  }, [])

  /*
   * Achievements
   */
  const unlockAchievement = useCallback((id: string) => {
    playSound(sounds.achievementUnlock)

    setState(current => ({
      ...current,
      achievements: current.achievements.map(
        achievement =>
          achievement.id === id
            ? {
                ...achievement,
                unlocked: true,
              }
            : achievement,
      ),
    }))
  }, [])

  /*
   * Wardrobe / Equipped Items
   */
  const toggleEquip = useCallback((itemId: string) => {
    setState(current => ({
      ...current,

      equippedItems: current.equippedItems.includes(itemId)
        ? current.equippedItems.filter(
            item => item !== itemId,
          )
        : [...current.equippedItems, itemId],
    }))
  }, [])

  /*
   * Notifications
   */
  const markNotificationRead = useCallback((id: string) => {
    playSound(sounds.notification)

    setState(current => ({
      ...current,

      notifications: current.notifications.map(
        notification =>
          notification.id === id
            ? {
                ...notification,
                read: true,
              }
            : notification,
      ),
    }))
  }, [])

  /*
   * Shared props for all screens
   */
  const props = {
    state,
    navigate,
    goBack,
    setCharacter,
    addStars,
    setParentProfile,
    setParentAccount,
    setChildProfile,
    setParentPin,
    triggerSmartBreak,
    unlockAchievement,
    toggleEquip,
    markNotificationRead,
  }

  /*
   * Screens
   */
  const screens: Record<Screen, ReactNode> = {
    splash: <SplashScreen {...props} />,

    'parent-account': (
      <ParentAccount {...props} />
    ),

    'child-profile': (
      <ChildProfileScreen {...props} />
    ),

    'parent-pin-setup': (
      <ParentPinSetup {...props} />
    ),

    'parent-onboarding': (
      <ParentOnboarding {...props} />
    ),

    'character-select': (
      <CharacterSelect {...props} />
    ),

    'child-home': (
      <ChildHome {...props} />
    ),

    'game-select': (
      <GameSelect {...props} />
    ),

    'game-store': (
      <GameStore {...props} />
    ),

    'game-balloons': (
      <GameBalloons {...props} />
    ),

    'game-numberline': (
      <GameNumberLine {...props} />
    ),

    'smart-break': (
      <SmartBreak {...props} />
    ),

    wardrobe: (
      <Wardrobe {...props} />
    ),

    'reward-store': (
      <RewardStore {...props} />
    ),

    achievements: (
      <Achievements {...props} />
    ),

    progress: (
      <Progress {...props} />
    ),

    'parent-pin-entry': (
      <ParentPinEntry {...props} />
    ),

    'parent-dashboard': (
      <ParentDashboard {...props} />
    ),

    specialist: (
      <Specialist {...props} />
    ),

    'specialist-booking': (
      <Specialist {...props} />
    ),

    notifications: (
      <Notifications {...props} />
    ),

    settings: (
      <Settings {...props} />
    ),
  }

  /*
   * App container
   */
  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      {screens[state.screen]}
    </div>
  )
}