'use strict'
const { createApp, ref } = Vue

const app = createApp({
   setup() {
		const message = config || ''
		function test(event){
			const $_self = this
			this.file = true

			readXlsxFile(event.target.files[0]).then(function(rows) {
				const $data = getData(rows)
				$_self.info_data = $data
				$_self.complete = true
			})
		}
      return {
		  test,
		  message
      }
   },
	data() {
		return {
			file: false,
			complete: false,
			info_data: {},
			users: config.users,
			testing: 0
		}
	}
})	