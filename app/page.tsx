import Dartboard from "../components/Dartboard";

export default function Page() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0b0b0b" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "#fff", marginBottom: 24, fontWeight: 600 }}>Dartboard (SVG)</h1>
        <Dartboard size={700} />
        <p style={{ color: "#aaa", marginTop: 16 }}>Standard colors, number ring, and realistic ring geometry.</p>
      </div>
    </main>
  );
}
