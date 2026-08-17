import achievementUnlock from './achievement-unlock.mp3'
import levelUp from './level-up.mp3'
import notification from './notification.mp3'
import pinCorrect from './pin-correct.mp3'
import pinError from './pin-error.mp3'
import purchaseItem from './purchase-item.mp3'
import roundComplete from './round-complete.mp3'
import starSound from './star-sound.mp3'
import storeOpen from './store-open.mp3'
import welcomeJingle from './welcome-jingle.mp3'

export const sounds = {
  achievementUnlock,
  levelUp,
  notification,
  pinCorrect,
  pinError,
  purchaseItem,
  roundComplete,
  starSound,
  storeOpen,
  welcomeJingle,
}

export function playSound(sound: string) {
  const audio = new Audio(sound)
  audio.currentTime = 0
  audio.play().catch(() => {})
}