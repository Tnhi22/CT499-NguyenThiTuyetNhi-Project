import { NhanVien, TheoDoiMuonSach } from "../models/index.js";

// Tự sinh MSNV
async function generateMSNV() {
  const lastNV = await NhanVien.findOne({}).sort({ MSNV: -1 }).lean();
  if (!lastNV) return "NV001";

  const num = parseInt(lastNV.MSNV.replace("NV", ""), 10);
  const nextNum = num + 1;
  return "NV" + nextNum.toString().padStart(3, "0");
}

// Build search & filter
function buildSearchQuery(search) {
  if (!search) return {};
  const regex = new RegExp(search.trim(), "i");
  return {
    $or: [
      { MSNV: regex },
      { HoTenNV: regex },
      { ChucVu: regex },
      { DiaChi: regex },
      { SoDienThoai: regex },
      { Email: regex },
    ],
  };
}

function buildFilterQuery(filters) {
  const query = {};
  if (filters.chucVu) query.ChucVu = filters.chucVu;
  if (filters.trangThai) query.TrangThai = filters.trangThai;
  return query;
}

export default {
  async getAll(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
      const search = req.query.search || "";
      const sortBy = req.query.sortBy || "MSNV";
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

      const combinedQuery = {
        ...buildSearchQuery(search),
        ...buildFilterQuery(req.query),
      };

      const total = await NhanVien.countDocuments(combinedQuery);
      const data = await NhanVien.find(combinedQuery)
        .select("-Password")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .lean();

      res.json({
        success: true,
        message: "Lấy danh sách nhân viên thành công",
        data: {
          nhanviens: data,
          pagination: {
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            limit,
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
          },
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống",
        error: "GET_ALL_ERROR",
      });
    }
  },

  async create(req, res) {
    try {
      if (!req.body.MSNV) {
        req.body.MSNV = await generateMSNV();
      }

      if (req.body.Email) {
        const existingEmail = await NhanVien.findOne({ Email: req.body.Email });
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: "Email đã được sử dụng",
            error: "DUPLICATE_EMAIL",
          });
        }
      }

      const nhanVien = new NhanVien(req.body);
      await nhanVien.save();

      const responseData = nhanVien.toObject();
      delete responseData.Password;

      res.status(201).json({
        success: true,
        message: "Tạo nhân viên thành công",
        data: responseData,
      });
    } catch (error) {
      console.error(error);
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: Object.values(error.errors).map((e) => e.message),
          error: "VALIDATION_ERROR",
        });
      }
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống",
        error: "CREATE_ERROR",
      });
    }
  },

  // Các method khác (getById, update, remove, toggleActivate, getActive) giữ nguyên từ code bạn đã viết

  async getById(req, res) {
    try {
      const nhanVien = await NhanVien.findById(req.params.id).select(
        "-Password"
      );

      if (!nhanVien) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhân viên",
          error: "NHANVIEN_NOT_FOUND",
        });
      }

      const workStats = await TheoDoiMuonSach.aggregate([
        {
          $match: {
            $or: [
              { NhanVienMuon: nhanVien._id },
              { NhanVienTra: nhanVien._id },
            ],
          },
        },
        {
          $group: {
            _id: null,
            totalBorrowsProcessed: {
              $sum: {
                $cond: [{ $eq: ["$NhanVienMuon", nhanVien._id] }, 1, 0],
              },
            },
            totalReturnsProcessed: {
              $sum: {
                $cond: [{ $eq: ["$NhanVienTra", nhanVien._id] }, 1, 0],
              },
            },
          },
        },
      ]);

      const stats = workStats[0] || {
        totalBorrowsProcessed: 0,
        totalReturnsProcessed: 0,
      };

      res.json({
        success: true,
        message: "Lấy thông tin nhân viên thành công",
        data: {
          nhanVien,
          statistics: {
            totalBorrowsProcessed: stats.totalBorrowsProcessed,
            totalReturnsProcessed: stats.totalReturnsProcessed,
            totalTransactions:
              stats.totalBorrowsProcessed + stats.totalReturnsProcessed,
          },
        },
      });
    } catch (error) {
      console.error("Get NhanVien by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy thông tin nhân viên",
        error: "GET_BY_ID_ERROR",
      });
    }
  },

  async create(req, res) {
    try {
      if (!req.body.MSNV) {
        req.body.MSNV = await generateMSNV();
      }

      if (req.body.Email) {
        const existingEmail = await NhanVien.findOne({ Email: req.body.Email });
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: "Email đã được sử dụng",
            error: "DUPLICATE_EMAIL",
          });
        }
      }

      const nhanVien = new NhanVien(req.body);
      await nhanVien.save();

      const responseData = nhanVien.toObject();
      delete responseData.Password;

      res.status(201).json({
        success: true,
        message: "Tạo nhân viên mới thành công",
        data: responseData,
      });
    } catch (error) {
      console.error("Create NhanVien error:", error);

      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: "Dữ liệu đầu vào không hợp lệ",
          errors,
          error: "VALIDATION_ERROR",
        });
      }

      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          success: false,
          message: `${
            field === "MSNV" ? "Mã số nhân viên" : "Email"
          } đã tồn tại`,
          error: "DUPLICATE_FIELD",
        });
      }

      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi tạo nhân viên",
        error: "CREATE_ERROR",
      });
    }
  },

  async update(req, res) {
    try {
      if (req.body.Password) {
        delete req.body.Password;
      }

      if (req.body.MSNV) {
        const existingNV = await NhanVien.findOne({
          MSNV: req.body.MSNV,
          _id: { $ne: req.params.id },
        });

        if (existingNV) {
          return res.status(400).json({
            success: false,
            message: "Mã số nhân viên đã tồn tại",
            error: "DUPLICATE_MSNV",
          });
        }
      }

      if (req.body.Email) {
        const existingEmail = await NhanVien.findOne({
          Email: req.body.Email,
          _id: { $ne: req.params.id },
        });

        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: "Email đã được sử dụng",
            error: "DUPLICATE_EMAIL",
          });
        }
      }

      const nhanVien = await NhanVien.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).select("-Password");

      if (!nhanVien) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhân viên",
          error: "NHANVIEN_NOT_FOUND",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật thông tin nhân viên thành công",
        data: nhanVien,
      });
    } catch (error) {
      console.error("Update NhanVien error:", error);

      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: "Dữ liệu đầu vào không hợp lệ",
          errors,
          error: "VALIDATION_ERROR",
        });
      }

      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi cập nhật nhân viên",
        error: "UPDATE_ERROR",
      });
    }
  },

  async remove(req, res) {
    try {
      if (req.user && req.user._id.toString() === req.params.id) {
        return res.status(400).json({
          success: false,
          message: "Không thể xóa tài khoản của chính mình",
          error: "CANNOT_DELETE_SELF",
        });
      }

      const transactionCount = await TheoDoiMuonSach.countDocuments({
        $or: [{ NhanVienMuon: req.params.id }, { NhanVienTra: req.params.id }],
      });

      if (transactionCount > 0) {
        return res.status(400).json({
          success: false,
          message: "Không thể xóa nhân viên đã xử lý giao dịch",
          error: "HAS_TRANSACTIONS",
        });
      }

      const nhanVien = await NhanVien.findByIdAndDelete(req.params.id);

      if (!nhanVien) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhân viên",
          error: "NHANVIEN_NOT_FOUND",
        });
      }

      res.json({
        success: true,
        message: "Xóa nhân viên thành công",
        data: { deletedId: req.params.id },
      });
    } catch (error) {
      console.error("Delete NhanVien error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi xóa nhân viên",
        error: "DELETE_ERROR",
      });
    }
  },

  async getActive(req, res) {
    try {
      const nhanViens = await NhanVien.find({ TrangThai: "Đang làm việc" })
        .select("_id MSNV HoTenNV ChucVu")
        .sort({ HoTenNV: 1 });

      res.json({
        success: true,
        message: "Lấy danh sách nhân viên hoạt động thành công",
        data: nhanViens,
      });
    } catch (error) {
      console.error("Get active employees error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy danh sách nhân viên hoạt động",
        error: "GET_ACTIVE_ERROR",
      });
    }
  },

  async toggleActivate(req, res) {
    try {
      const nhanVien = await NhanVien.findById(req.params.id);

      if (!nhanVien) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhân viên",
          error: "NHANVIEN_NOT_FOUND",
        });
      }

      nhanVien.isActivate = nhanVien.isActivate === 1 ? 0 : 1;
      await nhanVien.save();

      const responseData = nhanVien.toObject();
      delete responseData.Password;

      res.json({
        success: true,
        message: `${
          nhanVien.isActivate === 1 ? "Kích hoạt" : "Vô hiệu hóa"
        } nhân viên thành công`,
        data: responseData,
      });
    } catch (error) {
      console.error("Toggle activate NhanVien error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi thay đổi trạng thái kích hoạt",
        error: "TOGGLE_ACTIVATE_ERROR",
      });
    }
  },
};
