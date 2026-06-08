import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";
import "./models/enums.tsp";
import "./models/time.tsp";
import "./models/owner.tsp";
import "./models/event-type.tsp";
import "./models/time-slot.tsp";
import "./models/guest.tsp";
import "./models/appointment.tsp";
import "./services/owner-service.tsp";
import "./services/guest-service.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

@service(#{ title: "Event Calendar API" })
namespace EventCalendar;
