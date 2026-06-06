import { RouterService } from '@sakai/services/router.service';
import { StorageService } from '@sakai/services/storage.service';
import { UserService } from '@sakai/services/user.service';

export default defineNuxtPlugin(() => {
  declareRootProviders([RouterService, StorageService, UserService]);

  const router = useRouter();

  const routerService = useRootService(RouterService);

  routerService.setRouter(router);
});
