import { RouterService } from '~/services/router.service';
import { StorageService } from '~/services/storage.service';
import { UserService } from '~/services/user.service';

export default defineNuxtPlugin(() => {
  declareRootProviders([RouterService, StorageService, UserService]);

  const router = useRouter();

  const routerService = useRootService(RouterService);

  routerService.setRouter(router);
});
