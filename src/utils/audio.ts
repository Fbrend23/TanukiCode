/**
 * Utility for Japanese Text-to-Speech using the Web Speech API.
 */

/**
 * Finds a suitable Japanese voice from the available list.
 */
const findJapaneseVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  const jaVoices = voices.filter((v) => v.lang.toLowerCase().replace('_', '-') === 'ja-jp')

  if (jaVoices.length > 0) {
    const premiumVoice = jaVoices.find(
      (v) =>
        v.name.includes('Google') ||
        v.name.includes('Premium') ||
        v.name.includes('Natural') ||
        v.name.includes('Online'),
    )
    const selected = premiumVoice || jaVoices[0]
    if (selected) return selected
  }
  return null
}

// Prime the voices list
if (typeof globalThis !== 'undefined' && globalThis.speechSynthesis) {
  globalThis.speechSynthesis.getVoices()
}

/**
 * Speaks the provided text In Japanese.
 * @param text The string to speak (Kana or Kanji)
 * @param rate Speed of speech (default 0.9 for clarity)
 */
/**
 * Speaks the provided text In Japanese.
 * @param text The string to speak (Kana or Kanji)
 * @param rate Speed of speech (default 0.9 for clarity)
 */
export const speakJapanese = (text: string, rate: number = 0.9) => {
  if (typeof globalThis === 'undefined') return

  const encodedText = encodeURIComponent(text)

  // High-reliability Cloud TTS sources
  // 1. Youdao: Fast, reliable, no CORS issues with standard Audio
  // 2. Baidu: Highly robust for Japanese
  // 3. Google: Good quality but sometimes rate-limited or blocked
  const sources: string[] = [
    `https://dict.youdao.com/dictvoice?audio=${encodedText}&le=ja&type=2`,
    `https://tts.baidu.com/text2audio?lan=ja&ie=UTF-8&spd=4&text=${encodedText}`,
    `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encodedText}`,
  ]

  const playSource = (index: number) => {
    // If all cloud sources failed, use Native Fallback
    if (index >= sources.length) {
      playNativeFallback()
      return
    }

    const currentUrl = sources[index]
    if (!currentUrl) return

    const audio = new Audio()
    audio.src = currentUrl
    audio.playbackRate = rate

    // Timeout to skip source if it hangs (e.g., network block without error)
    const playTimeout = setTimeout(() => {
      audio.pause()
      playSource(index + 1)
    }, 2500)

    audio
      .play()
      .then(() => {
        clearTimeout(playTimeout)
      })
      .catch(() => {
        clearTimeout(playTimeout)
        // Silently fail to next source
        playSource(index + 1)
      })
  }

  const playNativeFallback = () => {
    if (globalThis.speechSynthesis) {
      globalThis.speechSynthesis.cancel()
      const voices = globalThis.speechSynthesis.getVoices()
      const voice = findJapaneseVoice(voices)

      const utterance = new SpeechSynthesisUtterance(text)
      if (voice) utterance.voice = voice

      utterance.lang = 'ja-JP'
      utterance.rate = rate
      utterance.pitch = 1

      globalThis.speechSynthesis.speak(utterance)
    }
  }

  playSource(0)
}
