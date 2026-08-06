"use client";

import { useCallback, useEffect, useState } from "react";

import { Memory, NewMemoryInput } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type ApiError = { error?: { message?: string } };

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let payload: ApiError = {};
    try {
      payload = await response.json();
    } catch {
      // Keep the generic error when the server did not return JSON.
    }
    throw new Error(payload.error?.message ?? "Something went wrong. Please try again.");
  }
  return response.json();
}

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [childId, setChildId] = useState<number>();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const childrenResponse = await fetch(`${API_URL}/api/children`, {
          credentials: "include",
        });
        const childrenPayload = await readResponse<{ data: Array<{ id: number }> }>(childrenResponse);
        const firstChild = childrenPayload.data[0];

        if (!firstChild) {
          if (active) setError("Create a child profile before adding memories.");
          return;
        }

        const memoriesResponse = await fetch(
          `${API_URL}/api/memories?childId=${firstChild.id}`,
          { credentials: "include" },
        );
        const memoriesPayload = await readResponse<{ data: Memory[] }>(memoriesResponse);

        if (active) {
          setChildId(firstChild.id);
          setMemories(memoriesPayload.data);
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : "Could not load memories.");
        }
      } finally {
        if (active) setIsReady(true);
      }
    }

    void load();
    return () => { active = false; };
  }, []);

  const addMemory = useCallback(async (input: NewMemoryInput) => {
    if (!childId) throw new Error("Create a child profile before adding memories.");
    setError("");

    let mediaAssetId: string | undefined;
    if (input.file) {
      const presignResponse = await fetch(`${API_URL}/api/uploads/presign`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          fileName: input.file.name,
          contentType: input.file.type,
          sizeBytes: input.file.size,
        }),
      });
      const presignPayload = await readResponse<{
        data: { assetId: string; uploadUrl: string; headers: Record<string, string> };
      }>(presignResponse);

      const uploadResponse = await fetch(presignPayload.data.uploadUrl, {
        method: "PUT",
        headers: presignPayload.data.headers,
        body: input.file,
      });
      if (!uploadResponse.ok) {
        throw new Error("The media upload failed. Please try again.");
      }
      mediaAssetId = presignPayload.data.assetId;
    }

    const createResponse = await fetch(`${API_URL}/api/memories`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId,
        kind: input.kind.toUpperCase(),
        title: input.title,
        description: input.description,
        capturedAt: input.date,
        ...(mediaAssetId ? { mediaAssetId } : {}),
      }),
    });
    const payload = await readResponse<{ data: Memory }>(createResponse);
    setMemories((current) => [payload.data, ...current]);
  }, [childId]);

  const deleteMemory = useCallback(async (id: string) => {
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/memories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Could not delete this memory.");
      }
      setMemories((current) => current.filter((memory) => memory.id !== id));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not delete this memory.");
    }
  }, []);

  return { memories, isReady, error, addMemory, deleteMemory };
}
