import { Icon, IconButton } from "@chakra-ui/react";

interface UpVoteButtonProps {
  hasVoted: boolean;
  isDisabled?: boolean;
}

export function UpVoteButton({ hasVoted, isDisabled }: UpVoteButtonProps) {
  return (
    <IconButton
      type="submit"
      isDisabled={isDisabled}
      icon={
        <Icon viewBox="0 0 24 24">
          <path
            d="M7.66671 5.21875V18.0001H10.3334V5.21875L16.0574 10.9427L17.9427 9.05741L9.00004 0.114746L0.057373 9.05741L1.94271 10.9427L7.66671 5.21875Z"
            fill={hasVoted ? "white" : "#AFA5C0"}
          />
        </Icon>
      }
      aria-label="Upvote"
      variant="ghost"
      fontSize="1.25rem"
      top="0.1rem"
      p={0}
      m={0}
      size="xs"
      _hover={{ bg: "none" }}
    />
  );
}
