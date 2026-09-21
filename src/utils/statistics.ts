export type InputStatisticsSource = 'keyboard' | 'mouse'
export type InputStatisticsHand = 'left' | 'right' | 'neutral'

export interface InputStatisticsKey {
  source: InputStatisticsSource
  id: string
}

export interface KeyboardLayoutKey {
  id: string
  label: string
  width: number
  hand: InputStatisticsHand
}

const keyboardKeyLabels: Record<string, string> = {
  Escape: 'Esc',
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12',
  PrintScreen: 'PrtSc',
  ScrollLock: 'Scroll',
  Pause: 'Pause',
  Backquote: '`',
  Digit1: '1',
  Digit2: '2',
  Digit3: '3',
  Digit4: '4',
  Digit5: '5',
  Digit6: '6',
  Digit7: '7',
  Digit8: '8',
  Digit9: '9',
  Digit0: '0',
  Minus: '-',
  Equal: '=',
  Backspace: 'Backspace',
  Tab: 'Tab',
  KeyQ: 'Q',
  KeyW: 'W',
  KeyE: 'E',
  KeyR: 'R',
  KeyT: 'T',
  KeyY: 'Y',
  KeyU: 'U',
  KeyI: 'I',
  KeyO: 'O',
  KeyP: 'P',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  CapsLock: 'Caps',
  KeyA: 'A',
  KeyS: 'S',
  KeyD: 'D',
  KeyF: 'F',
  KeyG: 'G',
  KeyH: 'H',
  KeyJ: 'J',
  KeyK: 'K',
  KeyL: 'L',
  Semicolon: ';',
  Quote: '\'',
  Enter: 'Enter',
  ShiftLeft: 'Shift',
  KeyZ: 'Z',
  KeyX: 'X',
  KeyC: 'C',
  KeyV: 'V',
  KeyB: 'B',
  KeyN: 'N',
  KeyM: 'M',
  Comma: ',',
  Period: '.',
  Slash: '/',
  ShiftRight: 'RShift',
  ControlLeft: 'Ctrl',
  MetaLeft: 'Meta',
  AltLeft: 'Alt',
  Space: 'Space',
  AltRight: 'AltGr',
  MetaRight: 'RMeta',
  ContextMenu: 'Menu',
  ControlRight: 'RCtrl',
  Insert: 'Ins',
  Home: 'Home',
  PageUp: 'PgUp',
  Delete: 'Del',
  End: 'End',
  PageDown: 'PgDn',
  ArrowUp: 'Up',
  ArrowLeft: 'Left',
  ArrowDown: 'Down',
  ArrowRight: 'Right',
  NumLock: 'Num',
  NumpadDivide: '/',
  NumpadMultiply: '*',
  NumpadSubtract: '-',
  NumpadAdd: '+',
  NumpadEnter: 'Enter',
  NumpadDecimal: '.',
  Numpad0: 'Num0',
  Numpad1: 'Num1',
  Numpad2: 'Num2',
  Numpad3: 'Num3',
  Numpad4: 'Num4',
  Numpad5: 'Num5',
  Numpad6: 'Num6',
  Numpad7: 'Num7',
  Numpad8: 'Num8',
  Numpad9: 'Num9',
  IntlBackslash: 'Intl\\',
  Fn: 'Fn',
}

const mouseButtonLabels: Record<string, string> = {
  Left: 'LMB',
  Right: 'RMB',
  Middle: 'MMB',
}

const leftHandKeyboardIds = new Set([
  'Escape',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'Backquote',
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
  'Digit5',
  'Tab',
  'KeyQ',
  'KeyW',
  'KeyE',
  'KeyR',
  'KeyT',
  'CapsLock',
  'KeyA',
  'KeyS',
  'KeyD',
  'KeyF',
  'KeyG',
  'ShiftLeft',
  'KeyZ',
  'KeyX',
  'KeyC',
  'KeyV',
  'KeyB',
  'ControlLeft',
  'MetaLeft',
  'AltLeft',
])

const rightHandKeyboardIds = new Set([
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'PrintScreen',
  'ScrollLock',
  'Pause',
  'Digit6',
  'Digit7',
  'Digit8',
  'Digit9',
  'Digit0',
  'Minus',
  'Equal',
  'Backspace',
  'KeyY',
  'KeyU',
  'KeyI',
  'KeyO',
  'KeyP',
  'BracketLeft',
  'BracketRight',
  'Backslash',
  'KeyH',
  'KeyJ',
  'KeyK',
  'KeyL',
  'Semicolon',
  'Quote',
  'Enter',
  'KeyN',
  'KeyM',
  'Comma',
  'Period',
  'Slash',
  'ShiftRight',
  'AltRight',
  'MetaRight',
  'ContextMenu',
  'ControlRight',
  'Insert',
  'Home',
  'PageUp',
  'Delete',
  'End',
  'PageDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowDown',
  'ArrowRight',
  'NumLock',
  'NumpadDivide',
  'NumpadMultiply',
  'NumpadSubtract',
  'NumpadAdd',
  'NumpadEnter',
  'NumpadDecimal',
  'Numpad0',
  'Numpad1',
  'Numpad2',
  'Numpad3',
  'Numpad4',
  'Numpad5',
  'Numpad6',
  'Numpad7',
  'Numpad8',
  'Numpad9',
  'IntlBackslash',
])

