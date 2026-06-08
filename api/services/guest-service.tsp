using TypeSpec.Http;

model Slot {
  id: string;
  timeStart: utcDateTime;
  timeEnd: utcDateTime;
  isAvailable: boolean;
}

model CreateAppointmentRequest {
  eventTypeId: string;
  timeSlotId: string;
  guest: Guest;
}

namespace EventCalendar {
  @route("/api/slots")
  @get
  op listSlots(
    @query
    eventTypeId: string,
    @query
    date: utcDateTime,
  ): Slot[];

  @route("/api/appointments")
  @post
  op createAppointment(@body body: CreateAppointmentRequest): Appointment;
}
