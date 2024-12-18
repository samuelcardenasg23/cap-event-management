const cds = require("@sap/cds");

module.exports = cds.service.impl(async function () {
  // Get the entity definitions
  const { Events, Participants, EventParticipants } = this.entities;

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
  // Log entity definitions on service init
  console.log('EventParticipants definition:', cds.model.definitions['sap.cap.eventmanagement.EventParticipants']);

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
      // 1. Verify event exists and is active
      const event = await SELECT.one.from(Events).where({ ID: eventId });
      if (!event) {
        return req.error(404, `Event with ID ${eventId} not found`);
      }
      if (!event.IsActive || event.IsCancelled) {
        return req.error(
          400,
          `Event with ID ${eventId} is not available for registration`
        );
      }

      // 2. Start a transaction
      const tx = cds.transaction(req);

      // 3. Check if participant already exists
      let participant = await SELECT.one
        .from(Participants)
        .where({ Email: participantData.Email });

      // 4. If participant doesn't exist, create new one
      if (!participant) {
        // Get the next available ID
        const maxId = await SELECT.one`max(ID) as maxId`.from(Participants);
        const nextId = (maxId?.maxId || 0) + 1;

        // Create new participant
        participant = await tx.run(
          INSERT.into(Participants).entries({
            ID: nextId,
            FirstName: participantData.FirstName,
            LastName: participantData.LastName,
            Email: participantData.Email,
            Phone: participantData.Phone,
            BusinessPartnerID: participantData.BusinessPartnerID,
          })
        );
      }

      // Log participant data
      console.log('Participant:', participant);

      // 5. Check if already registered
      const existing = await SELECT.one.from(EventParticipants)
        .where({
          event_ID: eventId,
          participant_ID: participant.ID
        });

      if (existing) {
        return req.error(400, 'Participant is already registered for this event');
      }

      // 6. Create registration using association names
      const result = await tx.run(
        INSERT.into(EventParticipants).entries({
          event_ID: eventId,
          participant_ID: participant.ID,
          registrationDate: new Date().toISOString()
        })
      );

      console.log('Registration result:', result);

      console.log('Registration result:', result);

      // 7. Return the participant entity
      return await SELECT.one.from(Participants).where({ ID: participant.ID });

    } catch (error) {
      console.error("Error registering participant:", error);
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
