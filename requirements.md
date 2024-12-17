# Scenario: EventManagementSystem

**Objective**

Develop a CAP API for managing events and participants. The system should allow for the creation,
updating, and deletion of events and participants. Additionally, it should include features to cancel
and reopen events with appropriate logic.

**Requirements**

1. **Entities and Associations**

    ○ **Event**

       ■ Attributes:
        ■ ID: Integer(PrimaryKey)
        ■ Name: String
        ■ StartDate: Date
        ■ EndDate: Date
        ■ Location: String
        ■ Description: String
        ■ IsActive: Boolean
        ■ IsCancelled: Boolean
        ■ CancellationReason: String
        ■ Associations:
        ■ Participants: Association to Participant (1:N)
    ○ **Participant**

       ■ Attributes:
       ■ ID: Integer(PrimaryKey)
       ■ FirstName: String
       ■ LastName: String
       ■ Email: String
       ■ Phone: String
       ■ BusinessPartnerID: String(ForeignKey to BusinessPartnerAPI)
       ■ Associations:
       ■ Event: Association to Event (N:1)


2. **Services**

    ○ **EventService**

       ■ CRUD Operations:
       ■ createEvent: Create a new event
       ■ readEvents: Retrieve a list of events
       ■ updateEvent: Update an existing event
       ■ deleteEvent: Delete an event
       ■ Additional Operations:
       ■ registerParticipant: Register a participant for an event
       ■ getEventParticipants: Retrieve participants for a specific event
       ■ cancelEvent: Cancel an event with a reason
       ■ reopenEvent: Reopen a previously cancelled event
    ○ **ParticipantService**

       ■ CRUD Operations:
       ■ createParticipant: Create a new participant(Allow only when the BusinessPartnerID from the remote API exists)
       ■ readParticipants: Retrieve a list of participants
       ■ updateParticipant: Update an existing participant (All fields are allowed to be updated but BusinessPartnerID not)
       ■ deleteParticipant: Delete a participant
       ■ Additional Operations:
       ■ fetchParticipantDetails: Fetch participant details from the BusinessPartnerAPI


3. **Remote API Integration**

    Implement a service to fetch participant details from the BusinessPartnerAPI using the BusinessPartnerID attribute in the Participant entity.
4. **Additional Features**

    ○ **Event Registration:**

       ■ Allow participants to register for events through the registerParticipant operation.
       ■ Ensure that the participant is added to the Participants association of the Event.
    ○ **Cancel Event:**

       ■ Implement a cancelEvent action that sets the IsCancelled attribute to true and records the CancellationReason.
       ■ Ensure that the IsActive attribute is set to false when an event is cancelled.
    ○ **Reopen Event:**

       ■ Implement a reOpenEvent action that sets the IsCancelled attribute to false and clears the CancellationReason.
       ■ Ensure that the IsActive attribute is set to true when an event is reopened.

**SubmissionGuidelines**
- Your project should be submitted as a Git repository link.
- Include a README file with instructions on how to setup and run your project.
- Ensure your code is well-documented and follows best practices.
- Your Odata API must be deployed on BTP using CloudFoundry and HANA as a database.

**EvaluationCriteria**

- Correctness and completeness of the implementation.
- Code quality and adherence to best practices.
- Proper use of CAP features and remote API integration.
- Creativity and additional features implemented.

**RemoteAPI:**

Enpoint: https://my408665-api.s4hana.cloud.sap/sap/opu/odata/sap/API_BUSINESS_PARTNER/

**Credentials**
- Username: CAP_BOOTCAMP_S4_API_USER
- Password: WS$UGgbhkG8EEvUpccCgmedHhmHRiWeZVGfvcUPE


