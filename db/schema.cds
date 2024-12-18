using {managed} from '@sap/cds/common';

namespace sap.cap.eventmanagement;

entity Events : managed {
    key ID                 : Integer;
        Name               : String(100) not null;
        StartDate          : Date not null;
        EndDate            : Date not null;
        Location           : String(200) not null;
        Description        : String(1000);
        IsActive           : Boolean default true not null;
        IsCancelled        : Boolean default false not null;
        CancellationReason : String(500);
        registrations      : Association to many EventParticipants
                                 on registrations.event = $self;
}

entity Participants : managed {
    key ID                : Integer;
        FirstName         : String(100) not null;
        LastName          : String(100) not null;
        Email             : String(200) not null;
        Phone             : String(50);
        BusinessPartnerID : String(50) not null;
        registrations     : Association to many EventParticipants
                                on registrations.participant = $self;
}

// Pivot table
entity EventParticipants {
    key event            : Association to Events;
    key participant      : Association to Participants;
        registrationDate : DateTime default $now;
}
