/**
 * LobbyRoom — primitive-geometry room shell. Short, mostly-linear space
 * (a hallway of cabinets, not an open free-roam floor) — see ROOM in
 * LobbyScene.jsx for the matching collision bounds.
 */
export default function LobbyRoom() {
  const length = 8.5; // Z depth
  const width = 4.4;  // X width
  const height = 3.2;

  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, length / 2]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#101314" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, length / 2]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#0a0c0d" roughness={1} />
      </mesh>

      {/* entrance wall */}
      <mesh position={[0, height / 2, -0.05]}>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#171b1d" roughness={0.9} />
      </mesh>

      {/* far wall */}
      <mesh position={[0, height / 2, length + 0.05]}>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#171b1d" roughness={0.9} />
      </mesh>

      {/* left wall — Pinehollow tint */}
      <mesh position={[-width / 2, height / 2, length / 2]}>
        <boxGeometry args={[0.1, height, length]} />
        <meshStandardMaterial color="#1a2620" roughness={0.9} />
      </mesh>

      {/* right wall — Pinehollow tint */}
      <mesh position={[width / 2, height / 2, length / 2]}>
        <boxGeometry args={[0.1, height, length]} />
        <meshStandardMaterial color="#1a2620" roughness={0.9} />
      </mesh>
    </group>
  );
}
