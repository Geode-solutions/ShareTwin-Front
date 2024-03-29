<template>
  <v-text-field
    v-model="search"
    append-icon="mdi-magnify"
    label="Search"
    single-line
    hide-details
  ></v-text-field>
  <v-data-table
    v-model="selected_crs"
    :v-model:items-per-page="10"
    :headers="headers"
    :items="crs_list"
    item-value="code"
    class="elevation-1"
    density="compact"
    fixed-header
    select-strategy="single"
    show-select
    :search="search"
    :loading="data_table_loading"
    loading-text="Loading... Please wait"
  ></v-data-table>
</template>

<script setup>
  import { useToggle } from "@vueuse/core"

  const app_store = use_app_store()

  const props = defineProps({
    crs_key: { type: String, required: true },
  })

  const { crs_key } = props

  const { object_tree, object_tree_index } = storeToRefs(app_store)

  const stepper_tree = inject("stepper_tree")

  const geode_object = object_tree.value[object_tree_index.value].geode_object

  const search = ref("")
  const data_table_loading = ref(false)
  const crs_list = ref([])
  const selected_crs = ref([])
  const toggle_loading = useToggle(data_table_loading)

  watch(selected_crs, (new_value) => {
    const crs = get_selected_crs(new_value[0])
    set_crs(crs_key, crs)
  })

  function set_crs(crs_key, crs_value) {
    stepper_tree[crs_key] = crs_value
    stepper_tree.current_step_index++
  }

  function get_selected_crs(crs_code) {
    for (let i = 0; i <= crs_list.value.length; i++) {
      if (crs_list.value[i]["code"] == crs_code) {
        return crs_list.value[i]
      }
    }
  }

  async function get_crs_table() {
    let params = new FormData()
    params.append("geode_object", geode_object)
    const route = `/geographic_coordinate_systems`
    toggle_loading()
    await api_fetch(
      route,
      { method: "POST", body: params },
      {
        request_error_function: () => {
          toggle_loading()
        },
        response_function: (response) => {
          toggle_loading()
          crs_list.value = response._data.crs_list
        },
        response_error_function: () => {
          toggle_loading()
        },
      },
    )
  }

  const headers = [
    {
      title: "Authority",
      align: "start",
      sortable: true,
      key: "authority",
    },
    { title: "Code", align: "end", key: "code" },
    { title: "Name", align: "end", key: "name" },
  ]

  onMounted(() => {
    get_crs_table()
  })
</script>
