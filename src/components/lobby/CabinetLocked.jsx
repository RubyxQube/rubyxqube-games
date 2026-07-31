import { Text } from "@react-three/drei";

/**
 * CabinetLocked — unlit/dark placeholder cabinet, "COMING SOON" placard,
 * no interaction, no invented game names or content. Purely a "there's
 * more coming" visual per the workspace's no-fabrication rule.
 */
export default function CabinetLocked({ position = [0, 0, 0], rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.9, 2, 0.7]} />
        <meshStandardMaterial color="#15181a" roughness={0.95} metalness={0.02} />
      </mesh>

      <mesh position={[0, 1.55, 0.36]}>
        <boxGeometry args={[0.74, 0.62, 0.05]} />
        <meshStandardMaterial color="#0a0c0d" roughness={0.95} />
      </mesh>

      {/* dark, unlit screen */}
      <mesh position={[0, 1.55, 0.39]}>
        <planeGeometry args={[0.6, 0.5]} />
        <meshStandardMaterial color="#050605" roughness={0.95} />
      </mesh>

      <Text
        position={[0, 1.55, 0.42]}
        fontSize={0.075}
        color="#5b6164"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.5}
        textAlign="center"
        font={undefined}
      >
        {"COMING\nSOON"}
      </Text>
    </group>
  );
}
