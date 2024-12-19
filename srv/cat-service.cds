using {sap.cap.eventmanagement as my} from '../db/schema';

service EventCatalog {
    // BOUND actions - tied to specific Events
    entity Events            as
        projection on my.Events {
            *,
            registrations : redirected to EventParticipants
        }
        actions {
            // Cancel an event with a reason
            @cds.doc: 'Cancel an event and provide cancellation reason'
            action cancelEvent(reason : String) returns Events;

            // Reopen a cancelled event
            @cds.doc: 'Reopen a previously cancelled event'
            action reopenEvent()                returns Events;
        };

    // BOUND actions - tied to specific Participants
    entity Participants      as
        projection on my.Participants {
            *,
            registrations : redirected to EventParticipants
        }
        actions {
            // Fetch participant details from BP API
            @cds.doc: 'Fetch participant details from Business Partner API'
            action fetchParticipantDetails() returns {
                BusinessPartner : String;
            };
        };

    // Expose the pivot table
    entity EventParticipants as projection on my.EventParticipants;

    // UNBOUND actions/functions - service level
    action   createParticipant(BusinessPartnerID : String,
                               FirstName : String,
                               LastName : String,
                               Email : String,
                               Phone : String)            returns Participants;

    // Register participant for an event
    @cds.doc: 'Register a participant for a specific event'
    action   registerParticipant(eventId : Integer,
                                 participantId : Integer) returns Participants;

    // Get participants for a specific event
    type ParticipantInfo {
        ID                : Integer;
        FirstName         : String;
        LastName          : String;
        Email             : String;
        Phone             : String;
        BusinessPartnerID : String;
        registrationDate  : DateTime;
    };

    type EventInfo {
        ID                 : Integer;
        Name               : String;
        Description        : String;
        StartDate          : Date;
        EndDate            : Date;
        Location           : String;
        IsActive           : Boolean;
        IsCancelled        : Boolean;
        CancellationReason : String;
    };

    @cds.doc: 'Get all participants for a specific event'
    function getEventParticipants(eventId : Integer)      returns {
        event : EventInfo;
        participants : many ParticipantInfo;
    };
}
