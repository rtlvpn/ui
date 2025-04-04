<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <v-img src="@/assets/logo.svg" class="mx-auto my-6" width="200"></v-img>
        <h1 class="text-h4 font-weight-bold mb-4">{{ $t('homePage.title') }}</h1>
        <p class="text-body-1 mb-6">{{ $t('homePage.description') }}</p>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card rounded="xl" elevation="3" class="mb-6">
          <v-card-title class="text-h5 font-weight-bold">
            {{ $t('homePage.gettingStarted') }}
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(step, index) in $t('homePage.steps')" :key="index" :prepend-icon="`mdi-numeric-${index + 1}-circle`">
                <v-list-item-title class="text-subtitle-1 font-weight-medium">
                  {{ isStep(step) ? step.title : String(step) }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2">
                  {{ isStep(step) ? step.description : '' }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-row>
          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="3" height="100%">
              <v-card-title class="text-h6 font-weight-bold">{{ $t('homePage.quickAccess') }}</v-card-title>
              <v-card-text>
                <v-list lines="two">
                  <v-list-item :to="'/inbounds'" prepend-icon="mdi-cloud-download">
                    <v-list-item-title>{{ $t('pages.inbounds') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ $t('homePage.quickAccessDescriptions.inbounds') }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item :to="'/outbounds'" prepend-icon="mdi-cloud-upload">
                    <v-list-item-title>{{ $t('pages.outbounds') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ $t('homePage.quickAccessDescriptions.outbounds') }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item :to="'/rules'" prepend-icon="mdi-routes">
                    <v-list-item-title>{{ $t('pages.rules') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ $t('homePage.quickAccessDescriptions.rules') }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="3" height="100%">
              <v-card-title class="text-h6 font-weight-bold">{{ $t('homePage.export') }}</v-card-title>
              <v-card-text>
                <p class="text-body-2 mb-4">{{ $t('homePage.exportDescription') }}</p>
                <div class="d-flex justify-center">
                  <v-btn color="primary" :to="'/exportconfig'" prepend-icon="mdi-file-export" size="large">
                    {{ $t('homePage.exportButton') }}
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
// Define interface for step object
interface Step {
  title: string;
  description: string;
}

// Helper function to check if step is a Step object
const isStep = (step: any): step is Step => {
  return typeof step === 'object' && step !== null && 'title' in step && 'description' in step;
};
</script>
