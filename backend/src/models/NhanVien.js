import mongoose from "mongoose";
import bcrypt from "bcrypt";

const NhanVienSchema = new mongoose.Schema(
  {
    MSNV: {
      type: String,
      required: [true, "Mã số nhân viên là bắt buộc"],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^NV\d{3,}$/, "Mã nhân viên phải có định dạng NV001, NV002, ..."],
    },
    HoTenNV: {
      type: String,
      required: [true, "Họ tên nhân viên là bắt buộc"],
      trim: true,
      maxlength: [100, "Họ tên không được vượt quá 100 ký tự"],
    },
    Password: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
    ChucVu: {
      type: String,
      required: [true, "Chức vụ là bắt buộc"],
      enum: {
        values: ["Quản lý thư viện", "Thủ thư", "Nhân viên", "Thực tập sinh"],
        message: "Chức vụ không hợp lệ",
      },
    },
    DiaChi: {
      type: String,
      required: [true, "Địa chỉ là bắt buộc"],
      trim: true,
      maxlength: [200, "Địa chỉ không được vượt quá 200 ký tự"],
    },
    SoDienThoai: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc"],
      trim: true,
      match: [/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"],
    },
    Email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Email không hợp lệ",
      ],
    },
    NgaySinh: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          const today = new Date();
          const age = today.getFullYear() - value.getFullYear();
          return age >= 18 && age <= 65;
        },
        message: "Tuổi nhân viên phải từ 18 đến 65",
      },
    },
    NgayVaoLam: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Ngày vào làm không được là ngày tương lai",
      },
    },
    TrangThai: {
      type: String,
      enum: {
        values: ["Đang làm việc", "Nghỉ phép", "Đã nghỉ việc"],
        message: "Trạng thái không hợp lệ",
      },
      default: "Đang làm việc",
    },
    Quyen: {
      type: [String],
      enum: {
        values: [
          "doc_gia",
          "sach",
          "nha_xuat_ban",
          "muon_tra",
          "thong_ke",
          "quan_ly",
        ],
        message: "Quyền không hợp lệ",
      },
      default: ["doc_gia", "sach", "muon_tra"],
    },
    isActivate: {
      type: Number,
      enum: [0, 1],
      default: 0,
      required: true,
    },
    LanDangNhapCuoi: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "nhanviens",
  }
);

// Virtual ThoiGianLamViec
NhanVienSchema.virtual("ThoiGianLamViec").get(function () {
  if (!this.NgayVaoLam) return 0;
  const today = new Date();
  const diffTime = today - this.NgayVaoLam;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
});

// Serialize virtuals & remove password
NhanVienSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.Password;
    return ret;
  },
});
NhanVienSchema.set("toObject", { virtuals: true });

// Pre-save: hash password
NhanVienSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save: capitalize name
NhanVienSchema.pre("save", function (next) {
  if (this.HoTenNV) {
    this.HoTenNV = this.HoTenNV.replace(/\b\w/g, (l) => l.toUpperCase());
  }
  next();
});

// Methods
NhanVienSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.Password);
};

NhanVienSchema.methods.updateLastLogin = function () {
  this.LanDangNhapCuoi = new Date();
  return this.save();
};

NhanVienSchema.methods.hasPermission = function (permission) {
  return this.Quyen.includes(permission) || this.Quyen.includes("quan_ly");
};

// Statics
NhanVienSchema.statics.findActive = function () {
  return this.find({ TrangThai: "Đang làm việc" });
};

NhanVienSchema.statics.authenticate = async function (msnv, password) {
  const nhanVien = await this.findOne({
    MSNV: msnv.toUpperCase(),
    TrangThai: "Đang làm việc",
    isActivate: 1,
  });
  if (!nhanVien) return null;
  const isMatch = await nhanVien.comparePassword(password);
  if (!isMatch) return null;
  await nhanVien.updateLastLogin();
  return nhanVien;
};

export default mongoose.model("NhanVien", NhanVienSchema);
