using {sap.cap.eventmanagement as my} from '../db/schema';

service EventCatalog {
    entity Events       as projection on my.Events;
    entity Participants as projection on my.Participants;
}
