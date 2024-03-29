<template>
  <v-expansion-panel-title>
    <v-row>
      <v-col cols="1" class="pa-0 align-self-center">
        <v-tooltip text="Toggle object's visibility" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              flat
              icon
              small
              v-on:click.stop="
                app_store.toggle_object_visibility(object_tree_index)
              "
              v-bind="props"
            >
              <v-icon>
                {{
                  object_tree[object_tree_index].is_visible
                    ? "mdi-checkbox-marked-outline"
                    : "mdi-checkbox-blank-outline"
                }}
              </v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </v-col>
      <v-col cols="1" class="pa-0 align-self-center">
        <v-tooltip
          :text="object_tree[object_tree_index].geode_object"
          location="bottom"
        >
          <template v-slot:activator="{ props }">
            <v-img
              :src="
                geode_objects[object_tree[object_tree_index].geode_object].image
              "
              width="35"
              v-bind="props"
            />
          </template>
        </v-tooltip>
      </v-col>
      <v-col cols="9" class="align-self-center">
        <h4 class="overflow-x-hidden">
          {{ object_tree[object_tree_index].name }}
        </h4>
      </v-col>
      <v-spacer />
      <v-col cols="1" class="pa-0 align-self-center">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon flat size="15" v-bind="props">
              <v-icon icon="mdi-dots-vertical" />
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(menu, i) in menus"
              :key="i"
              :value="index"
              @click="menu.function(object_tree_index)"
            >
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-expansion-panel-title>
  <v-expansion-panel-text>
    <LeftTextureMenu :object_tree_index="object_tree_index" />
    <LeftCoordinateSystems :object_tree_index="object_tree_index" />
  </v-expansion-panel-text>
</template>

<script setup>
  import geode_objects from "@geode/opengeodeweb-front/assets/geode_objects"
  import { storeToRefs } from "pinia"

  const app_store = use_app_store()

  const props = defineProps({
    object_tree_index: { type: Number, required: true },
  })

  const { object_tree_index } = props
  const { object_tree } = storeToRefs(app_store)

  const menus = [{ title: "Delete", function: app_store.delete_object }]
</script>

<style scoped>
  .v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
    padding: 4px 4px 4px 15px !important;
  }
</style>
