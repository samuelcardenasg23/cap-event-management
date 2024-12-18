const cds = require("@sap/cds");

module.exports = cds.service.impl(async function () {
  // Get the entity definitions
  const { Events, Participants } = this.entities;

  // BOUND actions for Events
  this.on("cancelEvent", async (req) => {
    try {
      const ID = req.params[0];
      const { reason } = req.data;

      // Check if event exists
      const event = await SELECT.one.from(Events).where({ ID: ID });

      if (!event) {
        return req.error(404, `Event with ID ${ID} not found`);
      }

      if (event.IsCancelled) {
        return req.error(400, `Event ${ID} is already cancelled`);
      }

      // Perform the update
      const tx = cds.transaction(req);
      await tx.run(
        UPDATE(Events)
          .set({
            IsCancelled: true,
            IsActive: false,
            CancellationReason: reason,
          })
          .where({ ID: ID })
      );

      // Return updated event
      return await SELECT.one.from(Events).where({ ID: ID });
    } catch (error) {
      return req.error(500, `Error cancelling event: ${error.message}`);
    }
  });

  this.on("reopenEvent", async (req) => {
    try {
      const ID = req.params[0];

      // Check if event exists
      const event = await SELECT.one.from(Events).where({ ID: ID });

      if (!event) {
        return req.error(404, `Event with ID ${ID} not found`);
      }

      if (!event.IsCancelled) {
        return req.error(400, `Event ${ID} is not cancelled`);
      }

      // Perform the update
      const tx = cds.transaction(req);
      await tx.run(
        UPDATE(Events)
          .set({
            IsCancelled: false,
            IsActive: true,
            CancellationReason: null,
          })
          .where({ ID: ID })
      );

      // Return updated event
      return await SELECT.one.from(Events).where({ ID: ID });
    } catch (error) {
      return req.error(500, `Error reopening event: ${error.message}`);
    }
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
      if (!event) {
        return req.error(404, `Event ${eventId} does not exist`);
      }
      if (!event.IsActive) {
        return req.error(400, `Event ${eventId} is not active`);
      }
      if (event.IsCancelled) {
        return req.error(400, `Event ${eventId} is cancelled`);
      }

      // Check if participant is already registered for this event
      const existingParticipant = await SELECT.one.from(Participants).where({
        Email: participantData.Email,
        Event_ID: eventId,
      });

      if (existingParticipant) {
        return req.error(
          400,
          `Participant with email ${participantData.Email} is already registered in Event ${eventId}`
        );
      }

      // Create the participant
      const tx = cds.transaction(req);
      const participant = await tx.run(
        INSERT.into(Participants).entries({
          ...participantData,
          Event_ID: eventId,
        })
      );

      // Return the created participant
      return await SELECT.one.from(Participants).where({ ID: participant.ID });
    } catch (error) {
      return req.error(500, `Error registering participant: ${error.message}`);
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
