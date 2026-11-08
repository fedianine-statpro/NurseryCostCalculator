import { useEffect, useRef, useState } from "react";
export function World() {
  const [lantern, setLantern] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className={"painted-world" + (lantern ? " lantern-awake" : "")}>
      <img
        className="woodland-art"
        src={import.meta.env.BASE_URL + "images/world/christmas-woodland.webp"}
        alt=""
        fetchPriority="high"
      />
      <div className="world-shade" aria-hidden="true" />
      <div className="world-fireflies" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <i
            key={i}
            style={{
              left: 9 + i * 6.2 + "%",
              top: 35 + ((i * 13) % 47) + "%",
              animationDelay: -i * 0.7 + "s",
            }}
          />
        ))}
      </div>
      <button
        className="lantern-touch"
        aria-label="Wake the woodland lantern"
        onClick={() => {
          setLantern(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setLantern(false), 4200);
        }}
      >
        <span aria-hidden="true" />
      </button>
      <div className="lantern-rings" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
