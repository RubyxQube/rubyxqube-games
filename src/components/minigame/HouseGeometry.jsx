/**
 * HouseGeometry — reusable simple house shape (box body + pyramid roof).
 * Reused by HouseModel for the "straw" house type.
 */
export default function HouseGeometry({ wallColor = "#E3A857", roofColor = "#c9924a" }) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1, 1.4]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.15, 0.9, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.85} />
      </mesh>
    </group>
  );
}
