import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";

import pimechat from "../assets/images/pimechat.png";

import { Button } from "../components/Button";
import { message } from "../components/message";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { database, firebase, auth } from "../services/firebase";

import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export function Room() {
  const { user, setUser } = useAuth();
  const params = useParams<RoomParams>();
  const [newmessage, setNewmessage] = useState("");
  const roomId = params.id;

  const { title, messages } = useRoom(roomId);

  async function handleSendmessage(event: FormEvent) {
    event.preventDefault();

    if (newmessage.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("You must be logged in");
    }

    const message = {
      content: newmessage,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/messages`).push(message);

    setNewmessage("");

    let t: any = document.getElementsByClassName('message-list')[0]
    t.scrollTo(0, t.scrollHeight);

  }

  async function handleLikemessage(
    messageId: string,
    likeId: string | undefined
  ) {
    if (likeId) {
      await database
        .ref(`rooms/${roomId}/messages/${messageId}/likes/${likeId}`)
        .remove();
    } else {
      await database.ref(`rooms/${roomId}/messages/${messageId}/likes`).push({
        authorId: user?.id,
      });
    }
  }

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google Account.");
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={pimechat} />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Grupo {title}</h1>
          {messages.length > 0 && <span>{messages.length} mensagem(s)</span>}
        </div>

        <div className="message-list">
          {messages.map((message) => {
            return (
              <message
                key={message.id}
                content={message.content}
                author={message.author}
                isAnswered={message.isAnswered}
                isHighlighted={message.isHighlighted}
              >
                {!message.isAnswered && (
                  <button
                    className={`like-button ${message.likeId ? "liked" : ""}`}
                    type="button"
                    aria-label="Marcar como gostei"
                    onClick={() =>
                      handleLikemessage(message.id, message.likeId)
                    }
                  >
                    {message.likeCount > 0 && (
                      <span>{message.likeCount}</span>
                    )}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </message>
            );
          })}
        </div>

        <form onSubmit={handleSendmessage}>
          <textarea
            placeholder="Escreva sua mensagem?"
            onChange={(event) => setNewmessage(event.target.value)}
            value={newmessage}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma mensagem,{" "}
                <button onClick={signInWithGoogle}>fa??a seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
