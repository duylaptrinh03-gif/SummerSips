import { CartItem } from "./cart";

export type TrangThaiDonHang =
  | "cho_xac_nhan"   // Chờ xác nhận
  | "dang_pha_che"   // Đang pha chế
  | "dang_giao"      // Đang giao
  | "hoan_thanh"     // Hoàn thành
  | "da_huy";        // Đã hủy

export interface ThongTinNhan {
  hoTen: string;
  soDienThoai: string;
  diaChi: string;       // Địa chỉ giao hàng
}

export interface Order {
  id: string;                   // e.g. "ORD-1713161234567"
  items: CartItem[];
  thongTinNhan: ThongTinNhan;
  tongTien: number;
  trangThai: TrangThaiDonHang;
  taoLuc: string;               // ISO string
}

// Label hiển thị cho từng trạng thái
export const TRANG_THAI_LABEL: Record<TrangThaiDonHang, string> = {
  cho_xac_nhan: "Chờ xác nhận",
  dang_pha_che: "Đang pha chế",
  dang_giao: "Đang giao hàng",
  hoan_thanh: "Hoàn thành",
  da_huy: "Đã hủy",
};
