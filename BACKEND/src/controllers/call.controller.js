import dotenv from "dotenv";
import { AccessToken } from "livekit-server-sdk";

dotenv.config();

export const call = async (req, res) => {
  try {
    const { room, userId } = req.query;

    if (!room || !userId) {
      return res.status(400).json({
        error: "room and userId required",
      });
    }

    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      return res.status(500).json({
        error: "LiveKit server misconfigured",
      });
    }

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: userId,
      }
    );

    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const jwt = await at.toJwt();

    res.json({
      token: jwt,
      url: process.env.NEXT_PUBLIC_LIVEKIT_URL, // ✅ backend env var
    });
  } catch (err) {
    console.error("LiveKit token error:", err);
    res.status(500).json({ error: "Failed to generate token" });
  }
};
