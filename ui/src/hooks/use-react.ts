import useSWRMutation from "swr/mutation";
import { poster } from "./fetcher.ts";

export function useReact(uid: string) {
  const { trigger } = useSWRMutation(
    `/api/v1/events/${uid}/react`,
    poster,
  );
  return { trigger };
}
