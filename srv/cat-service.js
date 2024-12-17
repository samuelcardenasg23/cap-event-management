const cds = require("@sap/cds");

module.exports = cds.service.impl(async function () {
  // Get the entity definitions
  const { Events, Participants } = this.entities;

  // BOUND actions for Events
  this.on("cancelEvent", Events, async (req) => {
    const { reason } = req.data;
    const { ID } = req.params[0];

    const tx = cds.transaction(req);
    const result = await tx.run(
      UPDATE(Events)
        .set({
          IsCancelled: true,
          IsActive: false,
          CancellationReason: reason,
        })
        .where({ ID: ID })
    );

    return result;
  });

  this.on("reopenEvent", Events, async (req) => {
    const { ID } = req.params[0];

    const tx = cds.transaction(req);
    const result = await tx.run(
      UPDATE(Events)
        .set({
          IsCancelled: false,
          IsActive: true,
          CancellationReason: null,
        })
        .where({ ID: ID })
    );

    return result;
  });

  // BOUND actions for Participants
  this.on("fetchParticipantDetails", Participants, async (req) => {
    const { ID } = req.params[0];

    try {
      // Here we'll add the Business Partner API integration
      // For now, returning mock data
      return {
        BusinessPartner: "BP001",
        // Add more fields as needed
      };
    } catch (error) {
      req.error(500, "Could not fetch participant details");
    }
  });

  // UNBOUND actions
  this.on("registerParticipant", async (req) => {
    const { eventId, participantData } = req.data;

    try {
      // First, verify the event exists and is active
      const event = await SELECT.one.from(Events).where({ ID: eventId });
      if (!event) req.error(404, `Event ${eventId} does not exist`);
      if (!event.IsActive) req.error(400, `Event ${eventId} is not active`);
      if (event.IsCancelled) req.error(400, `Event ${eventId} is cancelled`);

      // Create the participant
      const participant = await INSERT.into(Participants).entries({
        ...participantData,
        Event_ID: eventId,
      });

      return participant;
    } catch (error) {
      req.error(500, error.message);
    }
  });

  // UNBOUND functions
  this.on("getEventParticipants", async (req) => {
    const { eventId } = req.data;

    try {
      const participants = await SELECT.from(Participants).where({
        Event_ID: eventId,
      });
      return participants;
    } catch (error) {
      req.error(500, "Could not fetch participants");
    }
  });
});
