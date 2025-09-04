export interface MeshTelemetryEvent {
  id: string;
  timestamp: string;
  appId: 'bidpilot' | 'impact-ledger' | 'netpulse' | 'aidroute' | 'cashshield' | 'ciphervault' | 'portfolio-portal';
  appName: string;
  type: 'nominal' | 'metric' | 'security' | 'anomaly';
  message: string;
  metric?: string;
  isLiveMesh?: boolean;
}

const CHANNEL_NAME = 'sovereign-mesh-bus';

export function getMeshChannel(): BroadcastChannel | null {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    return new BroadcastChannel(CHANNEL_NAME);
  }
  return null;
}

export function broadcastMeshEvent(event: Omit<MeshTelemetryEvent, 'id' | 'timestamp' | 'isLiveMesh'>) {
  try {
    const channel = getMeshChannel();
    if (!channel) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    const fullEvent: MeshTelemetryEvent = {
      ...event,
      id: 'mesh-' + Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      isLiveMesh: true
    };
    channel.postMessage(fullEvent);
    channel.close();
  } catch (err) {
    console.debug('BroadcastChannel error or unavailable', err);
  }
}

export function subscribeMeshEvents(handler: (event: MeshTelemetryEvent) => void): () => void {
  const channel = getMeshChannel();
  if (!channel) return () => {};

  const listener = (msg: MessageEvent<MeshTelemetryEvent>) => {
    if (msg.data && msg.data.appId && msg.data.message) {
      handler({ ...msg.data, isLiveMesh: true });
    }
  };

  channel.addEventListener('message', listener);
  return () => {
    channel.removeEventListener('message', listener);
    channel.close();
  };
}
