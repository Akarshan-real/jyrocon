

import Sound from 'react-native-sound';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

Sound.setCategory('Playback', true);

const HAPTIC_OPTIONS = { enableVibrateFallback: true, ignoreAndroidSystemSettings: false };

function loadSound(filename: string): Sound | null {
  try {
    return new Sound(filename, Sound.MAIN_BUNDLE, (err) => {
      if (err) {
        console.warn(`[feedback] Failed to load sound: ${filename}`, err);
      }
    });
  } catch (e) {
    console.warn(`[feedback] Sound init error for ${filename}`, e);
    return null;
  }
}

let _clickSound: Sound | null = null;
let _brakeSound: Sound | null = null;

function getClickSound(): Sound | null {
  if (!_clickSound) { _clickSound = loadSound('click.mp3'); }
  return _clickSound;
}

function getBrakeSound(): Sound | null {
  if (!_brakeSound) { _brakeSound = loadSound('brake.mp3'); }
  return _brakeSound;
}

export function feedbackArrowPress(): void {
  ReactNativeHapticFeedback.trigger('impactLight', HAPTIC_OPTIONS);
  const s = getClickSound();
  if (s) {
    s.stop();
    s.play();
  }
}

export function feedbackBrakePress(): void {
  ReactNativeHapticFeedback.trigger('impactHeavy', HAPTIC_OPTIONS);
  const s = getBrakeSound();
  if (s) {
    s.stop();
    s.play();
  }
}

export function feedbackBrakeRelease(): void {
  ReactNativeHapticFeedback.trigger('impactMedium', HAPTIC_OPTIONS);
}

export function feedbackModeChange(): void {
  ReactNativeHapticFeedback.trigger('notificationSuccess', HAPTIC_OPTIONS);
}
