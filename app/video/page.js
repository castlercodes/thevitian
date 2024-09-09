"use client";
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const Page = () => {
  const [socket, setSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const iceServers = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  useEffect(() => {
    const newSocket = io('https://1a75-115-240-194-54.ngrok-free.app', {
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server with ID:', newSocket.id);
    });

    newSocket.on('update-user-list', (users) => {
      console.log('Connected users:', users);
      setConnectedUsers(users.filter(user => user !== newSocket.id)); // Exclude current user
    });

    newSocket.on('offer', async (data) => {
      console.log('Received offer from:', data.from);
      const { offer, from } = data;
      setRemoteSocketId(from);

      const answerPC = new RTCPeerConnection(iceServers);
      setPeerConnection(answerPC);

      answerPC.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate');
          newSocket.emit('ice-candidate', {
            candidate: event.candidate,
            to: from
          });
        }
      };

      answerPC.ontrack = (event) => {
        console.log('Receiving remote stream:', event.streams);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      await answerPC.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await answerPC.createAnswer();
      await answerPC.setLocalDescription(answer);

      newSocket.emit('answer', {
        answer,
        to: from
      });
    });

    newSocket.on('answer', async (data) => {
      console.log('Received answer');
      const { answer } = data;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    newSocket.on('ice-candidate', async (data) => {
      console.log('Received ICE candidate');
      const { candidate } = data;
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setSocket(null);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [peerConnection]);

  const startCall = async (targetSocketId) => {
    if (!socket) {
      console.error('Socket is not initialized.');
      return;
    }
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = localStream;

      const newPC = new RTCPeerConnection(iceServers);
      setPeerConnection(newPC);

      localStream.getTracks().forEach((track) => newPC.addTrack(track, localStream));
      console.log('Local tracks added to peer connection.');

      newPC.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate');
          socket.emit('ice-candidate', {
            candidate: event.candidate,
            to: targetSocketId
          });
        }
      };

      newPC.ontrack = (event) => {
        console.log('Receiving remote stream:', event.streams);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      const offer = await newPC.createOffer();
      await newPC.setLocalDescription(offer);

      console.log('Sending offer to:', targetSocketId);
      socket.emit('offer', { offer, to: targetSocketId });
    } catch (err) {
      console.error('Error starting call:', err);
    }
  };

  return (
    <div>
      <h1>Video Chat</h1>
      <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '300px', height: '300px' }}></video>
      <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px', height: '300px' }}></video>
      
      <h2>Connected Users</h2>
      <ul>
        {connectedUsers.map(userId => (
          <li key={userId}>
            <button onClick={() => startCall(userId)}>Call User {userId}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
