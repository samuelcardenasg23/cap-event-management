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
        Participants       : Association to many Participants
                                 on Participants.Event = $self;
}

entity Participants : managed {
    key ID                : Integer;
        FirstName         : String(100) not null;
        LastName          : String(100) not null;
        Email             : String(200) not null;
        Phone             : String(50);
        BusinessPartnerID : String(50) not null;
        Event             : Association to Events not null;
}
