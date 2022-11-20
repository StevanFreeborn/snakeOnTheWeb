import keyMappings from "./keyMappings.js"

export const handleKeydown = (socket, key, state) => {
    const newVelocity = keyMappings[key];
    
    if (newVelocity) {
        state.player.velocity = newVelocity;
    }
}