import { useState } from "react";
import { PODEntries } from "@pcd/pod";
import { useZAPI } from "../zapi/context.tsx";
import { type ParcnetAPI } from "@parcnet-js/app-connector";
import { Event } from "../types.ts";
import { PODData } from "@parcnet-js/podspec";

export function useProvideFeedback({
  onError,
}: {
  onError?: (error: Error) => void;
} = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { collection } = useZAPI();

  const provideFeedback = async ({
    zapi,
    event,
    text,
    email,
    name,
  }: {
    zapi: ParcnetAPI;
    event: Event;
    text: string;
    email: string | undefined;
    name: string | undefined;
  }) => {
    setIsLoading(true);
    try {
      const podData = constructPODEntries({
        event,
        text,
        email,
        name,
      });
      const pod = await (zapi as ParcnetAPI).pod.sign(podData);
      (zapi as ParcnetAPI).pod.collection(collection ?? "")
        .insert(pod);
      await sendFeedback(event, pod);
    } catch (error) {
      onError?.(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    provideFeedback,
    isLoading,
  };
}

function constructPODEntries({
  event,
  text,
  email,
  name,
}: {
  event: Event;
  text: string;
  email: string | undefined;
  name: string | undefined;
}): PODEntries {
  const reverseHostname = globalThis.location.hostname.split(".").reverse()
    .join(".");

  return {
    code: {
      type: "string",
      value: event.uid,
    },
    zupass_display: {
      type: "string",
      value: "collectable",
    },
    zupass_title: {
      type: "string",
      value: `Feedback: ${event.title}`,
    },
    zupass_image_url: {
      type: "string",
      value:
        "https://icnyvghgspgzemdudsrd.supabase.co/storage/v1/object/public/global/logo.png",
    },
    zupass_description: {
      type: "string",
      value: text,
    },
    type: {
      type: "string",
      value: `${reverseHostname}/feedback`,
    },
    version: {
      type: "string",
      value: "1.0.0",
    },
    created_at: {
      type: "date",
      value: new Date(),
    },
    ...(name ? { name: { type: "string", value: name } } : {}),
    ...(email ? { email: { type: "string", value: email } } : {}),
  };
}

async function sendFeedback(event: Event, pod: PODData) {
  const response = await fetch(`/api/v1/events/${event.uid}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pod),
  });

  if (!response.ok) {
    throw new Error(`Failed to send feedback: ${response.statusText}`);
  }

  return response.json();
}
