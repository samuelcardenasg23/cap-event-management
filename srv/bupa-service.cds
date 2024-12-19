// using {API_BUSINESS_PARTNER as bupa} from './external/API_BUSINESS_PARTNER';
using {RemoteBusinessPartner} from '../db/myRemoteSchema';

service myBupa {
    // entity myBusinessPartner as projection on bupa.A_BusinessPartner;
    entity myBusinessPartner as projection on RemoteBusinessPartner;
}
