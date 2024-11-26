import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import Peer from 'simple-peer';
import { toast } from 'sonner';

import { StreamServiceMsg } from '@common/types/message';

import { getSocket } from '@/lib/socket';
import { parseError } from '@/lib/utils';

// Create a new peer connection
export const createPeer = (
  userID: string,
  initiator: boolean,
  streamRef: MutableRefObject<MediaStream | null>,
  peersRef: MutableRefObject<Record<string, Peer.Instance>>,
  setRemoteStreams: Dispatch<SetStateAction<Record<string, MediaStream | null>>>,
  pendingSignalsRef: MutableRefObject<Record<string, any[]>>,
) => {
  const socket = getSocket();
  try {
    // Clean up existing peer if it exists
    cleanupPeer(userID, peersRef, setRemoteStreams);

    // Create peer with stream config
    const peer = new Peer({
      initiator,
      // Only include stream if it exists and has active tracks
      stream: streamRef.current?.getTracks().length ? streamRef.current : undefined,
    });

    peer.on('signal', (signal) => {
      socket.emit(StreamServiceMsg.SIGNAL, signal);
    });

    peer.on('stream', (stream) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [userID]: stream,
      }));
    });

    peer.on('error', (err) => {
      console.warn(`Peer connection error:\n${parseError(err)}`);
      cleanupPeer(userID, peersRef, setRemoteStreams);
    });

    peer.on('connect', () => {
      console.log(`Peer connection established with ${userID}`);
    });

    // Process any pending signals
    const pendingSignals = pendingSignalsRef.current[userID] || [];
    pendingSignals.forEach((signal) => {
      try {
        peer.signal(signal);
      } catch (error) {
        console.warn(`Error processing pending signal for ${userID}:\n${error}`);
      }
    });
    delete pendingSignalsRef.current[userID];

    peersRef.current[userID] = peer;
    return peer;
  } catch (error) {
    toast.error(`Error creating peer connection:\n${parseError(error)}`);
    return null;
  }
};

// Handle incoming signals
export const handleSignal = (
  signal: any,
  userID: string,
  streamRef: MutableRefObject<MediaStream | null>,
  peersRef: MutableRefObject<Record<string, Peer.Instance>>,
  setRemoteStreams: Dispatch<SetStateAction<Record<string, MediaStream | null>>>,
  pendingSignalsRef: MutableRefObject<Record<string, any[]>>,
) => {
  try {
    let peer = peersRef.current[userID];

    if (!peer || peer.destroyed) {
      // Store signal if peer doesn't exist yet
      if (!pendingSignalsRef.current[userID]) {
        pendingSignalsRef.current[userID] = [];
      }
      pendingSignalsRef.current[userID].push(signal);
      
      // Create new peer as non-initiator
      peer = createPeer(
        userID,
        false,
        streamRef,
        peersRef,
        setRemoteStreams,
        pendingSignalsRef,
      ) as Peer.Instance;
    }

    if (peer && !peer.destroyed) {
      peer.signal(signal);
    }
  } catch (error) {
    console.error(`Error handling peer signal:\n${parseError(error)}`);
  }
};

// Clean up a peer connection
export const cleanupPeer = (
  userID: string,
  peersRef: MutableRefObject<Record<string, Peer.Instance>>,
  setRemoteStreams: Dispatch<SetStateAction<Record<string, MediaStream | null>>>,
) => {
  const peer = peersRef.current[userID];
  if (peer) {
    if (!peer.destroyed) {
      try {
        peer.destroy();
      } catch (error) {
        console.warn(`Error destroying peer connection for ${userID}`);
      }
    }
    delete peersRef.current[userID];
  }
  
  // Always clean up remote streams for this user
  setRemoteStreams((prev) => {
    const newStreams = { ...prev };
    delete newStreams[userID];
    return newStreams;
  });
};