function createKeyboardLayoutKey(id: string, width = 1): KeyboardLayoutKey {
  return {
    id,
    label: keyboardKeyLabels[id] ?? id,
    width,
    hand: getKeyboardStatisticsHand(id),
  }
}

export function getKeyboardStatisticsHand(id: string): InputStatisticsHand {
  if (leftHandKeyboardIds.has(id)) return 'left'
  if (rightHandKeyboardIds.has(id)) return 'right'

  return 'neutral'
}

export const keyboardFunctionRow = [
  createKeyboardLayoutKey('Escape'),
  createKeyboardLayoutKey('F1'),
  createKeyboardLayoutKey('F2'),
  createKeyboardLayoutKey('F3'),
  createKeyboardLayoutKey('F4'),
  createKeyboardLayoutKey('F5'),
  createKeyboardLayoutKey('F6'),
  createKeyboardLayoutKey('F7'),
  createKeyboardLayoutKey('F8'),
  createKeyboardLayoutKey('F9'),
  createKeyboardLayoutKey('F10'),
  createKeyboardLayoutKey('F11'),
  createKeyboardLayoutKey('F12'),
  createKeyboardLayoutKey('PrintScreen'),
  createKeyboardLayoutKey('ScrollLock'),
  createKeyboardLayoutKey('Pause'),
]

export const keyboardMainRows = [
  [
    createKeyboardLayoutKey('Backquote'),
    createKeyboardLayoutKey('Digit1'),
    createKeyboardLayoutKey('Digit2'),
    createKeyboardLayoutKey('Digit3'),
    createKeyboardLayoutKey('Digit4'),
    createKeyboardLayoutKey('Digit5'),
    createKeyboardLayoutKey('Digit6'),
    createKeyboardLayoutKey('Digit7'),
    createKeyboardLayoutKey('Digit8'),
    createKeyboardLayoutKey('Digit9'),
    createKeyboardLayoutKey('Digit0'),
    createKeyboardLayoutKey('Minus'),
    createKeyboardLayoutKey('Equal'),
    createKeyboardLayoutKey('Backspace', 2),
  ],
  [
    createKeyboardLayoutKey('Tab', 1.5),
    createKeyboardLayoutKey('KeyQ'),
    createKeyboardLayoutKey('KeyW'),
    createKeyboardLayoutKey('KeyE'),
    createKeyboardLayoutKey('KeyR'),
    createKeyboardLayoutKey('KeyT'),
    createKeyboardLayoutKey('KeyY'),
    createKeyboardLayoutKey('KeyU'),
    createKeyboardLayoutKey('KeyI'),
    createKeyboardLayoutKey('KeyO'),
    createKeyboardLayoutKey('KeyP'),
    createKeyboardLayoutKey('BracketLeft'),
    createKeyboardLayoutKey('BracketRight'),
    createKeyboardLayoutKey('Backslash', 1.5),
  ],
  [
    createKeyboardLayoutKey('CapsLock', 1.75),
    createKeyboardLayoutKey('KeyA'),
    createKeyboardLayoutKey('KeyS'),
    createKeyboardLayoutKey('KeyD'),
    createKeyboardLayoutKey('KeyF'),
    createKeyboardLayoutKey('KeyG'),
    createKeyboardLayoutKey('KeyH'),
    createKeyboardLayoutKey('KeyJ'),
    createKeyboardLayoutKey('KeyK'),
    createKeyboardLayoutKey('KeyL'),
    createKeyboardLayoutKey('Semicolon'),
    createKeyboardLayoutKey('Quote'),
    createKeyboardLayoutKey('Enter', 2.25),
  ],
  [
    createKeyboardLayoutKey('ShiftLeft', 2.25),
    createKeyboardLayoutKey('KeyZ'),
    createKeyboardLayoutKey('KeyX'),
    createKeyboardLayoutKey('KeyC'),
    createKeyboardLayoutKey('KeyV'),
    createKeyboardLayoutKey('KeyB'),
    createKeyboardLayoutKey('KeyN'),
    createKeyboardLayoutKey('KeyM'),
    createKeyboardLayoutKey('Comma'),
    createKeyboardLayoutKey('Period'),
    createKeyboardLayoutKey('Slash'),
    createKeyboardLayoutKey('ShiftRight', 2.75),
  ],
  [
    createKeyboardLayoutKey('ControlLeft', 1.25),
    createKeyboardLayoutKey('MetaLeft', 1.25),
    createKeyboardLayoutKey('AltLeft', 1.25),
    createKeyboardLayoutKey('Space', 6.25),
    createKeyboardLayoutKey('AltRight', 1.25),
    createKeyboardLayoutKey('MetaRight', 1.25),
    createKeyboardLayoutKey('ContextMenu', 1.25),
    createKeyboardLayoutKey('ControlRight', 1.25),
  ],
]

