//server component : fetches movies
// receive roomId from URL, renders JoinRoomScreen passing roomId and movie list

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import JoinRoomScreen from "./joinRoomScreen";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  const roomRef = doc(db, "rooms", roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    return <div>Room not found.</div>
  }

  const roomData = roomSnap.data();

  return <JoinRoomScreen roomId={roomId} movies={roomData.movies} />;
}