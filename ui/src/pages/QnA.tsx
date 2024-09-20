import { useEvent, useEventUpdates } from "../hooks/use-event.ts";
import { QuestionsSection } from "../components/QnA/QuestionsSection.tsx";
import { Footer } from "../components/QnA/Footer.tsx";
import { Header } from "../components/Header/Header.tsx";
import { useVotes } from "../hooks/use-votes.ts";
import { useRef, useState } from "react";
import { useUser } from "../hooks/use-user.ts";
import { Reaction } from "../components/QnA/Reaction.tsx";
import { HeartIcon } from "../components/QnA/HeartIcon.tsx";
import { Link as ReactRouterLink, useParams } from "react-router-dom";
import { Flex, Link } from "@chakra-ui/react";
import { remote } from "../routes.ts";
import { ArrowBackIcon } from "@chakra-ui/icons";

export function QnA() {
  const { uid } = useParams();
  const { data: event, mutate: refreshEvent } = useEvent(uid);
  const { data: votes, mutate: refreshVotes } = useVotes();
  const refresh = () => {
    refreshEvent();
    refreshVotes();
  };
  const { data: user, isAuthenticated } = useUser();
  const [reactions, setReactions] = useState<{ id: number }[]>([]);
  const ref = useRef(0);
  const { data: _update } = useEventUpdates(uid, {
    onUpdate: (message) => {
      const parsedMessage: { [key: string]: string } = JSON.parse(message);
      if (parsedMessage.type === "reaction") {
        setReactions((prevReactions: { id: number }[]) => [
          ...prevReactions,
          { id: ref.current },
        ]);
        ref.current += 1;
      } else {
        refresh();
      }
    },
  });

  return (
    <div className="layout">
      <header className="header">
        <nav>
          <Link as={ReactRouterLink} to={remote(uid)}>
            <Flex
              flexDirection="row"
              gap="1"
              alignItems="center"
              padding="0.5rem 0 0 1rem"
              minHeight="1rem"
            >
              <ArrowBackIcon /> <span>Controls</span>
            </Flex>
          </Link>
        </nav>
        <Header title={`QA: ${event?.title}`} subline={event?.speaker} />
      </header>
      <main className="content">
        <QuestionsSection
          event={event}
          votes={votes}
          refresh={refresh}
          isAuthenticated={isAuthenticated}
        />
      </main>
      <footer className="footer">
        {reactions.map((reaction: { id: number }) => (
          <Reaction
            key={reaction.id}
            id={reaction.id}
            icon={reaction.id % 5 === 0 ? <>🐸</> : <HeartIcon />}
            setReactions={setReactions}
          />
        ))}
        <Footer
          event={event}
          user={user}
          isAuthenticated={isAuthenticated}
          refresh={refresh}
        />
      </footer>
    </div>
  );
}