export const keyboardNavigationRows = [
  [
    createKeyboardLayoutKey('Insert'),
    createKeyboardLayoutKey('Home'),
    createKeyboardLayoutKey('PageUp'),
  ],
  [
    createKeyboardLayoutKey('Delete'),
    createKeyboardLayoutKey('End'),
    createKeyboardLayoutKey('PageDown'),
  ],
  [
    createKeyboardLayoutKey('ArrowUp'),
  ],
  [
    createKeyboardLayoutKey('ArrowLeft'),
    createKeyboardLayoutKey('ArrowDown'),
    createKeyboardLayoutKey('ArrowRight'),
  ],
]

export const keyboardNumpadRows = [
  [
    createKeyboardLayoutKey('NumLock'),
    createKeyboardLayoutKey('NumpadDivide'),
    createKeyboardLayoutKey('NumpadMultiply'),
    createKeyboardLayoutKey('NumpadSubtract'),
  ],
  [
    createKeyboardLayoutKey('Numpad7'),
    createKeyboardLayoutKey('Numpad8'),
    createKeyboardLayoutKey('Numpad9'),
    createKeyboardLayoutKey('NumpadAdd'),
  ],
  [
    createKeyboardLayoutKey('Numpad4'),
    createKeyboardLayoutKey('Numpad5'),
    createKeyboardLayoutKey('Numpad6'),
  ],
  [
    createKeyboardLayoutKey('Numpad1'),
    createKeyboardLayoutKey('Numpad2'),
    createKeyboardLayoutKey('Numpad3'),
    createKeyboardLayoutKey('NumpadEnter'),
  ],
  [
    createKeyboardLayoutKey('Numpad0', 2),
    createKeyboardLayoutKey('NumpadDecimal'),
  ],
]

export const standardKeyboardLayout = {
  functionRow: keyboardFunctionRow,
  mainRows: keyboardMainRows,
  navigationRows: keyboardNavigationRows,
  numpadRows: keyboardNumpadRows,
}

export const keyboardLayoutKeys = [
  ...keyboardFunctionRow,
  ...keyboardMainRows.flat(),
  ...keyboardNavigationRows.flat(),
  ...keyboardNumpadRows.flat(),
]

const rdevKeyIdMap: Record<string, string> = {
  Alt: 'AltLeft',
  AltGr: 'AltRight',
  BackQuote: 'Backquote',
  LeftBracket: 'BracketLeft',
  RightBracket: 'BracketRight',
  BackSlash: 'Backslash',
  SemiColon: 'Semicolon',
  Apostrophe: 'Quote',
  Return: 'Enter',
  Dot: 'Period',
  LeftArrow: 'ArrowLeft',
  RightArrow: 'ArrowRight',
  UpArrow: 'ArrowUp',
  DownArrow: 'ArrowDown',
  Num0: 'Digit0',
  Num1: 'Digit1',
  Num2: 'Digit2',
  Num3: 'Digit3',
  Num4: 'Digit4',
  Num5: 'Digit5',
  Num6: 'Digit6',
  Num7: 'Digit7',
  Num8: 'Digit8',
  Num9: 'Digit9',
  Kp0: 'Numpad0',
  Kp1: 'Numpad1',
  Kp2: 'Numpad2',
  Kp3: 'Numpad3',
  Kp4: 'Numpad4',
  Kp5: 'Numpad5',
  Kp6: 'Numpad6',
  Kp7: 'Numpad7',
  Kp8: 'Numpad8',
  Kp9: 'Numpad9',
  KpReturn: 'NumpadEnter',
  KpMinus: 'NumpadSubtract',
  KpPlus: 'NumpadAdd',
  KpMultiply: 'NumpadMultiply',
  KpDivide: 'NumpadDivide',
  KpDelete: 'NumpadDecimal',
  Function: 'Fn',
}

export function getInputStatisticsKey(source: InputStatisticsSource, id: string) {
  return `${source}:${id}`
}

export function parseInputStatisticsKey(key: string): InputStatisticsKey | undefined {
  const separatorIndex = key.indexOf(':')

  if (separatorIndex < 1) return

  const source = key.slice(0, separatorIndex)
  const id = key.slice(separatorIndex + 1)

  if ((source !== 'keyboard' && source !== 'mouse') || !id) return

  return { source, id }
}

export function normalizeInputStatisticsId(source: InputStatisticsSource, id: string) {
  return source === 'keyboard' ? rdevKeyIdMap[id] ?? id : id
}

export function getInputStatisticsLabel(source: InputStatisticsSource, id: string) {
  if (source === 'mouse') {
    return mouseButtonLabels[id] ?? id
  }

  return keyboardKeyLabels[id] ?? id
}
