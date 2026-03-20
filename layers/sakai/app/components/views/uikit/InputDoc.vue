<script setup>
import { CountryService } from '@sakai/services/CountryService';
import { NodeService } from '@sakai/services/NodeService';

const floatValue = ref(null);
const autoValue = ref(null);
const selectedAutoValue = ref(null);
const autoFilteredValue = ref([]);
const calendarValue = ref(null);
const inputNumberValue = ref(null);
const sliderValue = ref(50);
const ratingValue = ref(null);
const colorValue = ref('#1976D2');
const radioValue = ref(null);
const checkboxValue = ref([]);
const switchValue = ref(false);
const listboxValues = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
]);
const listboxValue = ref(null);
const dropdownValues = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
]);
const dropdownValue = ref(null);
const multiselectValues = ref([
  { name: 'Australia', code: 'AU' },
  { name: 'Brazil', code: 'BR' },
  { name: 'China', code: 'CN' },
  { name: 'Egypt', code: 'EG' },
  { name: 'France', code: 'FR' },
  { name: 'Germany', code: 'DE' },
  { name: 'India', code: 'IN' },
  { name: 'Japan', code: 'JP' },
  { name: 'Spain', code: 'ES' },
  { name: 'United States', code: 'US' },
]);

const multiselectValue = ref(null);
const toggleValue = ref(false);
const selectButtonValue = ref(null);
const selectButtonValues = ref([
  { name: 'Option 1' },
  { name: 'Option 2' },
  { name: 'Option 3' },
]);
const knobValue = ref(50);
const inputGroupValue = ref(false);
const treeSelectNodes = ref(null);
const selectedNode = ref(null);

onMounted(() => {
  CountryService.getCountries().then((data) => (autoValue.value = data));
  NodeService.getTreeNodes().then((data) => (treeSelectNodes.value = data));
});

