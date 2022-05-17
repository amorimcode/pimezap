import { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import illustrationImg from "../assets/images/bomdia.webp";
import logoImg from "../assets/images/pimechat.png";

import { Button } from "../components/Button";
import { database, firebase, auth } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

import "../styles/auth.scss";

export function NewRoom() {
  const { user, setUser } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState("");



  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando mensagens" />
        <strong>Crie seu grupo do ZAP</strong>
        <p>Troca de mensagens em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} />
          <h2>Criar um novo grupo</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da grupo"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">Criar grupo</Button>
          </form>
          <p>
            Quer entrar em um grupo existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
