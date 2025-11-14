type Props = { size?: number };

const SEQUENCE = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

const COLORS = {
  red: "#C40003",
  green: "#009A44",
  white: "#F7F7F7",
  black: "#1D1D1D",
  wire: "#0A0A0A",
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (Math.PI / 180) * angleDeg;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function ringArcPath(cx: number, cy: number, rInner: number, rOuter: number, startDeg: number, endDeg: number) {
  // Large-arc-flag for 18-degree sector is always 0
  const large = 0;
  const sweep = 1;
  const p1o = polarToCartesian(cx, cy, rOuter, startDeg);
  const p2o = polarToCartesian(cx, cy, rOuter, endDeg);
  const p2i = polarToCartesian(cx, cy, rInner, endDeg);
  const p1i = polarToCartesian(cx, cy, rInner, startDeg);
  return [
    `M ${p1o.x} ${p1o.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} ${sweep} ${p2o.x} ${p2o.y}`,
    `L ${p2i.x} ${p2i.y}`,
    `A ${rInner} ${rInner} 0 ${large} ${0} ${p1i.x} ${p1i.y}`,
    "Z",
  ].join(" ");
}

export default function Dartboard({ size = 600 }: Props) {
  const R = size / 2; // outer board radius

  // Radii (proportional, realistic look)
  const rDoubleOuter = R * 0.98;
  const rDoubleInner = R * 0.90;
  const rOuterSingleOuter = rDoubleInner;
  const rOuterSingleInner = R * 0.60;
  const rTripleOuter = R * 0.60;
  const rTripleInner = R * 0.52;
  const rInnerSingleOuter = rTripleInner;
  const rInnerSingleInner = R * 0.10;
  const rOuterBull = R * 0.10;
  const rInnerBull = R * 0.05;
  const rNumberRing = R * 1.10;

  const sectorAngle = 360 / 20;
  const startAngleOffset = -90; // Put 20 at the top

  return (
    <svg width={size} height={size} viewBox={`${-R} ${-R} ${size} ${size}`} role="img" aria-label="Dartboard">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Board background */}
      <circle cx={0} cy={0} r={R} fill={COLORS.black} filter="url(#shadow)" />

      {/* Outer single area (between double and triple) */}
      {SEQUENCE.map((num, i) => {
        const start = startAngleOffset + i * sectorAngle;
        const end = start + sectorAngle;
        const fill = i % 2 === 0 ? COLORS.white : COLORS.black;
        const d = ringArcPath(0, 0, rOuterSingleInner, rOuterSingleOuter, start, end);
        return <path key={`outer-single-${i}`} d={d} fill={fill} stroke={COLORS.wire} strokeWidth={1.5} />;
      })}

      {/* Double ring */}
      {SEQUENCE.map((num, i) => {
        const start = startAngleOffset + i * sectorAngle;
        const end = start + sectorAngle;
        const fill = i % 2 === 0 ? COLORS.green : COLORS.red;
        const d = ringArcPath(0, 0, rDoubleInner, rDoubleOuter, start, end);
        return <path key={`double-${i}`} d={d} fill={fill} stroke={COLORS.wire} strokeWidth={1.5} />;
      })}

      {/* Inner single area (between triple and bull) */}
      {SEQUENCE.map((num, i) => {
        const start = startAngleOffset + i * sectorAngle;
        const end = start + sectorAngle;
        const fill = i % 2 === 0 ? COLORS.white : COLORS.black;
        const d = ringArcPath(0, 0, rInnerSingleInner, rInnerSingleOuter, start, end);
        return <path key={`inner-single-${i}`} d={d} fill={fill} stroke={COLORS.wire} strokeWidth={1.5} />;
      })}

      {/* Triple ring */}
      {SEQUENCE.map((num, i) => {
        const start = startAngleOffset + i * sectorAngle;
        const end = start + sectorAngle;
        const fill = i % 2 === 0 ? COLORS.green : COLORS.red;
        const d = ringArcPath(0, 0, rTripleInner, rTripleOuter, start, end);
        return <path key={`triple-${i}`} d={d} fill={fill} stroke={COLORS.wire} strokeWidth={1.5} />;
      })}

      {/* Outer bull and inner bull */}
      <circle cx={0} cy={0} r={rOuterBull} fill={COLORS.green} stroke={COLORS.wire} strokeWidth={1.5} />
      <circle cx={0} cy={0} r={rInnerBull} fill={COLORS.red} stroke={COLORS.wire} strokeWidth={1.5} />

      {/* Number ring (outside) */}
      <g>
        {SEQUENCE.map((num, i) => {
          const angle = startAngleOffset + i * sectorAngle + sectorAngle / 2;
          const pos = polarToCartesian(0, 0, rNumberRing, angle);
          return (
            <g key={`num-${i}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${angle + 90})`}>
              <text
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={R * 0.09}
                fontWeight={700}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={4}
                paintOrder="stroke"
                style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}
              >
                {num}
              </text>
            </g>
          );
        })}
      </g>

      {/* Outer rim */}
      <circle cx={0} cy={0} r={rDoubleOuter} fill="none" stroke={COLORS.wire} strokeWidth={3} />
      <circle cx={0} cy={0} r={R * 1.06} fill="none" stroke="#333" strokeWidth={6} />
    </svg>
  );
}
