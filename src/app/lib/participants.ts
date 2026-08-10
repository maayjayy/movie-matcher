export function getOrCreateParticipantId(): string {
    const existing = localStorage.getItem("participantId");
    if (existing) return existing;

    const newId = Math.random().toString(36).substring(2, 10);
    localStorage.setItem("participantId", newId);
    return newId;
}