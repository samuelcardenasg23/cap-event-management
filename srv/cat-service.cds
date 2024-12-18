using {sap.cap.eventmanagement as my} from '../db/schema';

service EventCatalog {
    // BOUND actions - tied to specific Events
    entity Events       as projection on my.Events
        actions {
            // Cancel an event with a reason
            @cds.doc: 'Cancel an event and provide cancellation reason'
            action cancelEvent(reason : String) returns Events;

            // Reopen a cancelled event
            @cds.doc: 'Reopen a previously cancelled event'
            action reopenEvent()                returns Events;
        };

    // BOUND actions - tied to specific Participants
    entity Participants as projection on my.Participants
        actions {
            // Fetch participant details from BP API
            @cds.doc: 'Fetch participant details from Business Partner API'
            action fetchParticipantDetails() returns {
                BusinessPartner : String;
            // Add other BP fields you need
            };
        };

    // UNBOUND actions/functions - service level

    // Register participant for an event
    @cds.doc: 'Register a participant for a specific event'
    action   registerParticipant(eventId : Integer,
                                 participantData : {
        FirstName : String;
        LastName : String;
        Email : String;
        Phone : String;
        BusinessPartnerID : String;
    })                                               returns Participants;

    // Get participants for a specific event
    @cds.doc: 'Get all participants for a specific event'
    function getEventParticipants(eventId : Integer) returns array of Participants;
}

// using {sap.cap.eventmanagement as my} from '../db/schema';

// service EventCatalog {
//     entity Events       as projection on my.Events;
//     entity Participants as projection on my.Participants;
// }
