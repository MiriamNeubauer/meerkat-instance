import { Flex, Heading, Link } from "@chakra-ui/react";
import { Event } from "../../hooks/use-event.ts";
import { useUser } from "../../hooks/use-user.ts";

export const Card = ({ event }: { event: Event | undefined }) => {
  const { data: user } = useUser();

  const hasUserAskedQuestion = event?.questions.some((question) =>
    (question.userId) === Number(user?.uid)
  );

  return (
    <>
      <div className="collect-card-text">
        <Heading as="h3" color="white" size="sm">
          Collect your event card on Zupass
        </Heading>
      </div>
      <div className="collect-card-image">
        {/* if users ask a q he gets a special card */}
        {hasUserAskedQuestion
          ? (
            <img
              src={"https://www.biographic.com/wp-content/uploads/2021/09/Meerkat-in-sunset.jpg"}
              alt="Special Card"
            />
          )
          : (
            <img
              src={"https://cdn.britannica.com/57/152457-050-1128A5FE/Meerkat.jpg"}
              alt="Ordinary Card"
            />
          )}
      </div>
      <Flex direction="column" align="center">
        <Link href={event?.collectURL}>Collect</Link>
      </Flex>
    </>
  );
};

export default Card;
