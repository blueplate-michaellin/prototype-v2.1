//initiate webhook when the website render to allow api.ai send over GET request
import '/imports/api/public/api.js';

ServiceConfiguration.configurations.remove({
    service: "facebook"
});

ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: '1658815334192410',
    secret: '7d55362d11e8fe338e061111702e4989',
});

ServiceConfiguration.configurations.remove({
  service: "google"
});

ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: '443515033308-et1o2nfgfom025op5bm5unsfmfbimafl.apps.googleusercontent.com',
  secret: 'uDpIjX3dsylPJ5PJP2lwSFtm',
});
