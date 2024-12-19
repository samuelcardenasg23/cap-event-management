using {API_BUSINESS_PARTNER as bupa} from '../srv/external/API_BUSINESS_PARTNER';

entity RemoteBusinessPartner as
    projection on bupa.A_BusinessPartner {
        key BusinessPartner          as ID,
            FirstName,
            LastName,
            BusinessPartnerIsBlocked as IsBlocked
    }
