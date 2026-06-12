import { useEffect } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "./useAppHooks";
import { addLiveNotification } from "../features/notifications/notificationSlice";

let socket;

export const useSocket = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && user._id) {
      socket = io(import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000", {
        withCredentials: true,
      });

      socket.on("connect", () => {
        socket.emit("join:user", user._id);
      });

      socket.on("notification", (payload) => {
        dispatch(addLiveNotification(payload));
        toast(payload.message, {
          icon: "🔔",
          style: {
            borderRadius: "12px",
            background: "#1e293b",
            color: "#fff",
          },
          duration: 5000,
        });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user, dispatch]);

  return socket;
};
