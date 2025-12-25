import { useRef } from "react";
import { useVoiceStore } from "../store/VoiceStore";
import { useGroupChatStore } from "../store/useGroupChatStore";
import { useAuthStore } from "../store/useAuthStore";
import VoiceIframe from "./VoiceIFrame";
import { Volume2, PhoneOff } from "lucide-react";

const VoiceChat = () => {
  const { selectedChannel } = useGroupChatStore();
  const { authUser } = useAuthStore();

  const {
    joined,
    token,
    setJoin,
    sendToken,
    leaveVoice,
  } = useVoiceStore();

  // 🔑 Track which channel VC is ACTUALLY joined in
  const joinedChannelRef = useRef(null);

  const joinVC = async () => {
    if (!selectedChannel || !authUser) return;

    // If already connected to another VC → leave it
    if (
      joined &&
      joinedChannelRef.current &&
      joinedChannelRef.current !== selectedChannel._id
    ) {
      leaveVoice();
    }

    await sendToken({
      room: selectedChannel._id,
      userId: authUser._id,
    });
    setJoin(true)
    joinedChannelRef.current = selectedChannel._id;
  };

  const leaveVC = () => {
    leaveVoice();
    joinedChannelRef.current = null;
  };

  const isCurrentVC =
    joined &&
    joinedChannelRef.current === selectedChannel?._id &&
    token 

  // 🔊 SHOW VC UI ONLY IN JOINED CHANNEL
  if (isCurrentVC) {
    return (
      <div className="flex-1 h-full bg-black relative">
        <VoiceIframe token={token.token} url={token.url} />

        {/* Optional Leave Button */}
        <button
          onClick={leaveVC}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          <PhoneOff size={18} />
          Leave
        </button>
      </div>
    );
  }

  // 🟢 NOT IN THIS VC — show JOIN UI
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <h2 className="text-lg font-semibold">
        Join #{selectedChannel?.name}
      </h2>

      <button
        onClick={joinVC}
        className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
      >
        <Volume2 size={20} />
        Join Voice Channel
      </button>

      {/* 🔔 Optional banner if connected elsewhere */}
      {joined && joinedChannelRef.current && (
        <p className="text-sm text-gray-400">
          Connected to another voice channel
        </p>
      )}
    </div>
  );
};

export default VoiceChat;
