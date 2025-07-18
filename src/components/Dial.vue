<template>
  <v-card :subtitle="$t('objects.dial')" style="background-color: inherit;">
    <v-row>
      <v-col cols="12" sm="6" md="4" v-if="optionDetour">
        <v-select
          hide-details
          :label="$t('dial.detourText')"
          :items="outTags"
          v-model="dial.detour">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="4" v-if="optionBind">
        <v-text-field
        :label="$t('dial.bindIf')"
        hide-details
        v-model="dial.bind_interface"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-if="optionIPV4">
        <v-text-field
        :label="$t('dial.bindIp4')"
        hide-details
        v-model="dial.inet4_bind_address"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4" v-if="optionIPV6">
        <v-text-field
        :label="$t('dial.bindIp6')"
        hide-details
        v-model="dial.inet6_bind_address"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-if="optionRM">
        <v-text-field
        label="Linux Routing Mark"
        hide-details
        type="number"
        min="0"
        v-model.number="routingMark"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4" v-if="optionRA">
        <v-switch v-model="dial.reuse_addr" color="primary" :label="$t('dial.reuseAddr')" hide-details></v-switch>
      </v-col>
    </v-row>
    <v-row v-if="optionTCP">
      <v-col cols="12" sm="6" md="4">
        <v-switch v-model="dial.tcp_fast_open" color="primary" label="TCP Fast Open" hide-details></v-switch>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-switch v-model="dial.tcp_multi_path" color="primary" label="TCP Multi Path" hide-details></v-switch>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-if="optionUDP">
        <v-switch v-model="dial.udp_fragment" color="primary" label="UDP Fragment" hide-details></v-switch>
      </v-col>
      <v-col cols="12" sm="6" md="4" v-if="optionCT">
        <v-text-field
        :label="$t('dial.connTimeout')"
        hide-details
        type="number"
        min="1"
        :suffix="$t('date.s')"
        v-model.number="connectTimeout"></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="optionDS">
      <v-col cols="12" sm="6" md="4">
        <v-select
            hide-details
            :label="$t('listen.domainStrategy')"
            :items="['prefer_ipv4','prefer_ipv6','ipv4_only','ipv6_only']"
            v-model="dial.domain_strategy">
          </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field
        :label="$t('dial.fbTimeout')"
        hide-details
        type="number"
        min="50"
        step="50"
        :suffix="$t('date.ms')"
        v-model.number="fallbackDelay"></v-text-field>
      </v-col>
    </v-row>
    <v-card-actions class="pt-0">
      <v-spacer></v-spacer>
      <v-menu v-model="menu" :close-on-content-click="false" location="start">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" hide-details variant="tonal">{{ $t('dial.options') }}</v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item>
              <Win98Toggle v-model="optionDetour" color="primary" :label="$t('listen.detour')" hide-details></Win98Toggle>
            </v-list-item>
            <v-list-item>
              <Win98Toggle v-model="optionBind" color="primary" :label="$t('dial.bindIf')" hide-details></Win98Toggle>
            </v-list-item>
            <v-list-item>
              <Win98Toggle v-model="optionIPV4" color="primary" :label="$t('dial.bindIp4')" hide-details></Win98Toggle>
            </v-list-item>
            <v-list-item>
              <Win98Toggle v-model="optionIPV6" color="primary" :label="$t('dial.bindIp6')" hide-details></Win98Toggle>
            </v-list-item>
            <v-list-item>
              <Win98Toggle v-model="optionRM" color="primary" label="Routing Mark" hide-details></Win98Toggle>
            </v-list-item>
            <v-list-item>
              <Win98Toggle v-model="optionRA" color="primary" :label="$t('dial.reuseAddr')" hide-details></Win98Toggle>
            </v-list-item>
            <v-list-item>
              <Win98Toggle v-model="optionTCP" color="primary" :label="$t('listen.tcpOptions')" hide-details></Win98Toggle>
            </v-list-item>
            <v-list-item>
              <Win98Toggle v-model="optionUDP" color="primary" :label="$t('listen.udpOptions')" hide-details></Win98Toggle>
            </v-list-item>
            <v-list-item>
              <Win98Toggle v-model="optionCT" color="primary" :label="$t('dial.connTimeout')" hide-details></Win98Toggle>
            </v-list-item>
            <v-list-item>
              <Win98Toggle v-model="optionDS" color="primary" :label="$t('listen.domainStrategy')" hide-details></Win98Toggle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
