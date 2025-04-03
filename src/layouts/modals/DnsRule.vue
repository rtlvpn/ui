<template>
  <v-dialog transition="dialog-bottom-transition" width="800">
    <v-card class="rounded-lg">
      <v-card-title>
        {{ $t('actions.' + title) + " " + $t('objects.dnsrule') }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text style="padding: 0 16px;">
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-switch color="primary" v-model="logical" :label="$t('rule.logical')" hide-details></v-switch>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto" v-if="logical" justify="center" align="center">
            <v-btn color="primary" @click="ruleData.rules.push(<dnsRule>{})" hide-details>{{ $t('actions.add') + " " + $t('objects.rule') }}</v-btn>
          </v-col>
        </v-row>
        <v-card style="background-color: inherit; margin-bottom: 5px;" v-for="(r, index) in ruleData.rules" v-if="ruleData.type == 'logical'">
          <v-card-subtitle>{{ $t('objects.rule') + ' ' + (index+1) }}
            <v-icon @click="ruleData.rules.splice(index,1)" icon="mdi-delete" v-if="ruleData.rules.length>1" />
          </v-card-subtitle>
          <v-card-text style="padding: 0;">
            <RuleOptions
              :rule="r"
              :clients="clients"
              :inTags="inTags" />
          </v-card-text>
        </v-card>
        <RuleOptions
          v-else
          :rule="ruleData.rules[0]"
          :clients="clients"
          :inTags="inTags" />
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="ruleData.action"
              :items="actions"
              :label="$t('admin.action')"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4" v-if="logical">
            <v-combobox
              v-model="ruleData.mode"
              :items="['and', 'or']"
              :label="$t('rule.mode')"
              hide-details
            ></v-combobox>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-switch color="primary" v-model="ruleData.invert" :label="$t('rule.invert')" hide-details></v-switch>
          </v-col>
        </v-row>
        <v-card subtitle="Route" v-if="['route', 'route-options'].includes(ruleData.action)">
          <v-row v-if="ruleData.action == 'route'">
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="ruleData.server"
                :items="serverTags"
                :label="$t('basic.dns.server')"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="ruleData.strategy"
                :items="strategies"
                :label="$t('rule.strategy')"
                clearable
                @click:clear="delete ruleData.strategy"
                hide-details>
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="ruleData.disable_cache" label="Disable cache" hide-details></v-switch>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model.number="ruleData.rewrite_ttl" type="number" min="0" label="Rewrite TTL" hide-details></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="ruleData.client_subnet" label="Client subnet" hide-details></v-text-field>
            </v-col>
          </v-row>
        </v-card>
        <v-card subtitle="Reject" v-if="ruleData.action == 'reject'">
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="ruleData.method"
                :items="[{ title: 'Default', value: 'default' },{ title: 'Drop', value: 'drop'}]"
                :label="$t('rule.method')"
                clearable
                @click:clear="delete ruleData.method"
                hide-details>
            </v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="ruleData.no_drop" :label="$t('rule.noDrop')" hide-details></v-switch>
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="outlined"
          @click="closeModal"
        >
          {{ $t('actions.close') }}
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="tonal"
          :loading="loading"
          @click="saveChanges"
        >
          {{ $t('actions.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { logicalDnsRule, dnsRule, actionDnsRuleKeys } from '@/types/dnsrules'
import RuleOptions from '@/components/DnsRule.vue'
export default {
  props: ['visible', 'data', 'index', 'clients', 'inTags', 'serverTags'],
  emits: ['close', 'save'],
  data() {
    return {
      title: 'add',
      loading: false,
      ruleData: <any>{
        type: 'logical',
        mode: 'and',
        rules: <dnsRule[]>[{}],
        invert: false,
        action: 'route',
        server: 'local',
      },
      actions: [
        { title: 'Route', value: 'route'},
        { title: 'Route Options', value: 'route-options'},
        { title: 'Reject', value: 'reject'},
      ],
      strategies: [
        { title: 'Prefer IPv4', value: 'prefer_ipv4' },
        { title: 'Prefer IPv6', value: 'prefer_ipv6' },
        { title: 'IPv4 Only', value: 'ipv4_only' },
        { title: 'IPv6 Only', value: 'ipv6_only' },
      ]
    }
  },
  methods: {
    updateData() {
      if (this.$props.index != -1) {
        const newData = JSON.parse(this.$props.data)
        if (newData.type) {
          this.ruleData = newData
        } else {
          this.ruleData = {
            type: 'simple',
            mode: 'and',
            rules: <dnsRule[]>[{}],
          }
          Object.keys(newData).forEach(key => {
            if (actionDnsRuleKeys.includes(key)) {
              this.ruleData[key] = newData[key]
            } else {
              this.ruleData.rules[0][key] = newData[key]
            }
          })
        }
        this.title = 'edit'
      }
      else {
        this.ruleData = <logicalDnsRule>{
            type: 'simple',
            mode: 'and',
            rules: <dnsRule[]>[{}],
            invert: false,
            action: 'route',
            server: this.$props.serverTags[0]?? 'local',
          }
        this.title = 'add'
      }
    },
    closeModal() {
      this.$emit('close')
    },
    saveChanges() {
      this.loading = true
      let newRule = <any>{
        action: this.ruleData.action,
        invert: this.ruleData.invert? this.ruleData.invert : undefined,
      }

      // Filter action data
      switch (newRule.action){
        case 'route':
          newRule.server = this.ruleData.server
          newRule.strategy = this.ruleData.network_strategy?.length > 0 ? this.ruleData.network_strategy : undefined
          newRule.disable_cache = this.ruleData.disable_cache? true : undefined
          newRule.rewrite_ttl = this.ruleData.rewrite_ttl > 0 ? this.ruleData.rewrite_ttl : undefined
          newRule.client_subnet = this.ruleData.client_subnet?.length > 0 ? this.ruleData.client_subnet : undefined
          break
        case 'route-options':
          newRule.disable_cache = this.ruleData.disable_cache? true : undefined
          newRule.rewrite_ttl = this.ruleData.rewrite_ttl > 0 ? this.ruleData.rewrite_ttl : undefined
          newRule.client_subnet = this.ruleData.client_subnet?.length > 0 ? this.ruleData.client_subnet : undefined
          break
        case 'reject':
          newRule.method = this.ruleData.method?.length > 0 ? this.ruleData.method : undefined
          newRule.no_drop = this.ruleData.no_drop? true : undefined
          break
      }

      // Add rules
      if (this.ruleData.type == 'simple'){
        newRule = { ...this.ruleData.rules[0], ...newRule }
      } else {
        newRule.type = 'logical'
        newRule.mode = this.ruleData.mode
        newRule.rules = this.ruleData.rules
      }
      this.$emit('save', newRule)
      this.loading = false
    },
    deleteRule(index:number) {
      this.ruleData.rules.splice(index,1)
    }
  },
  computed: {
    logical: {
      get() { return this.ruleData.type == 'logical' },
      set(v:boolean) {
        this.ruleData.type = v? 'logical' : 'simple'
      }
    }
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.updateData()
      }
    },
  },
  components: { RuleOptions }
}

</script>