import { useState, useEffect, useMemo } from 'react';

export default function AIProcessingAnimation() {
  interface Pulse {
    id: number;
    connection: number;
    progress: number;
    reverse: boolean;
  }

  const [time, setTime] = useState(0);
  const [dotCount, setDotCount] = useState(1);
  const [activeNodes, setActiveNodes] = useState<Set<number>>(new Set());
  const [pulsePositions, setPulsePositions] = useState<Pulse[]>([]);

  // Define brain neural network structure
  const nodes = useMemo(() => [
    // Left hemisphere
    { id: 0, x: 85, y: 60 },
    { id: 1, x: 70, y: 80 },
    { id: 2, x: 60, y: 100 },
    { id: 3, x: 55, y: 125 },
    { id: 4, x: 65, y: 145 },
    { id: 5, x: 80, y: 160 },
    // Right hemisphere
    { id: 6, x: 115, y: 60 },
    { id: 7, x: 130, y: 80 },
    { id: 8, x: 140, y: 100 },
    { id: 9, x: 145, y: 125 },
    { id: 10, x: 135, y: 145 },
    { id: 11, x: 120, y: 160 },
    // Center/corpus callosum
    { id: 12, x: 100, y: 75 },
    { id: 13, x: 100, y: 100 },
    { id: 14, x: 100, y: 125 },
    { id: 15, x: 100, y: 150 },
    // Inner nodes
    { id: 16, x: 80, y: 95 },
    { id: 17, x: 120, y: 95 },
    { id: 18, x: 80, y: 130 },
    { id: 19, x: 120, y: 130 },
    // Top
    { id: 20, x: 100, y: 50 },
  ], []);

  // Define connections between nodes
  const connections = useMemo(() => [
    // Left side connections
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [0, 12], [1, 16], [2, 16], [3, 18], [4, 18],
    // Right side connections
    [6, 7], [7, 8], [8, 9], [9, 10], [10, 11],
    [6, 12], [7, 17], [8, 17], [9, 19], [10, 19],
    // Center connections
    [12, 13], [13, 14], [14, 15],
    [20, 0], [20, 6], [20, 12],
    // Cross connections
    [16, 13], [17, 13], [18, 14], [19, 14],
    [16, 17], [18, 19],
    [5, 15], [11, 15],
    // Additional neural paths
    [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11],
    [16, 18], [17, 19],
  ], []);

  // Main animation loop
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 5000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % duration;
      const progress = elapsed / duration;

      setTime(progress);
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Dot animation for text
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount(prev => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);

  // Random node flashing
  useEffect(() => {
    const flashInterval = setInterval(() => {
      const numFlashes = Math.floor(Math.random() * 3) + 1;
      const newActive = new Set<number>();
      for (let i = 0; i < numFlashes; i++) {
        newActive.add(Math.floor(Math.random() * nodes.length));
      }
      setActiveNodes(newActive);

      setTimeout(() => setActiveNodes(new Set<number>()), 300);
    }, 400);
    return () => clearInterval(flashInterval);
  }, [nodes.length]);

  // Pulse animations along connections
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      const connectionIndex = Math.floor(Math.random() * connections.length);
      const newPulse = {
        id: Date.now() + Math.random(),
        connection: connectionIndex,
        progress: 0,
        reverse: Math.random() > 0.5
      };
      setPulsePositions(prev => [...prev.slice(-8), newPulse]);
    }, 200);
    return () => clearInterval(pulseInterval);
  }, [connections.length]);

  // Update pulse positions
  useEffect(() => {
    const updatePulses = setInterval(() => {
      setPulsePositions(prev =>
        prev
          .map(p => ({ ...p, progress: p.progress + 0.08 }))
          .filter(p => p.progress <= 1)
      );
    }, 30);
    return () => clearInterval(updatePulses);
  }, []);

  // Dynamic color cycling
  // Cycle through hues based on time (0 to 1) * 360
  // Standard cyan is around 180deg. We can cycle continuously or oscillate.
  // Let's cycle continuously for a cool effect.
  const hue = (time * 360 + 180) % 360;
  const color = `hsl(${hue}, 100%, 50%)`;
  // colorRgb removed as it was unused

  const rotation = time * 360;

  // Calculate pulse position on a connection
  const getPulsePosition = (pulse: Pulse) => {
    const [startId, endId] = connections[pulse.connection];
    const start = nodes[startId];
    const end = nodes[endId];
    const progress = pulse.reverse ? 1 - pulse.progress : pulse.progress;
    return {
      x: start.x + (end.x - start.x) * progress,
      y: start.y + (end.y - start.y) * progress
    };
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #1a1f3a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        background: `radial-gradient(ellipse at center, hsla(${hue}, 100%, 50%, 0.06) 0%, transparent 60%)`,
        filter: 'blur(50px)'
      }} />

      {/* Main brain container */}
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>

        {/* Rotating outer ring */}
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          style={{
            position: 'absolute',
            top: '-20px',
            left: '-20px',
            transform: `rotate(${rotation}deg)`,
            filter: `drop-shadow(0 0 8px hsla(${hue}, 100%, 50%, 0.5))`
          }}
        >
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.1" />
              <stop offset="50%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="180 360"
          />
          {/* Secondary ring segments */}
          <circle
            cx="120"
            cy="120"
            r="105"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="20 40"
          />
        </svg>

        {/* Counter-rotating inner ring */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          style={{
            position: 'absolute',
            transform: `rotate(${-rotation * 0.5}deg)`,
            filter: `drop-shadow(0 0 4px hsla(${hue}, 100%, 50%, 0.3))`
          }}
        >
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.2"
            strokeDasharray="10 20"
          />
        </svg>

        {/* Neural network brain */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          style={{
            position: 'absolute',
            filter: `drop-shadow(0 0 15px hsla(${hue}, 100%, 50%, 0.4))`
          }}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Connection lines */}
          {connections.map(([startId, endId], index) => {
            const start = nodes[startId];
            const end = nodes[endId];
            const isActive = activeNodes.has(startId) || activeNodes.has(endId);
            return (
              <line
                key={index}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={color}
                strokeWidth={isActive ? 1.5 : 0.8}
                strokeOpacity={isActive ? 0.8 : 0.3}
                style={{ transition: 'stroke-opacity 0.2s, stroke-width 0.2s' }}
              />
            );
          })}

          {/* Traveling pulses */}
          {pulsePositions.map(pulse => {
            const pos = getPulsePosition(pulse);
            const opacity = pulse.progress < 0.2
              ? pulse.progress / 0.2
              : pulse.progress > 0.8
                ? (1 - pulse.progress) / 0.2
                : 1;
            return (
              <circle
                key={pulse.id}
                cx={pos.x}
                cy={pos.y}
                r="4"
                fill={color}
                opacity={opacity * 0.9}
                filter="url(#glow)"
              />
            );
          })}

          {/* Brain nodes */}
          {nodes.map((node) => {
            const isActive = activeNodes.has(node.id);
            const baseOpacity = 0.6 + Math.sin(time * Math.PI * 4 + node.id) * 0.2;
            return (
              <g key={node.id}>
                {/* Glow effect for active nodes */}
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="12"
                    fill="url(#nodeGlow)"
                    opacity="0.6"
                  />
                )}
                {/* Main node */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 5 : 3}
                  fill={color}
                  opacity={isActive ? 1 : baseOpacity}
                  filter={isActive ? "url(#glow)" : undefined}
                  style={{ transition: 'r 0.15s, opacity 0.15s' }}
                />
              </g>
            );
          })}

          {/* Brain outline hint */}
          <ellipse
            cx="100"
            cy="105"
            rx="55"
            ry="65"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeOpacity="0.15"
            strokeDasharray="4 8"
          />
        </svg>

        {/* Corner data indicators */}
        {[0, 1, 2, 3].map(i => {
          const angle = (i * 90 + 45) * Math.PI / 180;
          const radius = 85;
          const x = 100 + Math.cos(angle) * radius;
          const y = 100 + Math.sin(angle) * radius;
          const pulse = Math.sin(time * Math.PI * 4 + i * 1.5) * 0.5 + 0.5;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - 3,
                top: y - 3,
                width: '6px',
                height: '6px',
                backgroundColor: color,
                opacity: 0.3 + pulse * 0.4,
                transform: 'rotate(45deg)',
                boxShadow: `0 0 ${4 + pulse * 4}px hsla(${hue}, 100%, 50%, 0.5)`
              }}
            />
          );
        })}
      </div>

      {/* AI Analyzing text */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allow clicking through to background if needed, but links need pointer-events: auto
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {[
          { text: 'ABOUT', url: '/ai-business-leaders.html', angle: 0 },
          { text: 'SERVICE', url: '/custom-ai-training.html', angle: 70 },
          { text: 'TRAINING', url: '/ai-business-leaders.html', angle: 125 },
          { text: 'CONTACT US', url: '/custom-ai-training.html#contact-form', angle: 235 },
          { text: 'GET STARTED', url: '/ai-fundamentals.html', angle: 290 }
        ].map((item, index) => {
          // Calculate opacity based on time cycle
          // We want them to appear sequentially as color changes
          // Total cycle is 0..1
          // Each item has a "peak" time
          const peakTime = index * 0.2; // Adjusted for 5 items (1.0 / 5)
          const distance = Math.abs(time - peakTime);
          // handle wrap around for the last item/first item smoothly if needed, 
          // but simple distance check is fine for 0..1 interval if we treat it as circular
          let circularDistance = Math.min(distance, 1 - distance);

          // Make them visible for a quarter of the cycle
          // const opacity = Math.max(0, 1 - circularDistance * 4); // unused
          // Or maybe just always visible but active highlights? 
          // User said "show up", so let's vary opacity from 0.2 to 1
          // Make them visible for a quarter of the cycle
          // const activeOpacity = 0.2 + (Math.max(0, 1 - circularDistance * 5) * 0.8);
          // Make them simply visible all the time but pulsate opacity slightly
          // Actually user said "show up" as colors change, so keeping the fade effect is good,
          // but let's make the minimum opacity higher so it's easier to see even when "off"
          const activeOpacity = 0.4 + (Math.max(0, 1 - circularDistance * 5) * 0.6);

          const radius = 260; // Increased distance from center to fit larger text
          // Adjust angle to start from top (which is -90 deg in trig, but let's just use CSS transform)
          const rads = (item.angle - 90) * (Math.PI / 180);
          const x = Math.cos(rads) * radius;
          const y = Math.sin(rads) * radius;

          return (
            <a
              key={item.text}
              href={item.url}
              rel="noopener noreferrer"
              style={{
                position: 'absolute',
                transform: `translate(${x}px, ${y}px)`,
                color: color,
                fontSize: '24px', // Increased from 14px
                fontWeight: 700, // Thicker font
                letterSpacing: '0.2em',
                textDecoration: 'none',
                opacity: activeOpacity,
                pointerEvents: 'auto',
                textShadow: `0 0 15px hsla(${hue}, 100%, 50%, 0.5)`, // Stronger glow
                transition: 'color 0.2s, opacity 0.2s',
                cursor: 'pointer',
                padding: '10px',
                whiteSpace: 'nowrap' // Prevent wrapping
              }}
            >
              {item.text}
            </a>
          );
        })}
      </div>

      {/* Central status text */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <span style={{
          color: color,
          fontSize: '16px', // Increased from 12px
          fontWeight: 600,
          opacity: 0.9,
          letterSpacing: '0.5em',
          marginBottom: '15px'
        }}>
          EST AI CONSULTING
        </span>
        <div style={{ display: 'flex' }}>
          <span style={{
            color: color,
            fontSize: '24px', // Increased from 18px
            fontWeight: 500,
            letterSpacing: '0.25em',
            textShadow: `0 0 20px hsla(${hue}, 100%, 50%, 0.5), 0 0 40px hsla(${hue}, 100%, 50%, 0.3)`
          }}>
            INITIALIZING
          </span>
          <span style={{
            color: color,
            fontSize: '24px', // Increased from 18px
            fontWeight: 500,
            letterSpacing: '0.25em',
            width: '40px',
            textAlign: 'left',
            textShadow: `0 0 20px hsla(${hue}, 100%, 50%, 0.5)`
          }}>
            {'.'.repeat(dotCount)}
          </span>
        </div>
      </div>

      {/* Subtle data streams */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        display: 'flex',
        gap: '40px',
        opacity: 0.4
      }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '4px'
            }}
          >
            {[0, 1, 2, 3, 4].map(j => {
              const active = Math.sin(time * Math.PI * 8 + i + j * 0.5) > 0.3;
              return (
                <div
                  key={j}
                  style={{
                    width: '4px',
                    height: '12px',
                    backgroundColor: active ? color : `hsla(${hue}, 100%, 50%, 0.2)`,
                    borderRadius: '1px',
                    transition: 'background-color 0.15s'
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Scan line overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        pointerEvents: 'none'
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none'
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap');
      `}</style>
    </div>
  );
}