export default {
  props: ['dial', 'outTags'],
  data() {
    return {
      menu: false
    }
  },
  computed: {
    fallbackDelay: {
      get() { return this.$props.dial.fallback_delay ? parseInt(this.$props.dial.fallback_delay.replace('ms','')) : 300 },
      set(newValue:number) { this.$props.dial.fallback_delay = newValue > 0 ? newValue + 'ms' : '300ms' }
    },
    connectTimeout: {
      get() { return this.$props.dial.connect_timeout ? parseInt(this.$props.dial.connect_timeout.replace('s','')) : 5 },
      set(newValue:number) { this.$props.dial.connect_timeout = newValue > 0 ? newValue + 's' : '5s' }
    },
    routingMark: {
      get() { return this.$props.dial.routing_mark?? 0 },
      set(newValue:number) { this.$props.dial.routing_mark = newValue > 0 ? newValue : 0 }
    },
    optionDetour: {
      get(): boolean { return this.$props.dial.detour != undefined },
      set(v:boolean) { v ? this.$props.dial.detour = this.outTags[0]?? '' : delete this.$props.dial.detour }
    },
    optionBind: {
      get(): boolean { return this.$props.dial.bind_interface != undefined },
      set(v:boolean) { v ? this.$props.dial.bind_interface = '' : delete this.$props.dial.bind_interface }
    },
    optionIPV4: {
      get(): boolean { return this.$props.dial.inet4_bind_address != undefined },
      set(v:boolean) { v ? this.$props.dial.inet4_bind_address = '' : delete this.$props.dial.inet4_bind_address }
    },
    optionIPV6: {
      get(): boolean { return this.$props.dial.inet6_bind_address != undefined },
      set(v:boolean) { v ? this.$props.dial.inet6_bind_address = '' : delete this.$props.dial.inet6_bind_address }
    },
    optionRM: {
      get(): boolean { return this.$props.dial.routing_mark != undefined },
      set(v:boolean) { v ? this.$props.dial.routing_mark = 0 : delete this.$props.dial.routing_mark }
    },
    optionRA: {
      get(): boolean { return this.$props.dial.reuse_addr != undefined },
      set(v:boolean) { v ? this.$props.dial.reuse_addr = true : delete this.$props.dial.reuse_addr }
    },
    optionTCP: {
      get(): boolean { 
        return this.$props.dial.tcp_fast_open != undefined && 
               this.$props.dial.tcp_multi_path != undefined
      },
      set(v:boolean) {
        if (v) {
          this.$props.dial.tcp_fast_open = false
          this.$props.dial.tcp_multi_path = false
        } else {
          delete this.$props.dial.tcp_fast_open
          delete this.$props.dial.tcp_multi_path
        }
      }
    },
    optionUDP: {
      get(): boolean { return this.$props.dial.udp_fragment != undefined },
      set(v:boolean) { v ? this.$props.dial.udp_fragment = true : delete this.$props.dial.udp_fragment }
    },
    optionCT: {
      get(): boolean { return this.$props.dial.connect_timeout != undefined },
      set(v:boolean) { v ? this.$props.dial.connect_timeout = '5s' : delete this.$props.dial.connect_timeout }
    },
    optionDS: {
      get(): boolean { return this.$props.dial.domain_strategy != undefined },
      set(v:boolean) {
        if (v) {
          this.$props.dial.domain_strategy = 'prefer_ipv4'
          this.$props.dial.fallback_delay = '300ms'
        } else {
          delete this.$props.dial.domain_strategy
          delete this.$props.dial.fallback_delay
        }
      }
    }
  }
}
</script>
