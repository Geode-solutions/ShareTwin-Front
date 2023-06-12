import { defineStore } from 'pinia'
import { use_vtk_store } from './vtk'
import { use_ws_link_store } from './ws_link'

export const use_app_store = defineStore('app', {
  state: () => ({
    display_menu: true,
    display_object_selector: false,
    display_georeferencing_drawer: true,
    picking_mode: false,
    object_tree: [],
    picked_point_index: 0,
    picked_points: [
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },]
  }),
  getters: {
    are_textures_valid: (state) => (object_tree_index) => {
      const textures = state.object_tree[object_tree_index].textures

      for (let i = 0; i < textures.length; i++) {
        const texture = textures[i]

        if (texture.texture_name.is_valid === false || texture.texture_file_name.is_valid === false) {
          return false
        }
      }
      return true
    }
  },
  actions: {
    add_object_tree_item (object_tree_item) {
      object_tree_item.is_visible = true
      object_tree_item.textures = [create_texture_item()]

      this.object_tree.push(object_tree_item)
    },
    remove_object_tree_item (object_tree_index) {
      this.object_tree.splice(object_tree_index, 1)
    },
    toggle_object_visibility (object_tree_index) {
      const vtk_store = use_vtk_store()
      const ws_link_store = use_ws_link_store()
      this.object_tree[object_tree_index].is_visible = !this.object_tree[object_tree_index].is_visible
      const id = this.object_tree[object_tree_index]['id']
      const is_visible = this.object_tree[object_tree_index].is_visible
      ws_link_store.$patch({ busy: true })
      vtk_store.toggle_object_visibility({ id, is_visible })
      ws_link_store.$patch({ busy: false })
    },
    add_texture_object (object_tree_index) {
      this.object_tree[object_tree_index].textures.push(create_texture_item())
    },
    remove_texture_object (object_tree_index, texture_index) {
      this.object_tree[object_tree_index].textures.splice(texture_index, 1)
    },

    modify_texture_object (object_tree_index, texture_index, key, value) {
      const current_item = this.object_tree[object_tree_index]
      const current_texture = current_item.textures[texture_index]
      current_texture[key].value = value
    },
    apply_textures (object_tree_index) {
      const ws_link_store = use_ws_link_store()
      const vtk_store = use_vtk_store()
      const current_object = this.object_tree[object_tree_index]
      const id = current_object.id
      const textures = current_object.textures

      ws_link_store.$patch({ busy: true })
      vtk_store.apply_textures({ id, textures })
      ws_link_store.$patch({ busy: false })
    },
    toggle_picking_mode (value) {
      this.picking_mode = value
      console.log('picking_mode', this.picking_mode)
    },
    toggle_display_georeferencing_drawer (value) {
      this.display_georeferencing_drawer = value
      console.log('display_georeferencing_drawer', this.display_georeferencing_drawer)
    },
    set_picked_point_index (index) {
      this.picked_point_index = index
      console.log('picked_point_index ', this.picked_point_index)
    },
    set_picked_point (x, y) {
      console.log('set_picked_point')
      console.log('picked_point_index', this.picked_point_index)
      this.picked_points[this.picked_point_index].x = x
      this.picked_points[this.picked_point_index].y = y
      this.picking_mode = false
      console.log('picking_mode', this.picking_mode)
      console.log('picked_points', this.picked_points)
    }
  }
})
