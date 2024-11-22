'use strict'
let absence = 0
let cancelled = 0


function getData(rows){
	const endPoits = getEndpoints(rows)
	const slicedData = sliceData(rows, endPoits)
	const cleanedData = cleanData(slicedData)
	const data = formatData(cleanedData)
	return {
		data,
		cancelled,
		absence
	}
}

function getEndpoints(rows){
	const endPoits = []
	rows.forEach((row, index) => {
		if(row[config.schema.doctorColumn] === 'Medico'){
			endPoits.push(index)
		}else return false
	})
	return endPoits
}

function sliceData(rows, endPoits) {
	let data = []
	endPoits.forEach((endPoit, index) => {
		const $rows = rows
		const leght = !!(endPoits[index + 1]) ? (endPoits[index + 1]) : -1
		const filtered = $rows.slice(endPoit, leght)
		data.push(filtered)
	})

	return data
}

function cleanData(slicedData){
	let data = []
	slicedData.forEach((group) => {
		const filter = group.filter((row) => {
			if(row[config.schema.stateColumn] == 'Incumplida') absence +=1
			if(row[config.schema.stateColumn] == 'Cancelada') cancelled +=1
			return row[config.schema.stateColumn] != null
		})
		data.push({
			document: group[0][config.schema.documentColumn],
			name: group[0][config.schema.nameColumn],
			data: filter
		})
	})
	return data
}

function formatData(cleanedData){
	let data = []
	cleanedData.forEach((group) => {
		let filterDate = []
		let totalMonth = 0, totalAbscence = 0, totalCancelled = 0
		for(let i = 1; i <= 31; i++){
			let firstTime = group.data.filter((row) => {
				return moment(row[config.schema.dateColumn]).format("D") == i && row[config.schema.typeColumn] == 'Primera_Vez'
			})
			let control = group.data.filter((row) => {
				return moment(row[config.schema.dateColumn]).format("D") == i && row[config.schema.typeColumn] == 'Control'
			})
			let total = group.data.filter((row) => {
				return moment(row[config.schema.dateColumn]).format("D") == i
			})
			totalMonth += total.length
			totalAbscence += group.data.filter((row) => {
				return moment(row[config.schema.dateColumn]).format("D") == i && row[config.schema.stateColumn] == 'Incumplida'
			}).length
			totalCancelled += group.data.filter((row) => {
				return moment(row[config.schema.dateColumn]).format("D") == i && row[config.schema.stateColumn] == 'Cancelada'
			}).length
			filterDate.push({index: i, total: total.length, firstTime: firstTime.length, control: control.length})
		}
		data.push({
			document: group.document,
			name: group.name,
			rows: filterDate,
			totalMonth,
			totalAbscence,
			totalCancelled
		})
	})
	return data
}