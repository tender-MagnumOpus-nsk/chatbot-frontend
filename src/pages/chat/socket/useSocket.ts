import { useCallback, useEffect, useRef, useState } from 'react';
import { useSetState } from './state';
import { tryParseJson } from '../../../utils/tryParseJson';

export interface UseSocketProps {
  url: string;
  onSendMessage?: (payload: any) => void;
  onMessage?: (data: any) => void;
  enabled?: boolean;
}

export interface UseSocketState {
  readyState: typeof WebSocket.CONNECTING | typeof WebSocket.OPEN | typeof WebSocket.CLOSING | typeof WebSocket.CLOSED;
  error: Event | null;
  data: string | object | null;
}

export interface UseSocketSendMessageProps {
  payload: any;
}

export const useSocket = (props: UseSocketProps) => {
  const { url, enabled, onSendMessage, onMessage } = props;

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useSetState<UseSocketState>({
    readyState: WebSocket.CONNECTING,
    error: null,
    data: null
  });

  const ws = useRef<WebSocket | null>(null);
  const client = ws.current;

  useEffect(() => {
    if (enabled) {
      ws.current = new WebSocket(url);
      ws.current!.onopen = () => {
        setState({ readyState: WebSocket.OPEN });
        console.log('Socket connection has been opened');
      };
      ws.current!.onclose = () => {
        setState({ readyState: WebSocket.CLOSED });
        console.log('Socket connection has been closed, try to reconnect');
        ws.current = new WebSocket(url);
      };
      ws.current!.onerror = (event) => {
        setState({ error: event });
        setIsLoading(false);
        console.error('Socket error:', event);
      };
      ws.current!.onmessage = handleMessage;
    }

    const currentWs = ws.current;

    return () => {
      currentWs?.close();
    };
  }, []);

  useEffect(() => {
    const data = tryParseJson(message) ?? '';

    setState({
      data
    });
  }, [message]);

  const sendMessage = useCallback(
    ({ payload }: UseSocketSendMessageProps) => {
      const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
      client?.send(data);
      onSendMessage?.(payload);
      setIsLoading(true);
    },
    [client]
  );

  const handleMessage = useCallback((event: MessageEvent) => {
    const data = tryParseJson(event.data) ?? '';
    setMessage(event.data);
    onMessage?.(data);
    setIsLoading(false);
  }, []);

  return {
    ...state,
    isLoading,
    sendMessage
  };
};
