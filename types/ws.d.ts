// ws используется только как DOM-совместимая реализация WebSocket (заглушка для NodeJS)
declare module 'ws' {
  const WebSocket: typeof globalThis.WebSocket;
  export = WebSocket;
}
