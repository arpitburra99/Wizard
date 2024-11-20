import React, { useEffect, useState } from "react";

const App = () => {
  const [position, setPosition] = useState({ x: 300, y: 200 }); // Initial position
  const [target, setTarget] = useState(null);
  const [angle, setAngle] = useState(0); // Initially facing right (0 degrees)

  useEffect(() => {
    let animationFrame;

    const animate = () => {
      if (!target) return;

      const speed = 2; // Movement speed
      const dx = target.x - position.x;
      const dy = target.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy); // Total distance

      if (distance > 1) {
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        setPosition((prev) => ({
          x: prev.x + moveX,
          y: prev.y + moveY,
        }));
      } else {
        setTarget(null); // Stop animation when target is reached
      }

      animationFrame = requestAnimationFrame(animate);
    };

    if (target) {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [position, target]);

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();

    // Get target position
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;

    // Calculate the angle to face the target
    const dx = targetX - position.x;
    const dy = targetY - position.y;
    let radians = Math.atan2(dy, dx); // Get angle in radians
    let degrees = (radians * 180) / Math.PI; // Convert to degrees

    // Reverse the direction to make the **back** face the cursor
    degrees += 180;

    // Constrain the angle to keep it within 0°–360°
    if (degrees < 0) degrees += 360;

    setAngle(degrees); // Update angle to face the mouse
    setTarget({ x: targetX, y: targetY }); // Update the target position
  };

  return (
    <div
      className="container"
      onClick={handleClick}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f0f0f0",
        overflow: "hidden",
      }}
    >
      <div
        className="logo"
        style={{
          position: "absolute",
          top: position.y,
          left: position.x,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          transformOrigin: "center center",
        }}
      >
        <img
          src="https://www.wizard.financial/static/media/wizaart-img.56787174.gif"
          alt="Moving GIF"
          width="100"
        />
      </div>
    </div>
  );
};

export default App;