function searchCountry(event) {
  setTimeout(() => {
    if (!event.query.trim().length) {
      autoFilteredValue.value = [...autoValue.value];
    } else {
      autoFilteredValue.value = autoValue.value.filter((country) => {
        return country.name.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }
  }, 250);
}
</script>

<template>
  <PrimeFluid class="flex flex-col gap-8 md:flex-row">
    <div class="md:w-1/2">
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">InputText</div>
        <div class="flex flex-col gap-4 md:flex-row">
          <PrimeInputText type="text" placeholder="Default" />
          <PrimeInputText type="text" placeholder="Disabled" :disabled="true" />
          <PrimeInputText type="text" placeholder="Invalid" invalid />
        </div>

        <div class="text-xl font-semibold">Icons</div>
        <PrimeIconField>
          <PrimeInputIcon class="pi pi-user" />
          <PrimeInputText type="text" placeholder="Username" />
        </PrimeIconField>
        <PrimeIconField iconPosition="left">
          <PrimeInputText type="text" placeholder="Search" />
          <PrimeInputIcon class="pi pi-search" />
        </PrimeIconField>

        <div class="text-xl font-semibold">Float Label</div>
        <PrimeFloatLabel>
          <PrimeInputText id="username" type="text" v-model="floatValue" />
          <label for="username">Username</label>
        </PrimeFloatLabel>

        <div class="text-xl font-semibold">Textarea</div>
        <PrimeTextarea
          placeholder="Your Message"
          :autoResize="true"
          rows="3"
          cols="30"
        />

        <div class="text-xl font-semibold">AutoComplete</div>
        <PrimeAutoComplete
          v-model="selectedAutoValue"
          :suggestions="autoFilteredValue"
          optionLabel="name"
          placeholder="Search"
          dropdown
          multiple
          display="chip"
          @complete="searchCountry($event)"
        />

        <div class="text-xl font-semibold">DatePicker</div>
        <PrimeDatePicker
          :showIcon="true"
          :showButtonBar="true"
          v-model="calendarValue"
        ></PrimeDatePicker>

        <div class="text-xl font-semibold">InputNumber</div>
        <PrimeInputNumber
          v-model="inputNumberValue"
          showButtons
          mode="decimal"
        ></PrimeInputNumber>
      </div>

      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Slider</div>
        <PrimeInputText v-model.number="sliderValue" />
        <PrimeSlider v-model="sliderValue" />

        <div class="mt-6 flex flex-row">
          <div class="flex w-1/2 flex-col gap-4">
            <div class="text-xl font-semibold">Rating</div>
            <PrimeRating v-model="ratingValue" />
          </div>
          <div class="flex w-1/2 flex-col gap-4">
            <div class="text-xl font-semibold">ColorPicker</div>
            <PrimeColorPicker style="width: 2rem" v-model="colorValue" />
          </div>
        </div>

        <div class="text-xl font-semibold">Knob</div>
        <PrimeKnob
          v-model="knobValue"
          :step="10"
          :min="-50"
          :max="50"
          valueTemplate="{value}%"
        />
      </div>
    </div>
    <div class="md:w-1/2">
      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">RadioButton</div>
        <div class="flex flex-col gap-4 md:flex-row">
          <div class="flex items-center">
            <PrimeRadioButton
              id="option1"
              name="option"
              value="Chicago"
              v-model="radioValue"
            />
            <label for="option1" class="ml-2 leading-none">Chicago</label>
          </div>
          <div class="flex items-center">
            <PrimeRadioButton
              id="option2"
              name="option"
              value="Los Angeles"
              v-model="radioValue"
            />
            <label for="option2" class="ml-2 leading-none">Los Angeles</label>
          </div>
          <div class="flex items-center">
            <PrimeRadioButton
              id="option3"
              name="option"
              value="New York"
              v-model="radioValue"
            />
            <label for="option3" class="ml-2 leading-none">New York</label>
          </div>
        </div>

        <div class="text-xl font-semibold">Checkbox</div>
        <div class="flex flex-col gap-4 md:flex-row">
          <div class="flex items-center">
            <PrimeCheckbox
              id="checkOption1"
              name="option"
              value="Chicago"
              v-model="checkboxValue"
            />
            <label for="checkOption1" class="ml-2">Chicago</label>
          </div>
          <div class="flex items-center">
            <PrimeCheckbox
              id="checkOption2"
              name="option"
              value="Los Angeles"
              v-model="checkboxValue"
            />
            <label for="checkOption2" class="ml-2">Los Angeles</label>
          </div>
          <div class="flex items-center">
            <PrimeCheckbox
              id="checkOption3"
              name="option"
              value="New York"
              v-model="checkboxValue"
            />
            <label for="checkOption3" class="ml-2">New York</label>
          </div>
        </div>

        <div class="text-xl font-semibold">ToggleSwitch</div>
        <PrimeToggleSwitch v-model="switchValue" />
      </div>

      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">Listbox</div>
        <PrimeListbox
          v-model="listboxValue"
          :options="listboxValues"
          optionLabel="name"
          :filter="true"
        />

        <div class="text-xl font-semibold">Select</div>
        <PrimeSelect
          v-model="dropdownValue"
          :options="dropdownValues"
          optionLabel="name"
          placeholder="Select"
        />

        <div class="text-xl font-semibold">MultiSelect</div>
        <PrimeMultiSelect
          v-model="multiselectValue"
          :options="multiselectValues"
          optionLabel="name"
          placeholder="Select Countries"
          :filter="true"
        >
          <template #value="slotProps">
            <div
              class="mr-2 inline-flex items-center bg-primary px-2 py-1 text-primary-contrast rounded-border"
              v-for="option of slotProps.value"
              :key="option.code"
            >
              <span
                :class="'flag flag- mr-2' + option.code.toLowerCase()"
                style="width: 18px; height: 12px"
              />
              <div>{{ option.name }}</div>
            </div>
            <template v-if="!slotProps.value || slotProps.value.length === 0">
              <div class="p-1">Select Countries</div>
            </template>
          </template>
          <template #option="slotProps">
            <div class="flex items-center">
              <span
                :class="'flag flag- mr-2' + slotProps.option.code.toLowerCase()"
                style="width: 18px; height: 12px"
              />
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
        </PrimeMultiSelect>

        <div class="text-xl font-semibold">TreeSelect</div>
        <PrimeTreeSelect
          v-model="selectedNode"
          :options="treeSelectNodes"
          placeholder="Select Item"
        ></PrimeTreeSelect>
      </div>

      <div class="card flex flex-col gap-4">
        <div class="text-xl font-semibold">ToggleButton</div>
        <PrimeToggleButton
          v-model="toggleValue"
          onLabel="Yes"
          offLabel="No"
          :style="{ width: '10em' }"
        />

        <div class="text-xl font-semibold">SelectButton</div>
        <PrimeSelectButton
          v-model="selectButtonValue"
          :options="selectButtonValues"
          optionLabel="name"
        />
      </div>
    </div>
  </PrimeFluid>

  <PrimeFluid class="mt-8 flex">
    <div class="card flex w-full flex-col gap-4">
      <div class="text-xl font-semibold">InputGroup</div>
      <div class="flex flex-col gap-4 md:flex-row">
        <PrimeInputGroup>
          <PrimeInputGroupAddon>
            <i class="pi pi-user"></i>
          </PrimeInputGroupAddon>
          <PrimeInputText placeholder="Username" />
        </PrimeInputGroup>
        <PrimeInputGroup>
          <PrimeInputGroupAddon>
            <i class="pi pi-clock"></i>
          </PrimeInputGroupAddon>
          <PrimeInputGroupAddon>
            <i class="pi pi-star-fill"></i>
          </PrimeInputGroupAddon>
          <PrimeInputNumber placeholder="Price" />
          <PrimeInputGroupAddon>$</PrimeInputGroupAddon>
          <PrimeInputGroupAddon>.00</PrimeInputGroupAddon>
        </PrimeInputGroup>
      </div>
      <div class="flex flex-col gap-4 md:flex-row">
        <PrimeInputGroup>
          <PrimeButton label="Search" />
          <PrimeInputText placeholder="Keyword" />
        </PrimeInputGroup>
        <PrimeInputGroup>
          <PrimeInputGroupAddon>
            <PrimeCheckbox v-model="inputGroupValue" :binary="true" />
          </PrimeInputGroupAddon>
          <PrimeInputText placeholder="Confirm" />
        </PrimeInputGroup>
      </div>
    </div>
  </PrimeFluid>
</template>
