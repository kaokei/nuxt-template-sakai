import { UserNotificationService } from '@sakai/services/UserNotificationService';

export default defineNuxtPlugin(() => {
  declareRootProviders([UserNotificationService]);
});
