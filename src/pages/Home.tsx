import { useHistory } from "react-router-dom";
import { FormEvent, useState } from "react";

import pimechat from "../assets/images/pimechat.png";
import bomdia from "../assets/images/bomdia.webp";

import googleIconImg from "../assets/images/google-icon.svg";

import { database } from "../services/firebase";

import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

import "../styles/auth.scss";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Room does not exists.");
      return;
    }

    if (roomRef.val().endedAt) {
      alert("Room already closed.");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={bomdia}
          alt="Ilustração simbolizando mensagens e respostas"
        />
        <strong>Crie seu grupo do ZAP</strong>
        <p>Bate papo e memes em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={pimechat} />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie seu grupo com o Google
          </button>
          <div className="separator">ou entre em um grupo</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código do grupo"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar no grupo</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
