model EventType {
  id: string;
  name: string;
  description?: string | null;
  durationMinutes: int32;
}