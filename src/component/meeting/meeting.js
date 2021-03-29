import React, { useEffect, useState, useContext, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './meeting.css';
import { apiUrl } from '../../axios';
import { io } from 'socket.io-client';
import Sidebar from '../sidebar/Sidebar';
import { MeetingContext } from '../../context/meeting/meeting-context';
import Peer from 'peerjs';
import { UserContext } from '../../context/user/user-context';
import { toast } from 'react-toastify';
import VideoContainer from '../VideoContainer/VideoContainer';

function Meeting() {

    const params = useParams();
    const token = localStorage.getItem('token');

    const meetingContext = useContext(MeetingContext);
    const userContext = useContext(UserContext);

    const history = useHistory(null);

    const [peers, setPeers] = useState({});
    const [chatMessages, setChatMessages] = useState([]);

    const socketInstanceRef = useRef(null);
    const peerInstanceRef = useRef(null);
    const videoGridRef = useRef(null);
    const videoStreamingOptions = meetingContext.meetingState.videoStreamingConfig;

    useEffect(async () => {
        await prepareMeeting();
        return () => {
            leaveMeeting()
        }
    }, []);


    const destroyConnections = () => {
        const myMediaTracks = document.getElementById(userContext.userState.user._id)?.srcObject?.getTracks();
        myMediaTracks?.forEach((track) => {
            track.stop();
        })
        socketInstanceRef.current.disconnect();
        peerInstanceRef.current.destroy();
    }

    const prepareMeeting = async () => {
        try {
            await meetingContext.joinMeeting();
            const messages = await meetingContext.fetchMeetingChat(params.meetingId);
            messages && setChatMessages(messages);
            peerInstanceRef.current = initializePeerConnection();
            socketInstanceRef.current = initializeSocketConnection();
            initializeSocketEvents();
            initializePeersEvents();
        } catch (err) {
            console.log(err);
        }
    }

    const getPermissions = async () => {
        try {
            let videoAvailable = false;
            let audioAvailable = false;
            await navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => audioAvailable = true)
                .catch(() => audioAvailable = false)

            await navigator.mediaDevices.getUserMedia({ video: true })
                .then(() => videoAvailable = true)
                .catch(() => videoAvailable = false)

            return { videoAvailable, audioAvailable };
        } catch (e) {
            console.log(e)
        }
    }

    const initializePeerConnection = () => {
        return new Peer(userContext.userState.user._id, {
            host: 'https://zoom-clone-app.netlify.app',
            port: 9000,
            path: '/peerjs',
        });
    }

    const initializeSocketConnection = () => {
        return io.connect(apiUrl, {
            query: { token },
        });
    }

    const initializeSocketEvents = () => {
        socketInstanceRef.current.on('connect', () => {
            meetingContext.fetchMeetingChat(params.meetingId);
            console.log('connection to socket established');
        });
        socketInstanceRef.current.on('room-joined', (room) => {
            meetingContext.setParticipants(room.users);
        });
        socketInstanceRef.current.on('room-users', (room) => {
            meetingContext.setParticipants(room.users);
        });
        socketInstanceRef.current.on('share-screen', (userId) => {
            meetingContext.setVideoStreamOptions({ ...videoStreamingOptions, screenShareUserId: userId })
            changeCssVideos(videoGridRef.current, true, userId);
        });
        socketInstanceRef.current.on('screen-share-stopped', () => {
            meetingContext.setVideoStreamOptions({ ...videoStreamingOptions, screenShareUserId: '' });
            reInitializeStream(videoStreamingOptions.allowVideo, videoStreamingOptions.allowAudio);
            changeCssVideos(videoGridRef.current, false);
        });
        socketInstanceRef.current.on('room-messages', (newMessage) => {
            setChatMessages(prevState => [...prevState, newMessage]);
            meetingContext.setChatMessages(newMessage);
        });
        socketInstanceRef.current.on('user-disconnected', (userId, username) => {
            toast.info(`${username} has left the meeting`);
            peers[userId] && peers[userId].close();
            removeVideo(userId);
        });
        socketInstanceRef.current.on('room-invalid', () => {
            toast.info('Host has terminated the meeting');
            leaveMeeting();
        })
        socketInstanceRef.current.on('error-connection', (msg) => {
            toast.error(msg);
            leaveMeeting();
            history.push('/home');
        });
        socketInstanceRef.current.on('disconnect', () => {
            console.log('socket connection closed');
        });
    }

    const initializePeersEvents = () => {
        peerInstanceRef.current.on('open', async () => {
            console.log('peer connection open');
            const { videoAvailable, audioAvailable } = await setNavigatorToStream();
            socketInstanceRef.current.emit('join-room', params.meetingId, { allowVideo: videoAvailable, allowAudio: audioAvailable });
        });

        peerInstanceRef.current.on('close', () => {
            console.log('peer connection close');
        })
        peerInstanceRef.current.on('error', (err) => {
            console.log(err);
            peerInstanceRef.current.reconnect();
        })
    }

    const onMessageSend = (newMessage) => {
        socketInstanceRef.current.emit('room-message', newMessage);
        const data = {
            message: newMessage,
            timestamp: `${new Date()}`,
            userId: userContext.userState.user._id,
        }
        meetingContext.setChatMessages(data);
        setChatMessages(prevState => [...prevState, data]);
    }

    const setNavigatorToStream = async () => {
        const { videoAvailable, audioAvailable } = await getPermissions();
        if (navigator.mediaDevices.getDisplayMedia) {
            await meetingContext.setVideoStreamOptions({ ...videoStreamingOptions, allowAudio: audioAvailable, audioAvailable, allowVideo: videoAvailable, videoAvailable, screenAvailable: true });
        } else {
            await meetingContext.setVideoStreamOptions({ ...videoStreamingOptions, allowAudio: audioAvailable, audioAvailable, allowVideo: videoAvailable, videoAvailable, screenAvailable: false });
        }
        let stream = await getVideoAudioStream(videoAvailable, audioAvailable);
        addListnersForPeerConnections(stream);
        return { videoAvailable, audioAvailable };
    }

    const addListnersForPeerConnections = async (stream) => {
        createVideo({ id: userContext.userState.user._id, stream, userDate: userContext.userState.user })
        setPeersListeners(stream);
        newUserConnection();
    }

    const blackSilence = (...args) => new MediaStream([black(...args), silence()])

    const black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillStyle = 'rgb(26, 26, 26)';
        canvas.getContext('2d').fillRect(0, 0, width, height)
        canvas.getContext('2d').fillStyle = '#fff';
        canvas.getContext('2d').font = `bold 40px Arial`;
        canvas.getContext('2d').textAlign = 'center';
        canvas.getContext('2d').textBaseline = "middle";
        canvas.getContext('2d').fillText(userContext.userState.user.username, canvas.width / 2, canvas.height / 2);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: true });
    }

    const silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    }

    const getVideoAudioStream = async (video = true, audio = true) => {
        let userStream = new MediaStream();
        await navigator.mediaDevices.getUserMedia({ video, audio }).then((stream) => {
            if (video && audio) {
                userStream = stream;
            } else if (!audio) {
                userStream = new MediaStream([stream.getVideoTracks()[0], silence()]);
            } else if (!video) {
                userStream = new MediaStream([black(), stream.getAudioTracks()[0]]);
            }
        }).catch(err => {
            userStream = blackSilence();
        });
        return userStream;
    }


    const newUserConnection = () => {
        socketInstanceRef.current.on('room-joined', async (room, newUser) => {
            const isNewUser = newUser.userId !== userContext.userState.user._id;
            toast.info(`${isNewUser ? newUser.username : 'You'} joined the meeting`);
            let stream = await getVideoAudioStream(newUser.streamingOptions.allowVideo, newUser.streamingOptions.allowAudio);
            isNewUser && connectToNewUser(newUser, stream);
        });
    }

    const connectToNewUser = (userData, stream) => {
        try {
            const { userId } = userData;
            const call = peerInstanceRef.current.call(userId, stream, { metadata: { id: userContext.userState.user._id } });
            call.on('stream', (userVideoStream) => {
                createVideo({ id: userId, stream: userVideoStream, userData });
            });
            call.on('close', () => {
                removeVideo(userId);
            });
            call.on('error', () => {
                console.log('peer error ------');
                removeVideo(userId);
            })
            peers[userId] = call;
            setPeers(peers)
        } catch (err) {
            console.log(err);
        }

    }

    const setPeersListeners = (stream) => {
        try {
            peerInstanceRef.current.on('call', (call) => {
                call.answer(stream);
                call.on('stream', (userVideoStream) => {
                    createVideo({ id: call.metadata.id, stream: userVideoStream });
                });
                call.on('close', () => {
                    removeVideo(call.metadata.id);
                });
                call.on('error', () => {
                    removeVideo(call.metadata.id);
                });
                peers[call.metadata.id] = call;
                setPeers(peers);
            });
        } catch (err) {
            console.log(err)
        }
    }

    const createVideo = (data) => {
        const myVideo = document.getElementById(data.id);
        if (!myVideo) {
            const video = document.createElement('video', {});
            video.srcObject = data.stream;
            video.id = data.id;
            video.autoplay = true;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            })
            if (data.id === userContext.userState.user._id) video.muted = true;
            videoGridRef.current?.appendChild(video);
            changeCssVideos(videoGridRef.current);
        } else {
            document.getElementById(data.id).srcObject = data.stream;
        }
    }

    const removeVideo = (id) => {
        const video = document.getElementById(id);
        if (video) video.remove();
        changeCssVideos(videoGridRef.current);
    }

    const reInitializeStream = (allowVideo = true, allowAudio = true, type = 'userMedia') => {
        socketInstanceRef.current?.emit('streaming-options-change', { allowVideo, allowAudio, videoAvailable: videoStreamingOptions.videoAvailable, audioAvailable: videoStreamingOptions.audioAvailable });
        meetingContext.setVideoStreamOptions({ ...videoStreamingOptions, allowVideo, allowAudio });
        (type === 'userMedia') && changeStreamConfig(allowVideo, allowAudio);
        (type === 'displayMedia') && shareScreen();
    }

    const changeStreamConfig = async (allowVideo, allowAudio) => {
        let stream = await getVideoAudioStream(allowVideo, allowAudio);
        createAndReplaceStream(stream);
    }

    const shareScreen = () => {
        navigator.mediaDevices.getDisplayMedia().then(stream => {
            stream.getVideoTracks()[0].onended = function () {
                const { allowVideo, allowAudio } = videoStreamingOptions;
                socketInstanceRef.current.emit('screen-share-stopped');
                reInitializeStream(allowVideo, allowAudio);
            }
            replaceStream(stream);
        });
        socketInstanceRef.current.emit('share-screen', userContext.userState.user._id);
    }

    const createAndReplaceStream = (stream) => {
        createVideo({ id: userContext.userState.user._id, stream });
        replaceStream(stream);
    }

    const replaceStream = (mediaStream) => {
        Object.values(peers).map((peer) => {
            peer.peerConnection?.getSenders().map((sender) => {
                if (sender.track.kind == "audio") {
                    if (mediaStream.getAudioTracks().length > 0) {
                        sender.replaceTrack(mediaStream.getAudioTracks()[0]);
                    } else {
                        const stream = blackSilence();
                        sender.replaceTrack(stream.getAudioTracks()[0]);
                    }
                }
                if (sender.track.kind == "video") {
                    if (mediaStream.getVideoTracks().length > 0) {
                        sender.replaceTrack(mediaStream.getVideoTracks()[0]);
                    } else {
                        const stream = blackSilence();
                        sender.replaceTrack(stream.getVideoTracks()[0]);
                    }
                }
            });
        })
    }

    const changeCssVideos = (main, isShareScreen = false, shareScreenUserId = '') => {
        if (isShareScreen) {
            let width = '100%';
            let height = '100%';
            let videos = main.childNodes;

            for (let i = 0; i < videos.length; ++i) {
                if (videos[i].id === shareScreenUserId) {
                    videos[i].style.setProperty("width", width)
                    videos[i].style.setProperty("height", height)
                } else {
                    videos[i].style.setProperty("display", 'none');
                }
            }
        } else {

            let widthMain = main.offsetWidth
            let minWidth = "30%"
            if ((widthMain * 30 / 100) < 300) {
                minWidth = "300px"
            }
            let minHeight = "40%"

            let videos = main.childNodes;
            let elms = videos.length;
            let height = String(100 / elms) + "%"
            let width = "";
            if (elms === 0 || elms === 1) {
                width = "90%"
                height = "90%"
            } else if (elms === 2) {
                width = "45%"
                height = "70%"
            } else if (elms === 3 || elms === 4) {
                width = "35%"
                height = "40%"
            } else {
                width = String(100 / elms) + "%"
            }

            for (let a = 0; a < videos.length; ++a) {
                videos[a].style.minWidth = minWidth
                videos[a].style.minHeight = minHeight
                videos[a].style.setProperty("width", width)
                videos[a].style.setProperty("height", height)
                videos[a].style.setProperty("display", 'block');
            }

            return { minWidth, minHeight, width, height }
        }
    }

    const leaveMeeting = () => {
        Object.values(peers).forEach(conn => conn.close());
        socketInstanceRef.current.emit('leave-group');
        destroyConnections();
        meetingContext.leaveMeeting();
    }


    return (
        <div className="meeting">
            <div className="meeting__video-container">
                <VideoContainer videoGridRef={videoGridRef} />
                <div className="meeting__video-container_options">
                    <div className="option_leave-room" onClick={() => leaveMeeting()}>Leave Room</div>
                </div>
            </div>
            <div className="meeting__sidebar-container">
                <Sidebar
                    streamConfig={{ reInitializeStream }}
                    onMessageSend={(msg) => onMessageSend(msg)}
                    chatMessages={chatMessages}
                />
            </div>
        </div>
    )
}

export default Meeting
