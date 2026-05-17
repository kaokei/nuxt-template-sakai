import { AuthService } from '~/services/auth.service';

export default defineNuxtPlugin(() => {
  declareRootProviders([AuthService]);
});
