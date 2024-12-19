using {API_BUSINESS_PARTNER as bupa} from './external/API_BUSINESS_PARTNER';

service myBupa {
    entity myBusinessPartner as projection on bupa.A_BusinessPartner;
}
