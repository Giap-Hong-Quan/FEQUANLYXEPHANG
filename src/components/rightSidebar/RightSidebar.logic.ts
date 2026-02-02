import { fetchWithTokenRetry } from "../../helpers/tokens";

/**
 * Hàm lấy dữ liệu tổng quan cho RightSidebar.
 * Thực hiện gọi 3 API khác nhau để lấy thông tin về Thiết bị, Dịch vụ và Thống kê Cấp số.
 * Dữ liệu được gom lại thành một mảng và trả về cho Component sử dụng.
 */
export const getSummaryData = async (): Promise<any> => {
    // Khởi tạo các biến để lưu trữ dữ liệu từ các API khác nhau
    let data1: any = {}; // Chứa dữ liệu về Thiết bị (Devices)
    let data2: any = {}; // Chứa dữ liệu về Dịch vụ (Services)
    let data3: any = {}; // Chứa dữ liệu thống kê Cấp số (Assignments/Statistic)

    // Bước 1: Gọi API lấy thông tin Thiết bị
    let url = process.env.REACT_APP_API_URL + 'api/Device/devicesinfor';
    let response = await fetchWithTokenRetry(url);
    if (response.ok) {
        data1 = await response.json();
        console.log("Dữ liệu Thiết bị đã được tải:", data1);
    } else {
        console.error("Lỗi khi tải dữ liệu Thiết bị, mã trạng thái:", response.status);
    }

    // Bước 2: Gọi API lấy thông tin Dịch vụ
    url = process.env.REACT_APP_API_URL + 'api/Service/serviceinfor';
    response = await fetchWithTokenRetry(url);
    if (response.ok) {
        data2 = await response.json();
        console.log("Dữ liệu Dịch vụ đã được tải:", data2);
    } else {
        console.error("Lỗi khi tải dữ liệu Dịch vụ, mã trạng thái:", response.status);
    }

    // Bước 3: Gọi API lấy dữ liệu thống kê Cấp số (Statistic)
    url = process.env.REACT_APP_API_URL + 'api/Assignment/statistic';
    response = await fetchWithTokenRetry(url);
    if (response.ok) {
        data3 = await response.json();
        console.log("Dữ liệu Thống kê đã được tải:", data3);
    } else {
        console.error("Lỗi khi tải dữ liệu Thống kê, mã trạng thái:", response.status);
    }

    // Trả về một Promise chứa mảng 3 đối tượng dữ liệu đã lấy được
    return new Promise(resolve => {
        resolve([data1, data2, data3]);
    });
}