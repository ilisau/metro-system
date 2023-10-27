import {FlowMeasurement} from "../model/FlowMeasurement";
import {ScheduleMeasurement} from "../model/ScheduleMeasurement";

function interpolateArray(data: FlowMeasurement[], interval: number) {
    const newData = [];
    newData.push(data[0]);
    for (let i = 0; i < data.length - 1; i++) {
        const additional = interpolate(data[i], data[i + 1], interval);
        newData.push(...additional);
    }
    return [...new Set(newData)]
}

function interpolate(data1: FlowMeasurement, data2: FlowMeasurement, interval: number) {
    const firstDate = parseDate(data1.time);
    const secondDate = parseDate(data2.time);
    const timeDifference = (secondDate.getTime() - firstDate.getTime()) / 1000;
    const additional = [];
    const counter = Math.floor(timeDifference / interval);
    const additionalAmount = (data2.amount - data1.amount) / timeDifference;
    for (let i = 0; i < counter; i++) {
        const time = new Date(firstDate.getTime() + (i + 1) * interval * 1000);
        const amount = data1.amount + (i + 1) * Math.floor(additionalAmount * interval);
        additional.push({
            time: `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
            amount: amount
        })
    }
    return additional;
}

function parseDate(str: string): Date {
    const [hours, minutes] = str.split(':');
    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    date.setSeconds(0);
    return date;
}

export function generateSchedule(data: FlowMeasurement[], capacity: number, accuracy: number = 3, fullness: number = 0.9): ScheduleMeasurement[] {
    const interval = 60;
    const interpolatedData = interpolateArray(data, interval);
    const schedule = [];
    let amountOfPeople = 0;
    let additional = interval / accuracy;
    for (let i = 0; i < interpolatedData.length; i++) {
        for (let j = 0; j < accuracy; j++) {
            if (amountOfPeople >= capacity * fullness) {
                const peopleLeft = Math.max(amountOfPeople - capacity, 0);
                const date = new Date(parseDate(interpolatedData[i].time).getTime() + j * 1000 * additional);
                const obj = {
                    time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                    took: amountOfPeople - peopleLeft,
                    left: peopleLeft
                };
                amountOfPeople = peopleLeft;
                schedule.push(obj);
            }
            amountOfPeople += Math.floor(interpolatedData[i].amount / accuracy);

        }
    }
    return schedule;
}

export function getAverageInterval(data: ScheduleMeasurement[]) {
    let allTime = 0;
    for (let i = 1; i < data.length; i++) {
        const firstDate = parseDate(data[i - 1].time);
        const secondDate = parseDate(data[i].time);
        allTime += (secondDate.getTime() - firstDate.getTime()) / 1000;
    }
    return Math.floor(allTime / data.length);
}