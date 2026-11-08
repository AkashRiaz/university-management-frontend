"use server";
import { revalidateTag } from "next/cache";

import { CreateRoomZodSchema } from "@/components/validations/room.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IRoom } from "@/types/room.type";

export type RoomActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IRoom | null;
};

export type RoomResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IRoom[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

type RoomQuery = {
  [key: string]: string | string[] | undefined;
};

const getQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
};

const getRoomPayload = (formData: FormData) => ({
  building: formData.get("building"),
  roomNumber: formData.get("roomNumber"),
  capacity: Number(formData.get("capacity")),
});

export const createRoomAction = async (
  _previousState: RoomActionState | null,
  formData: FormData,
): Promise<RoomActionState> => {
  revalidateTag("rooms", { expire: 0 });
  const validation = CreateRoomZodSchema.safeParse(getRoomPayload(formData));

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid room information",
      statusCode: 400,
    };
  }

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
      };
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(validation.data),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to create room",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Room created successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating room:", error);
    return {
      success: false,
      message: "Something went wrong while creating the room.",
      statusCode: 500,
    };
  }
};

export const updateRoomAction = async (
  _previousState: RoomActionState | null,
  formData: FormData,
): Promise<RoomActionState> => {
  revalidateTag("rooms", { expire: 0 });
  const roomId = formData.get("id");
  const validation = CreateRoomZodSchema.safeParse(getRoomPayload(formData));

  if (!roomId || typeof roomId !== "string") {
    return {
      success: false,
      message: "Room ID is required to update a room.",
      statusCode: 400,
    };
  }

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid room information",
      statusCode: 400,
    };
  }

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/rooms/${roomId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(validation.data),
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to update room",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Room updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating room:", error);
    return {
      success: false,
      message: "Something went wrong while updating the room.",
      statusCode: 500,
    };
  }
};

export type RoomDeleteState = {
  success: boolean;
  message: string;
  statusCode?: number;
};

export const deleteRoomAction = async (
  roomId: string,
): Promise<RoomDeleteState> => {
  revalidateTag("rooms", { expire: 0 });
  if (!roomId) {
    return {
      success: false,
      message: "Room ID is required to delete a room.",
      statusCode: 400,
    };
  }

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/rooms/${roomId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Failed to delete room",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Room deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting room:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the room.",
      statusCode: 500,
    };
  }
};

export const getAllRoomsAction = async ({
  query,
}: { query?: RoomQuery } = {}): Promise<RoomResponse> => {
  const params = new URLSearchParams();
  const searchTerm = getQueryValue(query?.searchTerm);
  const page = getQueryValue(query?.page);
  const limit = getQueryValue(query?.limit);

  if (searchTerm) params.set("searchTerm", searchTerm);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
        data: null,
      };
    }

    const queryString = params.toString();
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/rooms${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["rooms"] },
      },
    );
    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch rooms",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Rooms fetched successfully",
      statusCode: response.status,
      data: Array.isArray(result?.data)
        ? result.data
        : result?.data?.data || null,
      meta: result?.meta || result?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return {
      success: false,
      message: "An error occurred while fetching rooms",
      statusCode: 500,
      data: null,
    };
  }
};
