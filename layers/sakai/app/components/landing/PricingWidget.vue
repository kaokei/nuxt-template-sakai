<template>
  <div id="pricing" class="my-2 px-6 py-6 md:my-6 lg:px-20">
    <div class="mb-6 text-center">
      <div
        class="mb-2 text-4xl font-normal text-surface-900 dark:text-surface-0"
      >
        Matchless Pricing
      </div>
      <span class="text-2xl text-muted-color"
        >Amet consectetur adipiscing elit...</span
      >
    </div>

    <div class="mt-20 grid grid-cols-12 justify-between gap-4 md:mt-0">
      <div class="col-span-12 p-0 md:p-4 lg:col-span-4">
        <div
          class="pricing-card flex cursor-pointer flex-col border-2 border-surface-200 p-4 transition-all duration-300 hover:border-primary dark:border-surface-600"
          style="border-radius: 10px"
        >
          <div
            class="my-8 text-center text-3xl text-surface-900 dark:text-surface-0"
          >
            Free
          </div>
          <img
            src="/demo/images/landing/free.svg"
            class="mx-auto w-10/12"
            alt="free"
          />
          <div class="my-8 flex flex-col items-center gap-4">
            <div class="flex items-center">
              <span
                class="mr-2 text-5xl font-bold text-surface-900 dark:text-surface-0"
                >$0</span
              >
              <span class="text-surface-600 dark:text-surface-200"
                >per month</span
              >
            </div>
            <PrimeButton
              label="Get Started"
              class="p-button-rounded ml-4 border-0 bg-blue-500 font-light leading-tight text-white"
            ></PrimeButton>
          </div>
          <PrimeDivider class="w-full bg-surface-200"></PrimeDivider>
          <ul
            class="my-8 flex list-none flex-col p-0 px-8 text-surface-900 dark:text-surface-0"
          >
            <li class="py-2">
              <i class="pi pi-fw pi-check mr-2 text-xl text-cyan-500"></i>
              <span class="text-xl leading-normal">Responsive Layout</span>
            </li>
            <li class="py-2">
              <i class="pi pi-fw pi-check mr-2 text-xl text-cyan-500"></i>
              <span class="text-xl leading-normal"
                >Unlimited Push Messages</span
              >
            </li>
            <li class="py-2">
              <i class="pi pi-fw pi-check mr-2 text-xl text-cyan-500"></i>
              <span class="text-xl leading-normal">50 Support Ticket</span>
            </li>
            <li class="py-2">
              <i class="pi pi-fw pi-check mr-2 text-xl text-cyan-500"></i>
              <span class="text-xl leading-normal">Free Shipping</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-span-12 mt-6 p-0 md:mt-0 md:p-4 lg:col-span-4">
        <div
          class="pricing-card flex cursor-pointer flex-col border-2 border-surface-200 p-4 transition-all duration-300 hover:border-primary dark:border-surface-600"
          style="border-radius: 10px"
        >
          <div
            class="my-8 text-center text-3xl text-surface-900 dark:text-surface-0"
          >
            Startup
          </div>
          <img
            src="/demo/images/landing/startup.svg"
            class="mx-auto w-10/12"
            alt="startup"
          />
          <div class="my-8 flex flex-col items-center gap-4">
            <div class="flex items-center">
              <span
                class="mr-2 text-5xl font-bold text-surface-900 dark:text-surface-0"
                >$1</span
              >
              <span class="text-surface-600 dark:text-surface-200"
                >per month</span
              >
            </div>
            <PrimeButton
              label="Get Started"
              class="p-button-rounded ml-4 border-0 bg-blue-500 font-light leading-tight text-white"
            ></PrimeButton>
          </div>
          <PrimeDivider class="w-full bg-surface-200"></PrimeDivider>
          <ul
            class="my-8 flex list-none flex-col p-0 px-8 text-surface-900 dark:text-surface-0"
          >
            <li class="py-2">
              <i class="pi pi-fw pi-check mr-2 text-xl text-cyan-500"></i>
              <span class="text-xl leading-normal">Responsive Layout</span>
            </li>
            <li class="py-2">
              <i class="pi pi-fw pi-check mr-2 text-xl text-cyan-500"></i>
              <span class="text-xl leading-normal"
                >Unlimited Push Messages</span
              >
            </li>
            <li class="py-2">
              <i class="pi pi-fw pi-check mr-2 text-xl text-cyan-500"></i>
              <span class="text-xl leading-normal">50 Support Ticket</span>
            </li>
            <li class="py-2">
              <i class="pi pi-fw pi-check mr-2 text-xl text-cyan-500"></i>
              <span class="text-xl leading-normal">Free Shipping</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-span-12 mt-6 p-0 md:mt-0 md:p-4 lg:col-span-4">
        <div
          class="pricing-card flex cursor-pointer flex-col border-2 border-surface-200 p-4 transition-all duration-300 hover:border-primary dark:border-surface-600"
          style="border-radius: 10px"
        >
          <div
            class="my-8 text-center text-3xl text-surface-900 dark:text-surface-0"
          >
            Enterprise
          </div>
          <img
            src="/demo/images/landing/enterprise.svg"
            class="mx-auto w-10/12"
            alt="enterprise"
          />
          <div class="my-8 flex flex-col items-center gap-4">
            <div class="flex items-center">
              <span
                class="mr-2 text-5xl font-bold text-surface-900 dark:text-surface-0"
                >$5</span
              >
              <span class="text-surface-600 dark:text-surface-200"
                >per month</span
              >
            </div>
            <PrimeButton
              label="Get Started"
              class="p-button-rounded ml-4 border-0 bg-blue-500 font-light leading-tight text-white"
            ></PrimeButton>
          </div>
          <PrimeDivider class="w-full bg-surface-200"></PrimeDivider>
          <ul
            class="my-8 flex list-none flex-col p-0 px-8 text-surface-900 dark:text-surface-0"
          >
            <li class="py-2">
              <i class="pi pi-fw pi-check mr-2 text-xl text-cyan-500"></i>
              <span class="text-xl leading-normal">Responsive Layout</span>
            </li>
            <li class="py-2">
              <i class="pi pi-fw pi-check mr-2 text-xl text-cyan-500"></i>
              <span class="text-xl leading-normal"
                >Unlimited Push Messages</span
              >
            </li>
            <li class="py-2">
              <i class="pi pi-fw pi-check mr-2 text-xl text-cyan-500"></i>
              <span class="text-xl leading-normal">50 Support Ticket</span>
            </li>
            <li class="py-2">
              <i class="pi pi-fw pi-check mr-2 text-xl text-cyan-500"></i>
              <span class="text-xl leading-normal">Free Shipping</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
