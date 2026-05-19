import { UserNotificationService } from '~/services/UserNotificationService';

export default defineNuxtPlugin(() => {
  declareRootProviders([UserNotificationService]);
});
