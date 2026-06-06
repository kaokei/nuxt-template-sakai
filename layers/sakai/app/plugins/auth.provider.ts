import { AuthService } from '@sakai/services/auth.service';

export default defineNuxtPlugin(() => {
  declareRootProviders([AuthService]);
});
