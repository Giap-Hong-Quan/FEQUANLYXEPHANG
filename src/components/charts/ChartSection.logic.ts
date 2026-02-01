import { error } from "console";
import { resolve } from "path"

export const getChartData = async (optionSelected: string): Promise<{ name: string, value: number }[]> => {
    const token = localStorage.getItem('token');
    return new Promise(resolve => {
        let currentMonth = 1; // Khởi tạo bắt đầu từ tháng 1 theo yêu cầu
        if (optionSelected == "0")
            fetch(process.env.REACT_APP_API_URL + 'api/Assignment/statisticbymonth/' + currentMonth + '/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                    resolve(data)
                })
                .catch(error => console.log(error))
        else if (optionSelected == "1") {
            fetch(process.env.REACT_APP_API_URL + 'api/Assignment/statisticbyweek/' + currentMonth + '/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                    resolve(data)
                })
                .catch(error => console.log(error))
        }
        else {
            fetch(process.env.REACT_APP_API_URL + 'api/Assignment/statisticbyyear/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                    resolve(data)
                })
                .catch(error => console.log(error))
        }
    })
}