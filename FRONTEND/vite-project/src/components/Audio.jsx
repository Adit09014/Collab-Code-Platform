import { useVoiceStore } from "../store/VoiceStore";
import VoiceIframe from "./VoiceIFrame";

const Audio = () => {
  const { joined, token, serverUrl } = useVoiceStore();

  if (!joined || !token || !serverUrl) return null;

  return (
    <div className="fixed bottom-0 left-64 right-0 h-64 bg-black z-50">
      <VoiceIframe token={token} url={serverUrl} />
    </div>
  );
};

export default Audio;
