// Normalized (-1..1) window pointer position, written by a listener and read
// inside useFrame. A plain mutable object keeps pointer movement out of React.
export const pointer = { x: 0, y: 0 };
