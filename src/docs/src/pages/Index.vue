<template>
<Layout>
  <div class="d-flex justify-content-between align-items-stretch flex-wrap"> <!-- Header -->
    <div class="p-3 d-flex flex-row">
      <b-badge :variant="(activeStep === 0) ? 'primary' : ''">1</b-badge>
      <span class="d-flex align-items-start flex-column ml-2" :class="(activeStep === 0) ? 'font-weight-bold' : ''">Install MySQL</span>
    </div>
    <hr class="border-dark border align-self-center" style="flex: 1 1 0%;">
    <div class="p-3 d-flex flex-row">
      <b-badge :variant="(activeStep === 1) ? 'primary' : ''">2</b-badge>
      <span class="d-flex align-items-start flex-column ml-2" :class="(activeStep === 1) ? 'font-weight-bold' : ''">Install the Resource</span>
    </div>
    <hr class="border-dark border align-self-center" style="flex: 1 1 0%;">
    <div class="p-3 d-flex flex-row">
      <b-badge :variant="(activeStep === 2) ? 'primary' : ''">3</b-badge>
      <span class="d-flex align-items-start flex-column ml-2" :class="(activeStep === 2) ? 'font-weight-bold' : ''">Configure the FXServer</span>
    </div>
  </div>
  <div> <!-- Content -->
    <div v-html="activeContent" />
    <benchmark v-if="activeStep === 0" />
    <config-server v-if="activeStep === 2" />
  </div>
  <div class="d-flex flex-row justify-content-end p-4"> <!-- Action Buttons -->
    <b-button :disabled="(activeStep === 0) ? true : false" @click="activeStep -= 1" variant="primary">Previous</b-button>
    &nbsp;
    <b-button :disabled="(activeStep === 2) ? true : false" @click="activeStep += 1" variant="primary">Next</b-button>
  </div>
</Layout>
</template>

<script>
import { BBadge, BButton } from 'bootstrap-vue';
import Benchmark from '../components/Benchmark.vue'
import ConfigServer from '../components/ConfigFXServer.vue'
export default {
  components: {
    BBadge,
    BButton,
    Benchmark,
    ConfigServer,
  },
  data() {
    return {
      activeStep: 0,
    }
  },
  computed: {
    activeContent() {
      const thisStep = this.$page.allSetupStep.edges.find((step) => step.node.activeStep === this.activeStep);
      if (thisStep) return thisStep.node.content;
      return '';
    },
  },
}
</script>

<page-query>
query {
  allSetupStep(sortBy: "activeStep", order: ASC) {
    edges {
      node {
        path
        activeStep
        content
      }
    }
  }
}
</page-query>
