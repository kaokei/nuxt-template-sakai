<template>
  <div
    id="hero"
    class="flex flex-col overflow-hidden px-6 pt-6 lg:px-20"
    style="
      background:
        linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.2),
          rgba(255, 255, 255, 0.2)
        ),
        radial-gradient(
          77.36% 256.97% at 77.36% 57.52%,
          rgb(238, 239, 175) 0%,
          rgb(195, 227, 250) 100%
        );
      clip-path: ellipse(150% 87% at 93% 13%);
    "
  >
    <div class="mx-6 mt-0 md:mx-20 md:mt-6">
      <h1 class="text-6xl font-bold leading-tight text-gray-900">
        <span class="block font-light">Eu sem integer</span>eget magna fermentum
      </h1>
      <p class="text-2xl font-normal leading-normal text-gray-700 md:mt-4">
        Sed blandit libero volutpat sed cras. Fames ac turpis egestas integer.
        Placerat in egestas erat...
      </p>
      <PrimeButton
        label="Get Started"
        as="router-link"
        to="/"
        rounded
        class="text-xl! px-4! mt-8"
      ></PrimeButton>
    </div>
    <div class="flex justify-center md:justify-end">
      <img
        src="/demo/images/landing/screen-1.png"
        alt="Hero Image"
        class="w-9/12 md:w-auto"
      />
    </div>
  </div>
</template>
