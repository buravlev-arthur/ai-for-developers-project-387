using TypeSpec.Http;

namespace EventCalendar.OwnerService {
  @route("/api/owner")
  @get
  op getOwner(): Owner;

  @route("/api/event-types")
  @post
  op createEventType(
    @body
    body: {
      name: string;
      description?: string | null;
      durationMinutes: int32;
    },
  ): EventType;

  @route("/api/event-types")
  @get
  op listEventTypes(): EventType[];

  @route("/api/appointments")
  @get
  op listAppointments(): Appointment[];
}
