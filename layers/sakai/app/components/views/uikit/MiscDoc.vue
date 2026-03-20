<script setup>
const value = ref(0);
let interval = null;

function startProgress() {
  interval = setInterval(() => {
    let newValue = value.value + Math.floor(Math.random() * 10) + 1;
    if (newValue >= 100) {
      newValue = 100;
    }
    value.value = newValue;
  }, 2000);
}

function endProgress() {
  clearInterval(interval);
  interval = null;
}

onMounted(() => {
  startProgress();
});

onBeforeUnmount(() => {
  endProgress();
});
</script>

<template>
  <div class="card">
    <div class="mb-4 text-xl font-semibold">ProgressBar</div>
    <div class="flex flex-col gap-4 md:flex-row">
      <div class="md:w-1/2">
        <PrimeProgressBar :value="value"></PrimeProgressBar>
      </div>
      <div class="md:w-1/2">
        <PrimeProgressBar :value="50" :showValue="false"></PrimeProgressBar>
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-8 md:flex-row">
    <div class="md:w-1/2">
      <div class="card">
        <div class="mb-4 text-xl font-semibold">Badge</div>
        <div class="flex gap-2">
          <PrimeBadge :value="2"></PrimeBadge>
          <PrimeBadge :value="8" severity="success"></PrimeBadge>
          <PrimeBadge :value="4" severity="info"></PrimeBadge>
          <PrimeBadge :value="12" severity="Warn"></PrimeBadge>
          <PrimeBadge :value="3" severity="danger"></PrimeBadge>
        </div>

        <div class="my-4 font-semibold">Overlay</div>
        <div class="flex gap-6">
          <PrimeOverlayBadge value="2">
            <i class="pi pi-bell" style="font-size: 2rem" />
          </PrimeOverlayBadge>
          <PrimeOverlayBadge value="4" severity="danger">
            <i class="pi pi-calendar" style="font-size: 2rem" />
          </PrimeOverlayBadge>
          <PrimeOverlayBadge severity="danger">
            <i class="pi pi-envelope" style="font-size: 2rem" />
          </PrimeOverlayBadge>
        </div>

        <div class="my-4 font-semibold">Button</div>
        <div class="flex gap-2">
          <PrimeButton label="Emails" badge="8" class="mr-2"></PrimeButton>
          <PrimeButton
            label="Messages"
            icon="pi pi-users"
            severity="warn"
            badge="8"
            badgeClass="p-badge-danger"
          ></PrimeButton>
        </div>

        <div class="my-4 font-semibold">Sizes</div>
        <div class="flex items-start gap-2">
          <PrimeBadge :value="2"></PrimeBadge>
          <PrimeBadge :value="4" size="large" severity="warn"></PrimeBadge>
          <PrimeBadge :value="6" size="xlarge" severity="success"></PrimeBadge>
        </div>
      </div>

      <div class="card">
        <div class="mb-4 text-xl font-semibold">Avatar</div>
        <div class="mb-4 font-semibold">Group</div>
        <PrimeAvatarGroup>
          <PrimeAvatar
            :image="'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'"
            size="large"
            shape="circle"
          ></PrimeAvatar>
          <PrimeAvatar
            :image="'https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png'"
            size="large"
            shape="circle"
          ></PrimeAvatar>
          <PrimeAvatar
            :image="'https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png'"
            size="large"
            shape="circle"
          ></PrimeAvatar>
          <PrimeAvatar
            :image="'https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png'"
            size="large"
            shape="circle"
          ></PrimeAvatar>
          <PrimeAvatar
            :image="'https://primefaces.org/cdn/primevue/images/avatar/xuxuefeng.png'"
            size="large"
            shape="circle"
          ></PrimeAvatar>
          <PrimeAvatar
            label="+2"
            shape="circle"
            size="large"
            :style="{ 'background-color': '#9c27b0', color: '#ffffff' }"
          ></PrimeAvatar>
        </PrimeAvatarGroup>

        <div class="my-4 font-semibold">Label - Circle</div>
        <PrimeAvatar label="P" class="mr-2" size="xlarge" shape="circle"></PrimeAvatar>
        <PrimeAvatar
          label="V"
          class="mr-2"
          size="large"
          :style="{ 'background-color': '#2196F3', color: '#ffffff' }"
          shape="circle"
        ></PrimeAvatar>
        <PrimeAvatar
          label="U"
          class="mr-2"
          :style="{ 'background-color': '#9c27b0', color: '#ffffff' }"
          shape="circle"
        ></PrimeAvatar>

        <div class="my-4 font-semibold">Icon - Badge</div>
        <PrimeOverlayBadge value="4" severity="danger" class="inline-flex">
          <PrimeAvatar label="U" size="xlarge" />
        </PrimeOverlayBadge>
      </div>

      <div class="card">
        <div class="mb-4 text-xl font-semibold">ScrollTop</div>
        <PrimeScrollPanel :style="{ width: '250px', height: '200px' }">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae et
            leo duis ut diam. Ultricies mi quis hendrerit dolor magna eget est
            lorem. Amet consectetur adipiscing elit ut. Nam libero justo laoreet
            sit amet. Pharetra massa massa ultricies mi quis hendrerit dolor
            magna. Est ultricies integer quis auctor elit sed vulputate.
            Consequat ac felis donec et. Tellus orci ac auctor augue mauris.
            Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus a.
            Tincidunt arcu non sodales neque sodales. Metus aliquam eleifend mi
            in nulla posuere sollicitudin aliquam ultrices. Sodales ut etiam sit
            amet nisl purus. Cursus sit amet dictum sit amet. Tristique senectus
            et netus et malesuada fames ac turpis egestas. Et tortor consequat
            id porta nibh venenatis cras sed. Diam maecenas ultricies mi eget
            mauris. Eget egestas purus viverra accumsan in nisl nisi. Suscipit
            adipiscing bibendum est ultricies integer. Mattis aliquam faucibus
            purus in massa tempor nec.
          </p>
          <PrimeScrollTop
            target="parent"
            :threshold="100"
            icon="pi pi-arrow-up"
          ></PrimeScrollTop>
        </PrimeScrollPanel>
      </div>
    </div>
    <div class="md:w-1/2">
      <div class="card">
        <div class="mb-4 text-xl font-semibold">Tag</div>
        <div class="mb-4 font-semibold">Default</div>
        <div class="flex gap-2">
          <PrimeTag value="Primary"></PrimeTag>
          <PrimeTag severity="success" value="Success"></PrimeTag>
          <PrimeTag severity="info" value="Info"></PrimeTag>
          <PrimeTag severity="warn" value="Warn"></PrimeTag>
          <PrimeTag severity="danger" value="Danger"></PrimeTag>
        </div>

        <div class="my-4 font-semibold">Pills</div>
        <div class="flex gap-2">
          <PrimeTag value="Primary" :rounded="true"></PrimeTag>
          <PrimeTag severity="success" value="Success" :rounded="true"></PrimeTag>
          <PrimeTag severity="info" value="Info" :rounded="true"></PrimeTag>
          <PrimeTag severity="warn" value="Warn" :rounded="true"></PrimeTag>
          <PrimeTag severity="danger" value="Danger" :rounded="true"></PrimeTag>
        </div>

        <div class="my-4 font-semibold">Icons</div>
        <div class="flex gap-2">
          <PrimeTag icon="pi pi-user" value="Primary"></PrimeTag>
          <PrimeTag icon="pi pi-check" severity="success" value="Success"></PrimeTag>
          <PrimeTag icon="pi pi-info-circle" severity="info" value="Info"></PrimeTag>
          <PrimeTag
            con="pi pi-exclamation-triangle"
            severity="warn"
            value="Warn"
          ></PrimeTag>
          <PrimeTag icon="pi pi-times" severity="danger" value="Danger"></PrimeTag>
        </div>
      </div>

      <div class="card">
        <div class="mb-4 text-xl font-semibold">Chip</div>
        <div class="mb-4 font-semibold">Basic</div>
        <div class="flex flex-col items-center sm:flex-row">
          <PrimeChip label="Action" class="mb-2 mr-2"></PrimeChip>
          <PrimeChip label="Comedy" class="mb-2 mr-2"></PrimeChip>
          <PrimeChip label="Mystery" class="mb-2 mr-2"></PrimeChip>
          <PrimeChip label="Thriller" :removable="true" class="mb-2"></PrimeChip>
        </div>

        <div class="my-4 font-semibold">Icon</div>
        <div class="flex flex-col items-center sm:flex-row">
          <PrimeChip label="Apple" icon="pi pi-apple" class="mb-2 mr-2"></PrimeChip>
          <PrimeChip label="Facebook" icon="pi pi-facebook" class="mb-2 mr-2"></PrimeChip>
          <PrimeChip label="Google" icon="pi pi-google" class="mb-2 mr-2"></PrimeChip>
          <PrimeChip
            label="Microsoft"
            icon="pi pi-microsoft"
            :removable="true"
            class="mb-2"
          ></PrimeChip>
        </div>

        <div class="my-4 font-semibold">Image</div>
        <div class="flex flex-col items-center sm:flex-row">
          <PrimeChip
            label="Amy Elsner"
            :image="'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'"
            class="mb-2 mr-2"
          ></PrimeChip>
          <PrimeChip
            label="Asiya Javayant"
            :image="'https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png'"
            class="mb-2 mr-2"
          ></PrimeChip>
          <PrimeChip
            label="Onyama Limba"
            :image="'https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png'"
            class="mb-2 mr-2"
          ></PrimeChip>
        </div>
      </div>

      <div class="card">
        <div class="mb-4 text-xl font-semibold">Skeleton</div>
        <div class="border p-6 border-surface rounded-border">
          <div class="mb-4 flex">
            <PrimeSkeleton shape="circle" size="4rem" class="mr-2"></PrimeSkeleton>
            <div>
              <PrimeSkeleton width="10rem" class="mb-2"></PrimeSkeleton>
              <PrimeSkeleton width="5rem" class="mb-2"></PrimeSkeleton>
              <PrimeSkeleton height=".5rem"></PrimeSkeleton>
            </div>
          </div>
          <PrimeSkeleton width="100%" height="150px"></PrimeSkeleton>
          <div class="mt-4 flex justify-between">
            <PrimeSkeleton width="4rem" height="2rem"></PrimeSkeleton>
            <PrimeSkeleton width="4rem" height="2rem"></PrimeSkeleton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
