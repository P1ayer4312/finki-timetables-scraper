import fetch from 'node-fetch';

function convertDayFormat(daysString) {
	switch (daysString) {
		case '10000': {
			return 'Понеделник';
		}
		case '01000': {
			return 'Вторник';
		}
		case '00100': {
			return 'Среда';
		}
		case '00010': {
			return 'Четврток';
		}
		case '00001': {
			return 'Петок';
		}
		default: {
			return 'NO_DAY_PROVIDED';
		}
	}
}

async function fetchData() {
	const data = await fetch("https://finki.edupage.org/timetable/server/regulartt.js?__func=regularttGetData", {
		"credentials": "include",
		"body": "{\"__args\":[null,\"18\"],\"__gsh\":\"00000000\"}",
		"method": "POST",
	}).then(r => r.json());

	const tables = data.r.dbiAccessorRes.tables;

	const teachersDict = {};
	const subjectsDict = {};
	const classesDict = {};
	const classroomsDict = {};
	const lessonsDict = {};
	const periods = tables.find(el => el.id === "periods").data_rows;
	const cards = tables.find(el => el.id === "cards").data_rows;

	tables.find(el => el.id === "teachers").data_rows.map(item => teachersDict[item.id] = item.short);
	tables.find(el => el.id === "subjects").data_rows.map(item => subjectsDict[item.id] = item.name);
	tables.find(el => el.id === "classes").data_rows.map(item => classesDict[item.id] = item.name);
	tables.find(el => el.id === "classrooms").data_rows
		.forEach(item => {
			classroomsDict[item.id] = {
				short: item.short,
				name: item.name,
			};
		});

	tables.find(el => el.id === "lessons").data_rows
		.forEach(item => {
			const teachersArray = [];
			const classesArray = [];
			const card = cards.find(el => el.lessonid === item.id);
			const startPeriod = periods.find(el => el.period === card.period);
			const endPeriod = periods.find(el => el.period == parseInt(card.period) + parseInt(item.durationperiods) - 1);

			item.teacherids.forEach(id => {
				teachersArray.push(teachersDict[id]);
			});
			item.classids.forEach(id => {
				classesArray.push(classesDict[id]);
			});

			lessonsDict[item.id] = {
				subject: subjectsDict[item.subjectid],
				teachers: teachersArray,
				classes: classesArray,
				classroom: classroomsDict[item.classroomidss[0]],
				day: convertDayFormat(card.days),
				time: {
					start: {
						name: startPeriod.name,
						startTime: startPeriod.starttime,
						endTime: startPeriod.endtime,
					},
					end: {
						name: endPeriod.name,
						startTime: endPeriod.starttime,
						endTime: endPeriod.endtime,
					}
				}
			};
		});

	return lessonsDict;
}

export default fetchData;

// === r.dbiAccessorRes.tables data map
/**
 index 		id				  description
		 1	:	periods	 		- lecture start and end time "names"
		 7	:	days			- names of days of the week
		11	:	classrooms 		- lecture location
		12	:	classes			- college major
		13	:	subjects		- list of subjects
		14	:	teachers		- teachers' names
		18	:	lessons			- informations about a specific lecture
		20	:	cards			- extra informations about a lecture
 */