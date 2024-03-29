<template>
  <v-badge
    :icon="display_badge ? 'mdi-check' : 'mdi-help'"
    :color="display_color ? 'black' : 'grey'"
  >
    <v-tooltip v-model="show_tooltip" location="right" :text="tooltip">
      <template v-slot:activator="{ props }">
        <v-btn icon flat @click="open_file_input()" v-bind="props">
          <v-icon
            icon="mdi-file-image-plus"
            :color="display_color ? 'black' : 'grey'"
          />
        </v-btn>
      </template>
    </v-tooltip>
  </v-badge>
</template>

<script setup>
  const app_store = use_app_store()
  const websocket_store = use_websocket_store()

  const props = defineProps({
    object_tree_index: { type: Number, required: true },
    texture_index: { type: Number, required: true },
  })

  const { object_tree_index, texture_index } = props

  const raster_image_input_extensions = ref("")
  const texture_file = ref([])
  const viewable_file_name = ref("")

  const display_color = ref(false)
  const display_badge = ref(false)

  const show_tooltip = ref(false)
  const tooltip = ref("")

  async function get_raster_image_input_extensions() {
    websocket_store.$patch({ busy: true })
    const params = new FormData()
    params.append("geode_object", "RasterImage2D")
    await api_fetch(
      `/geode_object_allowed_files`,
      {
        body: params,
        method: "POST",
      },
      {
        response_function: (response) => {
          raster_image_input_extensions.value = response._data.extensions
            .map((extension) => "." + extension)
            .join(",")
        },
      },
    )
    websocket_store.$patch({ busy: false })
  }

  function open_file_input() {
    var input = document.createElement("input")
    input.type = "file"
    input.accept = raster_image_input_extensions.value
    input.multiple = false

    input.onchange = (e) => {
      texture_file.value = e.target.files
      show_tooltip.value = true
      tooltip.value = texture_file.value[0].name
    }
    input.click()
  }

  function convert_raster_image() {
    display_color.value = true
    websocket_store.$patch({ busy: true })
    const reader = new FileReader()
    reader.onload = async function (event) {
      const params = new FormData()
      params.append("geode_object", "RasterImage2D")
      params.append("file", event.target.result)
      params.append("old_file_name", texture_file.value[0].name)
      params.append("file_size", texture_file.value[0].size)

      await api_fetch(
        `/convert_file`,
        {
          body: params,
          method: "POST",
        },
        {
          response_function: (response) => {
            viewable_file_name.value = response._data.viewable_file_name
            display_badge.value = true
          },
          response_error_function: () => {
            display_color.value = false
            display_badge.value = false
          },
        },
      )
      websocket_store.$patch({ busy: false })
    }
    reader.readAsDataURL(texture_file.value[0])
  }

  onMounted(() => {
    get_raster_image_input_extensions()
  })

  watch(texture_file, () => {
    convert_raster_image()
  })
  watch(viewable_file_name, async (new_value) => {
    app_store.modify_texture_object(
      object_tree_index,
      texture_index,
      "texture_file_name",
      new_value,
    )
  })
</script>
