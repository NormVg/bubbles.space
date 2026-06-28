import { eveChannel } from "eve/channels/eve";
import { localDev, none, vercelOidc } from "eve/channels/auth";

export default eveChannel({
  // Using none() for ease of local testing since Nuxt is communicating locally. 
  // For production, you may want to use vercelOidc() and localDev()
  auth: [none()]
});
