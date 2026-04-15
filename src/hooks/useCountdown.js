import { useEffect } from "react";

function useCountdown({ isRunning, timeLeft, setTimeLeft, onExpire }) {
  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, setTimeLeft, onExpire]);
}

export default useCountdown;
