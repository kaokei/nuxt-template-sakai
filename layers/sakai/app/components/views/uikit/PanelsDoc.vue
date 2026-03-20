<script setup>
const items = ref([
  {
    label: 'Save',
    icon: 'pi pi-check',
  },
  {
    label: 'Update',
    icon: 'pi pi-upload',
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
  },
  {
    label: 'Home Page',
    icon: 'pi pi-home',
  },
]);
const cardMenu = ref([
  { label: 'Save', icon: 'pi pi-fw pi-check' },
  { label: 'Update', icon: 'pi pi-fw pi-refresh' },
  { label: 'Delete', icon: 'pi pi-fw pi-trash' },
]);
const menuRef = ref(null);

function toggle() {
  menuRef.value.toggle(event);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="card">
      <div class="mb-4 text-xl font-semibold">Toolbar</div>
      <PrimeToolbar>
        <template #start>
          <PrimeButton icon="pi pi-plus" class="mr-2" severity="secondary" text />
          <PrimeButton icon="pi pi-print" class="mr-2" severity="secondary" text />
          <PrimeButton icon="pi pi-upload" severity="secondary" text />
        </template>

        <template #center>
          <PrimeIconField>
            <PrimeInputIcon>
              <i class="pi pi-search" />
            </PrimeInputIcon>
            <PrimeInputText placeholder="Search" />
          </PrimeIconField>
        </template>

        <template #end>
          <PrimeSplitButton label="Save" :model="items"></PrimeSplitButton
        ></template>
      </PrimeToolbar>
    </div>

    <div class="flex flex-col gap-8 md:flex-row">
      <div class="md:w-1/2">
        <div class="card">
          <div class="mb-4 text-xl font-semibold">Accordion</div>
          <PrimeAccordion value="0">
            <PrimeAccordionPanel value="0">
              <PrimeAccordionHeader>Header I</PrimeAccordionHeader>
              <PrimeAccordionContent>
                <p class="m-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
              </PrimeAccordionContent>
            </PrimeAccordionPanel>
            <PrimeAccordionPanel value="1">
              <PrimeAccordionHeader>Header II</PrimeAccordionHeader>
              <PrimeAccordionContent>
                <p class="m-0">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
                  quia voluptas sit aspernatur aut odit aut fugit, sed quia
                  consequuntur magni dolores eos qui ratione voluptatem sequi
                  nesciunt. Consectetur, adipisci velit, sed quia non numquam
                  eius modi.
                </p>
              </PrimeAccordionContent>
            </PrimeAccordionPanel>
            <PrimeAccordionPanel value="2">
              <PrimeAccordionHeader>Header III</PrimeAccordionHeader>
              <PrimeAccordionContent>
                <p class="m-0">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias excepturi sint occaecati cupiditate
                  non provident, similique sunt in culpa qui officia deserunt
                  mollitia animi, id est laborum et dolorum fuga. Et harum
                  quidem rerum facilis est et expedita distinctio. Nam libero
                  tempore, cum soluta nobis est eligendi optio cumque nihil
                  impedit quo minus.
                </p>
              </PrimeAccordionContent>
            </PrimeAccordionPanel>
          </PrimeAccordion>
        </div>
        <div class="card">
          <div class="mb-4 text-xl font-semibold">Tabs</div>
          <PrimeTabs value="0">
            <PrimeTabList>
              <PrimeTab value="0">Header I</PrimeTab>
              <PrimeTab value="1">Header II</PrimeTab>
              <PrimeTab value="2">Header III</PrimeTab>
            </PrimeTabList>
            <PrimeTabPanels>
              <PrimeTabPanel value="0">
                <p class="m-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
              </PrimeTabPanel>
              <PrimeTabPanel value="1">
                <p class="m-0">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
                  quia voluptas sit aspernatur aut odit aut fugit, sed quia
                  consequuntur magni dolores eos qui ratione voluptatem sequi
                  nesciunt. Consectetur, adipisci velit, sed quia non numquam
                  eius modi.
                </p>
              </PrimeTabPanel>
              <PrimeTabPanel value="2">
                <p class="m-0">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias excepturi sint occaecati cupiditate
                  non provident, similique sunt in culpa qui officia deserunt
                  mollitia animi, id est laborum et dolorum fuga. Et harum
                  quidem rerum facilis est et expedita distinctio. Nam libero
                  tempore, cum soluta nobis est eligendi optio cumque nihil
                  impedit quo minus.
                </p>
              </PrimeTabPanel>
            </PrimeTabPanels>
          </PrimeTabs>
        </div>
      </div>
      <div class="mt-6 md:mt-0 md:w-1/2">
        <div class="card">
          <div class="mb-4 text-xl font-semibold">Panel</div>
          <PrimePanel header="Header" :toggleable="true">
            <p class="m-0 leading-normal">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </PrimePanel>
        </div>
        <div class="card">
          <div class="mb-4 text-xl font-semibold">Fieldset</div>
          <PrimeFieldset legend="Legend" :toggleable="true">
            <p class="m-0 leading-normal">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </PrimeFieldset>
        </div>

        <PrimeCard>
          <template v-slot:title>
            <div class="mb-0 flex items-center justify-between">
              <div class="mb-4 text-xl font-semibold">Card</div>
              <PrimeButton icon="pi pi-plus" class="p-button-text" @click="toggle" />
            </div>
            <PrimeMenu
              id="config_menu"
              ref="menuRef"
              :model="cardMenu"
              :popup="true"
            />
          </template>

          <template v-slot:content>
            <p class="m-0 leading-normal">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </template>
        </PrimeCard>
      </div>
    </div>

    <div class="card mt-8">
      <div class="mb-4 text-xl font-semibold">Divider</div>
      <div class="flex flex-col md:flex-row">
        <div
          class="flex w-full flex-col items-center justify-center gap-3 py-5 md:w-5/12"
        >
          <div class="flex flex-col gap-2">
            <label for="username">Username</label>
            <PrimeInputText id="username" type="text" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="password">Password</label>
            <PrimeInputText id="password" type="password" />
          </div>
          <div class="flex">
            <PrimeButton
              label="Login"
              icon="pi pi-user"
              class="mx-auto w-full max-w-[17.35rem]"
            ></PrimeButton>
          </div>
        </div>
        <div class="w-full md:w-2/12">
          <PrimeDivider layout="vertical" class="hidden! md:flex!"
            ><b>OR</b></PrimeDivider
          >
          <PrimeDivider layout="horizontal" class="flex! md:hidden!" align="center"
            ><b>OR</b></PrimeDivider
          >
        </div>
        <div class="flex w-full items-center justify-center py-5 md:w-5/12">
          <PrimeButton
            label="Sign Up"
            icon="pi pi-user-plus"
            severity="success"
            class="mx-auto w-full max-w-[17.35rem]"
          ></PrimeButton>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="mb-4 text-xl font-semibold">Splitter</div>
      <PrimeSplitter style="height: 300px" class="mb-8">
        <PrimeSplitterPanel :size="30" :minSize="10">
          <div className="h-full flex items-center justify-center">Panel 1</div>
        </PrimeSplitterPanel>
        <PrimeSplitterPanel :size="70">
          <PrimeSplitter layout="vertical">
            <PrimeSplitterPanel :size="15">
              <div className="h-full flex items-center justify-center">
                Panel 2
              </div>
            </PrimeSplitterPanel>
            <PrimeSplitterPanel :size="50">
              <div className="h-full flex items-center justify-center">
                Panel 3
              </div>
            </PrimeSplitterPanel>
          </PrimeSplitter>
        </PrimeSplitterPanel>
      </PrimeSplitter>
    </div>
  </div>
</template>
